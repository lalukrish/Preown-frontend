import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";

export default function TransactionRow({ title, date, amount, type, method }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          type === "credit"
            ? "bg-green-50 text-green-500"
            : "bg-red-50 text-red-400"
        }`}
      >
        {type === "credit" ? (
          <FiArrowDownLeft size={18} />
        ) : (
          <FiArrowUpRight size={18} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {date} · {method}
        </p>
      </div>
      <p
        className={`text-sm font-bold flex-shrink-0 ${type === "credit" ? "text-green-500" : "text-gray-800"}`}
      >
        {type === "credit" ? "+" : "-"}
        {amount}
      </p>
    </div>
  );
}
