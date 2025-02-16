import { GetFormById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import React from "react";

// Outer component: Fetches the form data and passes it to the inner component
async function BuilderPage({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const { id } = params;
  const form = await GetFormById(String(id));
  if (!form) {
    throw new Error("Form not found");
  }

  // Pass the form data to the inner component
  return <FormBuilder form={form} />;
}

export default BuilderPage;