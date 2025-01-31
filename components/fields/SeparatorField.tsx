"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";

import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";

const type: ElementsType = "SeparatorField";

export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement: {
    icon: RiSeparator,
    label: "Separator Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

function DesignerComponent({}: { elementInstance: FormElementInstance }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Separator />
    </div>
  );
}
function FormComponent({}: { elementInstance: FormElementInstance }) {
  return;
  <Separator />;
}

function PropertiesComponent({}: { elementInstance: FormElementInstance }) {
  return <p>No propertied for this element</p>;
}
