"use client";

import { useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/subscribers";
import { Loading02Icon } from "hugeicons-react";

export function NewsletterForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await subscribeToNewsletter(formData);

    if (result.success) {
      toast.success(result.message);
      (event.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error);
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        name="email"
        placeholder="O teu email"
        aria-label="Endereço de email"
        required
        disabled={isLoading}
        className="w-full min-w-0 flex-auto appearance-none rounded-md border border-border/50 bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex flex-none items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/80 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loading02Icon className="h-4 w-4 animate-spin" />
        ) : (
          "Subscrever"
        )}
      </button>
    </form>
  );
}
