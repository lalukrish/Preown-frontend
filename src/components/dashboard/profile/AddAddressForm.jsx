"use client";
import { useState } from "react";

const FIELDS = [
  { key: "PhoneNumber", label: "Phone Number" },
  { key: "AddressLine1", label: "Address Line 1" },
  { key: "AddressLine2", label: "Address Line 2" },
  { key: "LandMark", label: "Landmark" },
  { key: "City", label: "City" },
  { key: "District", label: "District" },
  { key: "PinCode", label: "Pin Code" },
];

const STATE_OPTIONS = ["Kerala", "South India", "ROI"];

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

const OPTIONAL_KEYS = ["AddressLine2", "LandMark"];

function validate(form) {
  const errors = {};

  FIELDS.forEach(({ key, label }) => {
    if (OPTIONAL_KEYS.includes(key)) return;
    if (!form[key]?.trim()) {
      errors[key] = `${label} is required`;
    }
  });

  if (!form.State) {
    errors.State = "Select a state";
  }

  if (form.PhoneNumber && !/^[6-9]\d{9}$/.test(form.PhoneNumber.trim())) {
    errors.PhoneNumber = "Enter a valid 10-digit phone number";
  }

  if (form.PinCode && !/^\d{6}$/.test(form.PinCode.trim())) {
    errors.PinCode = "Enter a valid 6-digit pin code";
  }

  return errors;
}

export default function AddAddressForm({
  onSubmit,
  onCancel,
  submitting,
  initialValues,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...(initialValues || {}) });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50"
      noValidate
    >
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className={key === "AddressLine1" ? "col-span-2" : ""}>
            <label className="text-xs font-medium text-gray-500">{label}</label>
            <input
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-800 outline-none transition-colors ${
                errors[key]
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-cyan-400"
              }`}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
            {errors[key] && (
              <p className="text-[11px] text-red-500 mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="text-xs font-medium text-gray-500">State</label>
          <select
            className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-800 outline-none transition-colors bg-white ${
              errors.State
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-cyan-400"
            }`}
            value={form.State}
            onChange={(e) => handleChange("State", e.target.value)}
          >
            <option value="" disabled>
              Select State
            </option>
            {STATE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.State && (
            <p className="text-[11px] text-red-500 mt-1">{errors.State}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
        Please add accurate address for proper delivery.
      </p>

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
