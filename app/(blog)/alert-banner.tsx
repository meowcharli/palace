"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { disableDraftMode } from "./actions";

export default function AlertBanner() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Use a simplified check that doesn't rely on useSyncExternalStore
  // We'll just show the banner by default in client components
  const shouldShow = true;

  if (!shouldShow) return null;

  return (
    <div
      className={`${
        pending ? "animate-pulse" : ""
      } fixed top-0 left-0 z-50 w-full border-b bg-gray-900/95 text-white backdrop-blur`}
    >
      <div className="py-2 text-center text-sm">
        {pending ? (
          "Disabling draft mode..."
        ) : (
          <>
            {"Previewing drafts. "}
            <button
              type="button"
              onClick={() =>
                startTransition(() =>
                  disableDraftMode().then(() => {
                    router.refresh();
                  }),
                )
              }
              className="hover:text-blue-400 underline transition-colors duration-200"
            >
              Back to published
            </button>
          </>
        )}
      </div>
    </div>
  );
}
