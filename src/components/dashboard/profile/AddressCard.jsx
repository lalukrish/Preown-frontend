"use client";

import { useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import AddAddressForm from "./AddAddressForm";

function formatAddress(addr) {
  return (
    [
      addr.AddressLine1,
      addr.AddressLine2,
      addr.LandMark,
      addr.City,
      addr.District,
    ]
      .filter(Boolean)
      .join(", ") +
    (addr.State ? `, ${addr.State}` : "") +
    (addr.PinCode ? ` - ${addr.PinCode}` : "")
  );
}

export default function AddressCard({
  address,
  index,
  onRemove,
  onUpdate,
  removing,
  updating,
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <AddAddressForm
        initialValues={address}
        submitting={updating}
        onCancel={() => setEditing(false)}
        onSubmit={async (payload) => {
          await onUpdate(address.documentId ?? address.id, payload);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 relative">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Address {index + 1}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
        {formatAddress(address)}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{address.PhoneNumber}</p>
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1 text-xs text-cyan-800 hover:underline cursor-pointer"
        >
          <FiEdit2 size={12} /> Edit
        </button>
        <button
          onClick={() => onRemove(address.documentId ?? address.id)}
          disabled={removing}
          className="flex items-center gap-1 text-xs text-red-400 hover:underline disabled:opacity-50 cursor-pointer"
        >
          <FiTrash2 size={12} /> {removing ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  );
}
