"use client";

import { useState } from "react";
import { addTransaction } from "../services/api";
import { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onUpdateSummary?: () => void; // optional callback to recalc summary
}

export default function TransactionForm({
  transactions,
  setTransactions,
  onUpdateSummary,
}: Props) {
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    setLoading(true);
    try {
      const res = await addTransaction({
        type,
        category,
        amount: Number(amount),
        date: new Date(),
      });

      const newTransaction: Transaction = res.data;

      setTransactions([newTransaction, ...transactions]);
      if (onUpdateSummary) onUpdateSummary();

      setCategory("");
      setAmount("");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="border rounded px-3 py-2 w-full md:w-1/4"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/4"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded px-3 py-2 w-full md:w-1/4"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}
