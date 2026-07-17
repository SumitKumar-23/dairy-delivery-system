import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

const ProductCard = ({ product, onCartUpdate }) => {
  const handleAddToCart = async () => {
    try {
      await axiosInstance.post('/cart/add', { productId: product._id, quantity: 1 });
      toast.success(`${product.name} added to cart`);
      onCartUpdate?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col hover:shadow-md transition-shadow">
      <div className="bg-gray-50 rounded-lg h-28 flex items-center justify-center mb-3 text-4xl">
        🥛
      </div>
      <h3 className="font-medium text-gray-800 text-sm line-clamp-2">{product.name}</h3>
      <p className="text-xs text-gray-400 mb-2">{product.unit}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-gray-900">₹{product.price}</span>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;