// app/(dashboard)/builder/[id]/page.tsx
import { GetFormById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";

interface PageProps {
  params: {
    id: string;
  };
}

async function BuilderPage({ params }: PageProps) {
  const { id } = params;
  const form = await GetFormById(Number(id));

  if (!form) {
    throw new Error("Form not found");
  }

  console.log("Page Params:", params);
  return <FormBuilder form={form} />;
}

export default BuilderPage;