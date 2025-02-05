import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { formId, organizationId } = await request.json();

    // Validate input
    if (!formId || !organizationId) {
      return NextResponse.json(
        { error: "Form ID and Organization ID are required" },
        { status: 400 }
      );
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.formAssignment.findFirst({
      where: { formId, organizationId }
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: "This form is already assigned to the organization" },
        { status: 409 }
      );
    }

    // Create new assignment
    const assignment = await prisma.formAssignment.create({
      data: {
        formId,
        organizationId
      },
      include: {
        organization: true
      }
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Assignment error:", error);
    return NextResponse.json(
      { error: "Failed to assign form" },
      { status: 500 }
    );
  }
}