export default function EmiCard({
  product,
  totalAmount,
  paidAmount,
  remaining,
  monthlyEmi,
  nextDue,
  totalMonths,
  paidMonths,
  image,
}) {
  const progress = Math.round((paidMonths / totalMonths) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={product}
          className="w-14 h-14 object-contain rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">{product}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total: {totalAmount}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Monthly EMI</p>
          <p className="text-base font-bold text-cyan-800">{monthlyEmi}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Paid: {paidAmount}</span>
          <span>Remaining: {remaining}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-950 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>
            {paidMonths}/{totalMonths} months paid
          </span>
          <span>Next due: {nextDue}</span>
        </div>
      </div>
    </div>
  );
}
