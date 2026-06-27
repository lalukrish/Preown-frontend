import { FiShield, FiCalendar } from "react-icons/fi";

const statusStyle = {
  Active: "bg-green-100 text-green-600",
  Expired: "bg-red-100 text-red-500",
  "Expiring Soon": "bg-yellow-100 text-yellow-600",
};

export default function WarrantyCard({
  product,
  orderId,
  purchaseDate,
  expiryDate,
  status,
  image,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={product}
          className="w-14 h-14 object-contain rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800">{product}</p>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${statusStyle[status]}`}
            >
              {status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{orderId}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiCalendar size={13} />
          <span>
            Purchased:{" "}
            <span className="text-gray-700 font-medium">{purchaseDate}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiShield size={13} />
          <span>
            Expires:{" "}
            <span className="text-gray-700 font-medium">{expiryDate}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
