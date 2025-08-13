"use client";

import { useState, useEffect } from "react";
import { addBudget } from "../services/api";
import { useRouter } from "next/navigation";

// Add prop for callback
interface Props {
  onAdd?: () => void;
}

export default function BudgetForm({ onAdd }: Props) {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [period, setPeriod] = useState("monthly"); // default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addBudget({
        category,
        amount: Number(amount),
        period,
      });

      // Clear form
      setCategory("");
      setAmount(0);
      setPeriod("monthly");

      // call parent to update list instantly
      if (onAdd) onAdd();
    } catch (err: any) {
      // Display backend error message
      setError(err.response?.data?.message || "Failed to add budget");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Budget</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded px-3 py-2 w-32"
          required
        />
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded px-3 py-2 w-32"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Adding..." : "Add Budget"}
        </button>
      </form>
    </div>
  );
}
