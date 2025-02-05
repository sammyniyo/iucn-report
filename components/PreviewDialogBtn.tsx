import React from "react";
import { Button } from "./ui/button";
import { MdPreview } from "react-icons/md";
import useDesigner from "./hooks/useDesigner";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { FormElements } from "./FormElements";

function PreviewDialogBtn() {
  const { elements } = useDesigner();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        {/* Header */}
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">
            Form Preview
          </p>
          <p className="text-sm text-muted-foreground">
            This is how your form will look like to the organizations.
          </p>
        </div>

        {/* Preview Container */}
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url('/paper.svg')] dark:bg-[url('/paper-dark.svg')] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {elements.length > 0 ? (
              elements.map((element) => {
                const FormComponent = FormElements[element.type]?.formComponent;
                if (!FormComponent) return null;
                return (
                  <FormComponent key={element.id} elementInstance={element} />
                );
              })
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">
                No elements to display. Start designing your form.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialogBtn;
