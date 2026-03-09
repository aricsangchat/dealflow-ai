"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "created" | "fresh" | "queued" | "done" | "error";

export default function RefreshMarketButton({ marketKey }: { marketKey: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function refreshMarket() {
    try {
      setStatus("loading");

      const res = await fetch("/api/refresh-market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ marketKey }),
      });

      const data = await res.json();

      setStatus(data.status);

      if (data.status === "created") {
        await fetch("/api/run-refresh", {
          method: "POST",
        });
        setStatus("done");
      }
    } catch {
      setStatus("error");
    }
  }

  const label = {
    idle: "Refresh Market",
    loading: "Refreshing...",
    created: "Queued...",
    fresh: "Already Fresh",
    queued: "Refresh In Progress",
    done: "Market Updated",
    error: "Error",
  }[status];

  return (
    <button
      onClick={refreshMarket}
      disabled={status === "loading"}
      className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-60"
    >
      {label}
    </button>
  );
}