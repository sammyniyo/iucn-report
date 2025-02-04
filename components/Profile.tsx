"use client";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null; // Wait until session data is available

  if (!session?.user) return null; // Ensure session and user exist

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition">
        <Avatar className="w-8 h-8">
          <Image
            src={session.user.image || "/avatar.png"}
            alt="User Avatar"
            className="rounded-full"
            width={32}
            height={32}
          />
        </Avatar>
        <span className="font-medium text-gray-800">
          {session.user.name || session.user.email}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/settings")}>⚙️ Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>🚪 Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
