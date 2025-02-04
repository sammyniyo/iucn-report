"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Form {
  id: number;
  name: string;
  description: string;
  visits: number;
  submissions: number;
  shareURL: string;
  published: boolean;
  FormAssignments: {
    id: string;
    organization: {
      id: string;
      name: string;
    };
  }[];
}

interface Organization {
  id: string;
  name: string;
}

const ManageFormsPage = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<number | null>(null);

  // Fetch forms and organizations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formsRes, orgsRes] = await Promise.all([
          fetch("/api/forms/published"),
          fetch("/api/organizations")
        ]);

        if (!formsRes.ok) throw new Error("Failed to fetch forms");
        if (!orgsRes.ok) throw new Error("Failed to fetch organizations");

        const formsData = await formsRes.json();
        const orgsData = await orgsRes.json();
        
        setForms(formsData);
        setOrganizations(orgsData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assignFormToOrganization = async (formId: number) => {
    if (!selectedOrganization) {
      toast.warning("Please select an organization first");
      return;
    }

    setAssigning(formId);
    try {
      const response = await fetch("/api/form-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          organizationId: selectedOrganization
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Assignment failed");
      }

      // Update local state
      setForms(prev => prev.map(form => {
        if (form.id === formId) {
          return {
            ...form,
            FormAssignments: [
              ...form.FormAssignments,
              { 
                id: (Math.random().toString(36) + Date.now().toString(36)),
                organization: organizations.find(org => org.id === selectedOrganization)!
              }
            ]
          };
        }
        return form;
      }));

      toast.success("Form assigned successfully");
      setSelectedOrganization("");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssigning(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Published Forms</h2>

      <div className="mb-6 flex gap-4 items-center">
        <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select organization to assign" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map(org => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Visits</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map(form => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">{form.name}</TableCell>
              <TableCell>{form.description}</TableCell>
              <TableCell>{form.visits}</TableCell>
              <TableCell>{form.submissions}</TableCell>
              <TableCell>
                {form.FormAssignments.map(assignment => (
                  <span 
                    key={assignment.id}
                    className="bg-gray-100 px-2 py-1 rounded-md text-sm mr-2"
                  >
                    {assignment.organization.name}
                  </span>
                ))}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => assignFormToOrganization(form.id)}
                  disabled={!selectedOrganization || assigning === form.id}
                >
                  {assigning === form.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : "Assign"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageFormsPage;