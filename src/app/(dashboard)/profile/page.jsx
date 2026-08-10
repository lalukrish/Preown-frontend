// "use client";

// import { useEffect, useState } from "react";
// import ProfileForm from "@/components/dashboard/profile/ProfileForm";
// import AddressCard from "@/components/dashboard/profile/AddressCard";
// import AddAddressForm from "@/components/dashboard/profile/AddAddressForm";
// import { FiPlus } from "react-icons/fi";
// import { getMyAddresses, createAddress } from "@/shared/profile";

// export default function ProfilePage() {
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   // const { showSnackbar } = useSnackbar();

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const data = await getMyAddresses();
//         if (!cancelled) setAddresses(data);
//       } catch (err) {
//         // showSnackbar("Couldn't load addresses", "error");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const handleAddAddress = async (payload) => {
//     setSubmitting(true);
//     try {
//       console.log("paylad", payload);
//       const created = await createAddress(payload);
//       setAddresses((prev) => [...prev, created]);
//       setShowAddForm(false);
//       // showSnackbar("Address added successfully", "success");
//     } catch (err) {
//       // showSnackbar("Failed to add address", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRemove = async (id) => {
//     // No DELETE endpoint was provided yet — wire this up once you have it, e.g.:
//     // await deleteAddress(id);
//     // showSnackbar("Delete endpoint not connected yet", "error");
//   };

//   return (
//     <div className="space-y-8 max-w-2xl">
//       {/* Profile */}
//       <div className="bg-white rounded-xl border border-gray-100 p-6">
//         <h3 className="text-base font-semibold text-gray-800 mb-5">
//           Personal Information
//         </h3>
//         <ProfileForm />
//       </div>

//       {/* Addresses */}
//       <div className="bg-white rounded-xl border border-gray-100 p-6">
//         <div className="flex items-center justify-between mb-5">
//           <h3 className="text-base font-semibold text-gray-800">
//             Saved Addresses
//           </h3>
//           <button
//             onClick={() => setShowAddForm((s) => !s)}
//             className="flex items-center gap-1.5 text-sm text-cyan-800 font-medium hover:underline"
//           >
//             <FiPlus size={15} /> {showAddForm ? "Close" : "Add New"}
//           </button>
//         </div>

//         {showAddForm && (
//           <div className="mb-4">
//             <AddAddressForm
//               onSubmit={handleAddAddress}
//               onCancel={() => setShowAddForm(false)}
//               submitting={submitting}
//             />
//           </div>
//         )}

//         <div className="space-y-3">
//           {loading ? (
//             <p className="text-sm text-gray-400">Loading addresses...</p>
//           ) : addresses.length === 0 ? (
//             <p className="text-sm text-gray-400">No saved addresses yet.</p>
//           ) : (
//             addresses.map((addr, i) => (
//               <AddressCard
//                 key={addr.id ?? i}
//                 address={addr}
//                 index={i}
//                 onRemove={handleRemove}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import ProfileForm from "@/components/dashboard/profile/ProfileForm";
import AddressCard from "@/components/dashboard/profile/AddressCard";
import AddAddressForm from "@/components/dashboard/profile/AddAddressForm";
import { FiPlus } from "react-icons/fi";
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/shared/profile";

export default function ProfilePage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null); // id currently removing/updating

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMyAddresses();
        if (!cancelled) setAddresses(data);
      } catch (err) {
        // showSnackbar("Couldn't load addresses", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddAddress = async (payload) => {
    setSubmitting(true);
    try {
      const created = await createAddress(payload);
      setAddresses((prev) => [...prev, created]);
      setShowAddForm(false);
    } catch (err) {
      // showSnackbar("Failed to add address", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAddress = async (id, payload) => {
    setBusyId(id);
    try {
      const updated = await updateAddress(id, payload);
      setAddresses((prev) =>
        prev.map((a) =>
          (a.documentId ?? a.id) === id ? { ...a, ...updated } : a,
        ),
      );
    } catch (err) {
      // showSnackbar("Failed to update address", "error");
      throw err; // let card know save failed, stay in edit mode
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (id) => {
    setBusyId(id);
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => (a.documentId ?? a.id) !== id));
    } catch (err) {
      // showSnackbar("Failed to delete address", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-5">
          Personal Information
        </h3>
        <ProfileForm />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-800">
            Saved Addresses
          </h3>
          <button
            onClick={() => setShowAddForm((s) => !s)}
            className="flex items-center gap-1.5 text-sm text-cyan-800 font-medium hover:underline"
          >
            <FiPlus size={15} /> {showAddForm ? "Close" : "Add New"}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4">
            <AddAddressForm
              onSubmit={handleAddAddress}
              onCancel={() => setShowAddForm(false)}
              submitting={submitting}
            />
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-gray-400">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-gray-400">No saved addresses yet.</p>
          ) : (
            addresses.map((addr, i) => (
              <AddressCard
                key={addr.id ?? i}
                address={addr}
                index={i}
                onRemove={handleRemove}
                onUpdate={handleUpdateAddress}
                removing={busyId === (addr.documentId ?? addr.id)}
                updating={busyId === (addr.documentId ?? addr.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
