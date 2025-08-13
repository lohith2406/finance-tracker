"use client";

import { useEffect } from "react";
import Charts from "./Charts";
import { useRouter } from "next/navigation";

export default function AnalyticsClient() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <Charts />
    </div>
  );
}
