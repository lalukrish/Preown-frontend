import { FiHeart, FiShoppingCart } from "react-icons/fi";

export default function WishlistCard({
  name,
  price,
  originalPrice,
  image,
  inStock,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 items-center">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 object-contain rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-cyan-800">{price}</span>
          <span className="text-xs text-gray-400 line-through">
            {originalPrice}
          </span>
        </div>
        <span
          className={`text-xs mt-1 inline-block font-medium ${inStock ? "text-green-500" : "text-red-400"}`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button className="p-2 text-gray-400 hover:text-cyan-800 transition-colors">
          <FiHeart size={16} />
        </button>
        <button
          disabled={!inStock}
          className="p-2 text-gray-400 hover:text-cyan-800 transition-colors disabled:opacity-30"
        >
          <FiShoppingCart size={16} />
        </button>
      </div>
    </div>
  );
}
