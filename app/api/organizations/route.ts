import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: true,
            forms: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(organizations, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    const organization = await prisma.organization.create({
      data: { name },
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Failed to create organization", details: error.message },
      { status: 500 },
    );
  }
}
