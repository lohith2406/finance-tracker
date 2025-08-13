"use client";

import { deleteTransaction } from "../services/api";
import { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  limit?: number;
  onUpdateSummary?: () => void; // optional callback to recalc summary
}

export default function TransactionList({ transactions, setTransactions, limit, onUpdateSummary }: Props) {
  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);

      // Remove transaction from parent state
      setTransactions(prev => prev.filter(t => t._id !== id));

      // Optional: recalc summary
      if (onUpdateSummary) onUpdateSummary();
    } catch (err) {
      console.error(err);
    }
  };

  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b">
          <th>Date</th>
          <th>Category</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {displayedTransactions.map(t => (
          <tr key={t._id} className="border-b hover:bg-gray-50">
            <td>{new Date(t.date).toLocaleDateString()}</td>
            <td>{t.category}</td>
            <td className={t.type === "income" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
              {t.type}
            </td>
            <td>${t.amount}</td>
            <td>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDelete(t._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        {displayedTransactions.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-500">
              No transactions found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
