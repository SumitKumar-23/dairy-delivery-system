import { useEffect, useState } from 'react';
import { Search, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Milk', 'Curd', 'Paneer', 'Butter', 'Cheese', 'Ghee', 'Cream', 'Yogurt', 'Flavored Milk'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory) params.category = activeCategory;
      if (search) params.search = search;

      const res = await axiosInstance.get('/products', { params });
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative mb-6 overflow-hidden rounded-[30px] border border-white/70 bg-gradient-to-br from-sky-700 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_30%)]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm font-medium text-blue-50 backdrop-blur">
                <Sparkles size={16} /> Fresh from farm to your door
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pure & Healthy Dairy</h1>
              <p className="mt-2 text-sm text-blue-100 sm:text-base">
                Fresh milk, creamy curd, and handcrafted dairy essentials delivered to your doorstep.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-50">
                  <Truck size={16} /> Next-day
                </div>
                <p className="mt-1 text-xl font-semibold">Delivery</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-50">
                  <ShieldCheck size={16} /> Quality
                </div>
                <p className="mt-1 text-xl font-semibold">Checked</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex w-full max-w-2xl items-center gap-2 rounded-[20px] border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search milk, curd, paneer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-0 bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Search
            </button>
          </div>
        </form>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory('')}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === '' ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white/80 text-slate-600 hover:border-blue-200 hover:text-blue-600'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white/80 text-slate-600 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-8 text-center text-sm text-slate-500 shadow-sm">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500 shadow-sm">
            No products found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;