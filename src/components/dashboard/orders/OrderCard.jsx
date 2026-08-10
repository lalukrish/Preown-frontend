const statusColor = {
  Delivered: "bg-green-100 text-green-600",
  "In Transit": "bg-blue-100 text-blue-600",
  Processing: "bg-yellow-100 text-yellow-600",
  Cancelled: "bg-red-100 text-red-500",
};

export default function OrderCard({
  id,
  product,
  date,
  status,
  amount,
  image,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
      <img
        src={image}
        alt={product}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {product}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {id} · {date}
        </p>
        <span
          className={`inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor[status]}`}
        >
          {status}
        </span>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-800">{amount}</p>
        <button className="mt-2 text-xs text-cyan-800 font-medium hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
}
