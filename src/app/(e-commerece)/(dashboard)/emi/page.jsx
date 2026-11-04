import EmiCard from "@/components/dashboard/emi/EmiCard";

const emiPlans = [
  {
    product: "MacBook Air M1",
    totalAmount: "₹72,000",
    paidAmount: "₹36,000",
    remaining: "₹36,000",
    monthlyEmi: "₹6,000",
    nextDue: "28 Jul 2025",
    totalMonths: 12,
    paidMonths: 6,
    image: "/phone1.png",
  },
  {
    product: "Samsung Galaxy S22",
    totalAmount: "₹38,499",
    paidAmount: "₹25,666",
    remaining: "₹12,833",
    monthlyEmi: "₹6,417",
    nextDue: "02 Jul 2025",
    totalMonths: 6,
    paidMonths: 4,
    image: "/phone1.png",
  },
];

export default function EmiPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {emiPlans.length} active EMI plans
      </p>
      <div className="space-y-4">
        {emiPlans.map((plan, i) => (
          <EmiCard key={i} {...plan} />
        ))}
      </div>
    </div>
  );
}
