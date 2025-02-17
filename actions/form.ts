"use server";

import { prisma } from "@/lib/prisma";
import { formSchema, FormSchemaType } from "@/schema/form";
import { getCurrentUser } from "@/lib/auth";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new UserNotFoundErr();
    }

    const stats = await prisma.form.aggregate({
      where: { userId: user.id },
      _sum: { visits: true, submissions: true },
    });

    return {
      visits: stats._sum.visits ?? 0,
      submissions: stats._sum.submissions ?? 0,
      submissionRate: stats._sum.visits ? ((stats._sum.submissions ?? 0) / stats._sum.visits) * 100 : 0,
      bounceRate: stats._sum.visits ? 100 - ((stats._sum.submissions ?? 0) / stats._sum.visits) * 100 : 100,
    };
  } catch (error) {
    console.error("Error fetching form stats:", error);
    return { visits: 0, submissions: 0, submissionRate: 0, bounceRate: 100 };
  }
}


export async function CreateForm(data: FormSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Form not valid!");
  }

  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new UserNotFoundErr();
  }

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error("Something went wrong!");
  }

  return form.id;
}

export async function GetForms() {
  const user = await getCurrentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function GetFormById(id: String) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id: Number(id),
    }
  })
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: number) {
  const user = await getCurrentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  const form = await prisma.form.findUnique({
    where: {
      shareURL: formUrl,
    },
  });

  if (!form) {
    throw new Error("Form not found");
  }

  return await prisma.form.update({
    select: {
      content: true,
    },
    where: {
      id: form.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  const form = await prisma.form.findUnique({
    where: { shareURL: formUrl, published: true },
  });

  if (!form) {
    throw new Error("Form not found or not published");
  }

  return await prisma.form.update({
    where: { id: form.id },
    data: {
      submissions: { increment: 1 },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
  });
}

export async function GetFormWithSubmissions(id: number) {
  const user = await getCurrentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
