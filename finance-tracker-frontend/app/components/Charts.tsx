"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
}

export default function Charts() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ income: number[]; expenses: number[] }>({
    income: Array(12).fill(0),
    expenses: Array(12).fill(0),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res.data);

        const incomeArr = Array(12).fill(0);
        const expenseArr = Array(12).fill(0);

        res.data.forEach((t: Transaction) => {
          const month = new Date(t.date).getMonth(); // 0–11
          if (t.type === "income") incomeArr[month] += t.amount;
          else expenseArr[month] += t.amount;
        });

        setMonthlyData({ income: incomeArr, expenses: expenseArr });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Income",
        data: monthlyData.income,
        backgroundColor: "rgba(34,197,94,0.7)", // green
      },
      {
        label: "Expenses",
        data: monthlyData.expenses,
        backgroundColor: "rgba(239,68,68,0.7)", // red
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Monthly Income vs Expenses" },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
