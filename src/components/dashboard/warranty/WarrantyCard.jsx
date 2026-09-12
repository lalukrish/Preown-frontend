import { FiShield, FiCalendar, FiHash } from "react-icons/fi";

const statusStyle = {
  Active: "bg-green-100 text-green-600",
  Expired: "bg-red-100 text-red-500",
  "Expiring Soon": "bg-yellow-100 text-yellow-600",
};

// warranties: [{ label: "Shop Warranty", expiryDate, status }, ...]
// pass only the ones that actually exist on this item — none passed → "No Warranty" shown
export default function WarrantyCard({
  product,
  orderId,
  purchaseDate,
  image,
  price,
  serialNumber,
  warranties = [],
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-4">
        <img
          src={image || "/placeholder.jpg"}
          alt={product}
          className="w-14 h-14 object-contain rounded-lg flex-shrink-0 bg-gray-50"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {product}
            </p>
            {price != null && (
              <span className="text-sm font-semibold text-gray-800 flex-shrink-0">
                ₹{Number(price).toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{orderId}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <FiCalendar size={13} />
        <span>
          Purchased:{" "}
          <span className="text-gray-700 font-medium">{purchaseDate}</span>
        </span>
        {serialNumber && (
          <span className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
            <FiHash size={12} />
            <span className="text-gray-700 font-medium">{serialNumber}</span>
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {warranties.length === 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            <FiShield size={12} /> No Warranty
          </span>
        ) : (
          warranties.map((w) => (
            <div
              key={w.label}
              className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiShield size={13} />
                <span className="font-medium text-gray-700">{w.label}</span>
                <span className="text-gray-400">· expires {w.expiryDate}</span>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${statusStyle[w.status]}`}
              >
                {w.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
