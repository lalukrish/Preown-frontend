"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileForm() {
  const { user, token, updateUser, refreshUser } = useAuth();

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setForm({ username: user?.username || "", email: user?.email || "" });
  }, [user?.username, user?.email]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(
        `https://backapp.preown.store/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
          }),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      updateUser({ username: form.username, email: form.email });
      setSaved(true);
    } catch (err) {
      console.error("save profile error:", err);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {["username", "email"].map((field) => (
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

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved.</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-cyan-950 hover:bg-cyan-900 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors mt-2"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
