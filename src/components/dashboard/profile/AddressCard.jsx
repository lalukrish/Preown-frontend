import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function AddressCard({
  label,
  name,
  address,
  phone,
  isDefault,
}) {
  return (
    <div
      className={`rounded-xl border p-4 relative ${isDefault ? "border-orange-300 bg-orange-50/40" : "border-gray-100 bg-white"}`}
    >
      {isDefault && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">
          Default
        </span>
      )}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 mt-1">{name}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{address}</p>
      <p className="text-xs text-gray-500 mt-0.5">{phone}</p>
      <div className="flex gap-3 mt-3">
        <button className="flex items-center gap-1 text-xs text-orange-500 hover:underline">
          <FiEdit2 size={12} /> Edit
        </button>
        <button className="flex items-center gap-1 text-xs text-red-400 hover:underline">
          <FiTrash2 size={12} /> Remove
        </button>
      </div>
    </div>
  );
}
