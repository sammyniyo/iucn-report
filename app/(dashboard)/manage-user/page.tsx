"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
}

interface UserFormData {
  email: string;
  password: string;
  organizationId: string;
  role: string;
}

export default function UserAddComponent() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    organizationId: "",
    role: "organization",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations");
        if (!response.ok) throw new Error("Failed to fetch organizations");
        const data = await response.json();
        setOrganizations(data);
      } catch (err) {
        console.error("Error fetching organizations:", err);
        toast.error("Failed to load organizations");
      }
    };

    fetchOrganizations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password || !formData.organizationId) {
        throw new Error("All fields are required");
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user");
      }

      toast.success("User created successfully");
      setFormData({
        email: "",
        password: "",
        organizationId: "",
        role: "organization",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-4xl font-bold mb-8 text-center text-black">
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label
              htmlFor="email"
              className="block mb-2 text-lg font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="user@example.com"
              required
              className="w-full px-4 py-3 text-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block mb-2 text-lg font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full px-4 py-3 text-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
            />
          </div>

          <div>
            <Label
              htmlFor="organization"
              className="block mb-2 text-lg font-medium text-gray-700"
            >
              Organization
            </Label>
            <Select
              value={formData.organizationId}
              onValueChange={(value) =>
                setFormData({ ...formData, organizationId: value })
              }
              required
            >
              <SelectTrigger className="w-full px-4 py-3 text-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent className="text-lg">
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="role"
              className="block mb-2 text-lg font-medium text-gray-700"
            >
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger className="w-full px-4 py-3 text-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="text-lg">
                <SelectItem value="organization">Organization User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-500 text-lg">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg bg-black hover:bg-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
