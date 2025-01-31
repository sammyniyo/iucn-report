import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import React, { ReactNode } from "react";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import { TbArrowBounce } from "react-icons/tb";
import { StatsCard } from "../../page";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import VisitBtn from "@/components/VisitBtn";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

async function FormDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const form = await GetFormById(Number(id));
  if (!form) {
    throw new Error("Form not found");
  }

  const { visits, submissions } = form;
  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = 100 - submissionRate;

  return (
    <>
      {/* Header Section */}
      <div className="border-b border-muted">
        <div className="container flex justify-between items-center py-6 px-4">
          <h1 className="text-3xl font-bold text-primary truncate">{form.name}</h1>
          <VisitBtn shareUrl={form.shareURL} />
        </div>
      </div>

      {/* Form Link Share Section */}
      <div className="border-b border-muted">
        <div className="container flex items-center justify-between gap-4 py-4 px-4">
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="container grid gap-6 pt-8 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4">
        <StatsCard title="Total Visits" icon={<LuView className="text-blue-600" />} helperText="Number of times visited" value={visits.toLocaleString()} loading={false} className="shadow-md shadow-blue-600" />
        <StatsCard title="Total Submissions" icon={<FaWpforms className="text-yellow-600" />} helperText="Form submissions" value={submissions.toLocaleString()} loading={false} className="shadow-md shadow-yellow-600" />
        <StatsCard title="Submission Rate" icon={<HiCursorClick className="text-green-600" />} helperText="Visits that result in form submission" value={`${submissionRate.toFixed(2)}%`} loading={false} className="shadow-md shadow-green-600" />
        <StatsCard title="Bounce Rate" icon={<TbArrowBounce className="text-red-600" />} helperText="Visits that leave without interacting" value={`${bounceRate.toFixed(2)}%`} loading={false} className="shadow-md shadow-red-600" />
      </div>

      {/* Submissions Table */}
      <div className="container pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
}

export default FormDetailPage;

type Row = { [key: string]: string } & { submittedAt: Date };

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) {
    throw new Error("Form not found!");
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns = formElements.filter((element) => [
    "textField", "NumberField", "TextAreaField", "DateField", "SelectField", "CheckboxField"
  ].includes(element.type)).map((element) => ({
    id: element.id,
    label: element.extraAttributes?.label || "Untitled",
    required: element.extraAttributes?.required || false,
    type: element.type,
  }));

  const rows: Row[] = form.FormSubmissions.map((submission) => ({
    ...JSON.parse(submission.content),
    submittedAt: submission.createdAt,
  }));

  return (
    <>
      <h1 className="text-2xl font-bold my-4 px-4">Submissions</h1>
      <div className="px-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id} className="uppercase">{column.label}</TableHead>
                ))}
                <TableHead className="text-muted-foreground text-right uppercase">Submitted at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <RowCell key={column.id} type={column.type} value={row[column.id]} />
                  ))}
                  <TableCell className="text-muted-foreground text-right">
                    {formatDistance(new Date(row.submittedAt), new Date(), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  if (type === "DateField" && value) {
    node = <Badge variant="outline">{format(new Date(value), "dd/MM/yyyy")}</Badge>;
  } else if (type === "CheckboxField") {
    node = <Checkbox checked={value === "true"} disabled />;
  }

  return <TableCell>{node}</TableCell>;
}
