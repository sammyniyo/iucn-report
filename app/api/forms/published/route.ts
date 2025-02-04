import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      where: { published: true },
      include: {
        FormAssignments: {
          include: {
            organization: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Failed to fetch forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}