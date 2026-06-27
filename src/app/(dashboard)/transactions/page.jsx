import TransactionRow from "@/components/dashboard/transactions/TransactionRow";

const transactions = [
  {
    title: "iPhone 13 Pro Purchase",
    date: "12 Jun 2025",
    amount: "₹54,999",
    type: "debit",
    method: "UPI",
  },
  {
    title: "Refund — iPad Mini 6",
    date: "05 Jun 2025",
    amount: "₹48,000",
    type: "credit",
    method: "Bank Transfer",
  },
  {
    title: "MacBook Air M1 Purchase",
    date: "28 May 2025",
    amount: "₹72,000",
    type: "debit",
    method: "EMI",
  },
  {
    title: "AirPods Pro Purchase",
    date: "15 May 2025",
    amount: "₹18,000",
    type: "debit",
    method: "Credit Card",
  },
  {
    title: "Cashback — Samsung S22",
    date: "04 May 2025",
    amount: "₹1,200",
    type: "credit",
    method: "Wallet",
  },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Credits</p>
          <p className="text-xl font-bold text-green-600 mt-1">₹49,200</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Debits</p>
          <p className="text-xl font-bold text-red-500 mt-1">₹1,44,999</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {transactions.map((t, i) => (
          <TransactionRow key={i} {...t} />
        ))}
      </div>
    </div>
  );
}
