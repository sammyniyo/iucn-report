"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  _count: {
    users: number;
    forms: number;
  };
}

const OrganizationManager = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchOrganizations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/organizations", {
        cache: "no-store",
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || "Failed to fetch organizations");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }

      setOrganizations(data);
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load organizations";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async () => {
    if (!newOrgName.trim()) {
      toast.warning("Organization name cannot be empty");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOrgName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create organization");
      }

      const newOrg = await response.json();
      setOrganizations((prev) => [newOrg, ...prev]);
      setNewOrgName("");
      toast.success("Organization created successfully");
    } catch (err) {
      console.error("Create error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create organization",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const deleteOrganization = async (id: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
  
    setLoading(true);
    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete organization");
      }
  
      // Remove the deleted organization from the state
      setOrganizations((prev) => prev.filter((org) => org.id !== id));
      toast.success("Organization deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete organization",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Organizations Management</h2>
        <Button variant="outline" onClick={fetchOrganizations}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex gap-2">
        <Input
          placeholder="New organization name"
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={createOrganization} disabled={isCreating}>
          {isCreating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4 mr-2" />
          )}
          Create Organization
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={fetchOrganizations}
          >
            Retry
          </Button>
        </div>
      ) : (
        <Table className="border rounded-lg">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Forms</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-semibold">{org.name}</TableCell>
                <TableCell>{org._count.users}</TableCell>
                <TableCell>{org._count.forms}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteOrganization(org.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OrganizationManager;
