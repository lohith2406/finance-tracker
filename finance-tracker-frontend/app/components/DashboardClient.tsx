"use client";

import { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import { getTransactions } from "../services/api";
import { Transaction } from "../types";

interface Summary {
  income: number;
  expenses: number;
  balance: number;
}

export default function DashboardClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      const data: Transaction[] = res.data;
      setTransactions(data);

      const income = data
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0);
      const expenses = data
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0);
      setSummary({ income, expenses, balance: income - expenses });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Controlled Form */}
      <TransactionForm
        transactions={transactions}
        setTransactions={setTransactions}
        onUpdateSummary={fetchTransactions}
      />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-500">Income</h2>
          <p className="text-2xl font-bold text-green-500">${summary.income}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-500">Expenses</h2>
          <p className="text-2xl font-bold text-red-500">${summary.expenses}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-500">Balance</h2>
          <p className="text-2xl font-bold text-blue-500">${summary.balance}</p>
        </div>
      </div>

      {/* Controlled Transaction List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionForm
          transactions={transactions}
          setTransactions={setTransactions}
          onUpdateSummary={fetchTransactions}
        />

        <TransactionList
          transactions={transactions}
          setTransactions={setTransactions}
          limit={5}
          onUpdateSummary={fetchTransactions}
        />
      </div>
    </div>
  );
}
