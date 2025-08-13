"use client";

import { useEffect, useState } from "react";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";
import { useRouter } from "next/navigation";
import { getBudgets } from "../services/api";

export default function BudgetsClient() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await getBudgets();
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Budgets</h1>

      <BudgetForm onAdd={fetchBudgets} />
      <BudgetList budgets={budgets} setBudgets={setBudgets} loading={loading} />
    </div>
  );
}
