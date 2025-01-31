import { GetForms, GetFormStats } from "@/actions/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import React, { ReactNode } from "react";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import { TbArrowBounce } from "react-icons/tb";
import { Suspense } from "react";
import EventCalender from "@/components/EventCalender";
import Announcements from "@/components/Announcements";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateFormBtn from "@/components/CreateFormBtn";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form } from "@prisma/client";
import { formatDistance } from "date-fns/formatDistance";
import { BiRightArrowAlt } from "react-icons/bi";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="p-4 flex gap-6 flex-col md:flex-row">
      <div className="w-full lg:w-2/3">
        <Suspense fallback={<StatsCards loading={true} />}>
          <CardStatsWrapper />
        </Suspense>
        <Separator className="my-6" />
        <h2 className="text-2xl font-semibold col-span-2">Recent Forms</h2>
        <Separator className="my-6" />
        <div className="w-full h-[500px] py-4">
          {/* CHART */}
          <Dialog>
            <DialogTrigger>
              <CreateFormBtn />
            </DialogTrigger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6 mt-4">
              <Suspense
                fallback={[1, 2, 3, 4].map((el) => (
                  <FormCardsSkeleton key={el} />
                ))}
              >
                <FormCards />
              </Suspense>
            </div>
          </Dialog>
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}
function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Visits"
        icon={<LuView className="text-blue-600" />}
        helperText="Number of times visited"
        value={data?.visits.toLocaleString() || "N/A"}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total Submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="Form submissions"
        value={data?.submissions.toLocaleString() || "N/A"}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />
      <StatsCard
        title="Submission Rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visits that result in form submission"
        value={data?.submissionRate.toLocaleString() + "%" || "N/A"}
        loading={loading}
        className="shadow-md shadow-green-600"
      />
      <StatsCard
        title="Bounce rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visits that leaves without interacting"
        value={data?.submissionRate.toLocaleString() + "%" || "N/A"}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
}: {
  title: string;
  value: number | string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardsSkeleton() {
  return (
    <Skeleton className="border-2 border-primary/20 h-48 w-full rounded-lg" />
  );
}

async function FormCards() {
  try {
    const forms = await GetForms();
    if (!forms || forms.length === 0) {
      return <p>No forms available</p>;
    }
    return (
      <>
        {forms.map((form) => (
          <FormCard key={form.id} form={form} />
        ))}
      </>
    );
  } catch (error) {
    console.error("Error fetching forms:", error);
    return <p>Failed to load forms. Please try again later.</p>;
  }
}

function FormCard({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          {form.published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="destructive">Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
          {!form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No description"}
      </CardContent>
      <CardFooter>
        {form.published ? (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>
              View Submissions
              <BiRightArrowAlt />
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="secondary"
            className="w-full mt-2 text-md gap-4"
          >
            <Link href={`/builder/${form.id}`}>
              Edit Form
              <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
