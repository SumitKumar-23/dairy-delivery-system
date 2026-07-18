import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

const ProductCard = ({ product, onCartUpdate }) => {
  const handleAddToCart = async () => {
    try {
      await axiosInstance.post('/cart/add', { productId: product._id, quantity: 1 });
      toast.success(`${product.name} added to cart`);
      window.dispatchEvent(new Event('cart:updated'));
      onCartUpdate?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="group flex h-full flex-col rounded-[24px] border border-slate-200/80 bg-white/85 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div className="mb-3 flex h-28 items-center justify-center rounded-[20px] bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 text-4xl shadow-inner">
        🥛
      </div>
      <div className="mb-2 flex items-center justify-between text-[11px]">
        <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
          {product.category || 'Fresh'}
        </span>
        <span className="text-slate-400">{product.unit}</span>
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">{product.name}</h3>
      <div className="mt-auto flex items-end justify-between pt-3">
        <div>
          <p className="text-[11px] text-slate-400">Starts at</p>
          <p className="text-lg font-semibold text-slate-900">₹{product.price}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;