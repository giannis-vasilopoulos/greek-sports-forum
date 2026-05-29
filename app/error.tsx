"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { isDbError } from "@/lib/db/run";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const title = isDbError(error)
    ? "Database unavailable"
    : "Something went wrong";
  const description = isDbError(error)
    ? "We could not reach the database. Check that PostgreSQL is running and try again."
    : "An unexpected error occurred. Please try again.";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
