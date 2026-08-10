// "use client";

// import { useState } from "react";

// const FIELDS = [
//   { key: "PhoneNumber", label: "Phone Number" },
//   { key: "AddressLine1", label: "Address Line 1" },
//   { key: "AddressLine2", label: "Address Line 2" },
//   { key: "LandMark", label: "Landmark" },
//   { key: "City", label: "City" },
//   { key: "District", label: "District" },
//   { key: "State", label: "State" },
//   { key: "PinCode", label: "Pin Code" },
// ];

// export default function AddAddressForm({ onSubmit, onCancel, submitting }) {
//   const [form, setForm] = useState({
//     PhoneNumber: "",
//     AddressLine1: "",
//     AddressLine2: "",
//     LandMark: "",
//     City: "",
//     District: "",
//     State: "",
//     PinCode: "",
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50"
//     >
//       <div className="grid grid-cols-2 gap-3">
//         {FIELDS.map(({ key, label }) => (
//           <div key={key} className={key === "AddressLine1" ? "col-span-2" : ""}>
//             <label className="text-xs font-medium text-gray-500">{label}</label>
//             <input
//               className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 transition-colors"
//               value={form[key]}
//               onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//               required={key !== "AddressLine2" && key !== "LandMark"}
//             />
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-3 pt-1">
//         <button
//           type="submit"
//           disabled={submitting}
//           className="bg-cyan-950 hover:bg-cyan-950 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
//         >
//           {submitting ? "Saving..." : "Save Address"}
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="text-sm text-gray-500 font-medium px-3 py-2 hover:text-gray-700"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }
"use client";

import { useState } from "react";

const FIELDS = [
  { key: "PhoneNumber", label: "Phone Number" },
  { key: "AddressLine1", label: "Address Line 1" },
  { key: "AddressLine2", label: "Address Line 2" },
  { key: "LandMark", label: "Landmark" },
  { key: "City", label: "City" },
  { key: "District", label: "District" },
  { key: "State", label: "State" },
  { key: "PinCode", label: "Pin Code" },
];

const EMPTY = {
  PhoneNumber: "",
  AddressLine1: "",
  AddressLine2: "",
  LandMark: "",
  City: "",
  District: "",
  State: "",
  PinCode: "",
};

export default function AddAddressForm({
  onSubmit,
  onCancel,
  submitting,
  initialValues,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...(initialValues || {}) });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50"
    >
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className={key === "AddressLine1" ? "col-span-2" : ""}>
            <label className="text-xs font-medium text-gray-500">{label}</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-cyan-400 transition-colors"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={key !== "AddressLine2" && key !== "LandMark"}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="bg-cyan-950 hover:bg-cyan-950 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          {submitting ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 font-medium px-3 py-2 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
