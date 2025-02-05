import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContent } from "@/actions/form";
import { toast } from "@/hooks/use-toast";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [isPending, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElements);
      toast({
        title: "Success",
        description: "Form Saved!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, try again later!",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={isPending} // Use `isPending` for loading state
      onClick={() => startTransition(updateFormContent)} // Wrap in `startTransition`
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {isPending && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
