"use client";

import { useState } from "react";

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: "Rahul Kumar",
    email: "rahul@email.com",
    phone: "+91 99955 56734",
  });

  return (
    <div className="space-y-4">
      {["name", "email", "phone"].map((field) => (
        <div key={field}>
          <label className="text-xs font-medium text-gray-500 capitalize">
            {field}
          </label>
          <input
            className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-cyan-400 transition-colors"
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        </div>
      ))}
      <button className="bg-cyan-950 hover:bg-cyan-950 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
        Save Changes
      </button>
    </div>
  );
}
