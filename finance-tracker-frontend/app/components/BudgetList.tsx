"use client";

import { useState } from "react";
import { deleteBudget } from "../services/api";
import { useRouter } from "next/navigation";

interface Budget {
  _id: string;
  category: string;
  amount: number;
  period: string;
  createdAt: string;
}

interface Props {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  loading: boolean;
}

export default function BudgetList({ budgets, setBudgets, loading }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete budget");
      console.error(err);
    }
  };

  if (loading) return <p>Loading budgets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (budgets.length === 0) return <p className="text-gray-500">No budgets found. Add one above!</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Budgets</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Category</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Period</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => (
            <tr key={b._id} className="border-b hover:bg-gray-50">
              <td className="py-2">{b.category}</td>
              <td className="py-2">${b.amount}</td>
              <td className="py-2 capitalize">{b.period}</td>
              <td className="py-2">
                <button
                  onClick={() => handleDelete(b._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
