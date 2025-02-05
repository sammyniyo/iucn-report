import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AssignUserModal() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
    fetch("/api/organizations")
      .then((res) => res.json())
      .then(setOrganizations);
  }, []);

  const assignUser = async () => {
    await fetch("/api/users/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser,
        organizationId: selectedOrg,
      }),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Assign User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign User to Organization</DialogTitle>
        </DialogHeader>

        <Select onValueChange={setSelectedUser}>
          <SelectTrigger>
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedOrg}>
          <SelectTrigger>
            <SelectValue placeholder="Select Organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={assignUser} className="mt-4">
          Assign
        </Button>
      </DialogContent>
    </Dialog>
  );
}
