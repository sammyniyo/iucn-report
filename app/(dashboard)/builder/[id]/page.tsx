import { GetFormById } from "@/actions/form";
import React from "react";
import FormBuilder from "@/components/FormBuilder";

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const form = await GetFormById(Number(id));
  if (!form) {
    throw new Error("form not found");
  }
  console.log("Page Params:", params);
  return <FormBuilder form={form} />;
}

 