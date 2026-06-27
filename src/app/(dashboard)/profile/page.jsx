import ProfileForm from "@/components/dashboard/profile/ProfileForm";
import AddressCard from "@/components/dashboard/profile/AddressCard";
import { FiPlus } from "react-icons/fi";

const addresses = [
  {
    label: "Home",
    name: "Rahul Kumar",
    address: "12/A, Rose Garden, Palarivattom, Kochi, Kerala - 682025",
    phone: "+91 99955 56734",
    isDefault: true,
  },
  {
    label: "Office",
    name: "Rahul Kumar",
    address: "UXByte Studios, 4th Floor, Infopark, Kakkanad, Kochi - 682042",
    phone: "+91 99955 56734",
    isDefault: false,
  },
];

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-5">
          Personal Information
        </h3>
        <ProfileForm />
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-800">
            Saved Addresses
          </h3>
          <button className="flex items-center gap-1.5 text-sm text-orange-500 font-medium hover:underline">
            <FiPlus size={15} /> Add New
          </button>
        </div>
        <div className="space-y-3">
          {addresses.map((addr, i) => (
            <AddressCard key={i} {...addr} />
          ))}
        </div>
      </div>
    </div>
  );
}
