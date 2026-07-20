import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, Headphones, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const features = [
  {
    title: 'Fresh every day',
    description: 'Premium dairy and pantry essentials delivered with farm-fresh quality.',
    icon: Sparkles,
  },
  {
    title: 'Flexible subscriptions',
    description: 'Set recurring deliveries for milk, curd, butter, and more.',
    icon: Clock3,
  },
  {
    title: 'Safe checkout',
    description: 'Fast, secure ordering with easy tracking and dependable support.',
    icon: ShieldCheck,
  },
  {
    title: 'Always here to help',
    description: 'Chat with support and manage your orders without friction.',
    icon: Headphones,
  },
];

const highlights = [
  { label: 'Same-day', value: '95%' },
  { label: 'Delivery accuracy', value: '4.9/5' },
  { label: 'Happy households', value: '10k+' },
];

const sampleProducts = [
  { name: 'Farm Fresh Milk', detail: '2L · Morning delivery', badge: 'Popular' },
  { name: 'Creamy Curd', detail: '500g · Ready to serve', badge: 'New' },
  { name: 'Butter Pack', detail: '250g · Pure & rich', badge: 'Best Seller' },
];

const Landing = () => {
  const { user } = useAuth();

  if (user?.role === 'customer') {
    return <Navigate to="/home" replace />;
  }

  if (user?.role === 'vendor') {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  if (user?.role === 'delivery_agent') {
    return <Navigate to="/agent/dashboard" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%)] text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur hover:bg-white transition">
          <img src={logo} alt="DairyFresh Logo" className="h-6 w-6 object-contain" />
          DairyFresh
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600">
            Login
          </Link>
          <Link
            to={user ? '/home' : '/register'}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-sky-700 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm font-medium text-blue-50 backdrop-blur">
                <Sparkles size={16} /> Fresh dairy, right at your doorstep
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Make daily essentials feel effortless.
              </h1>
              <p className="mt-4 max-w-xl text-base text-blue-100 sm:text-lg">
                Discover fresh milk, curd, cheese, and more with quick delivery, smart subscriptions, and support that’s always close by.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={user ? '/home' : '/register'} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-slate-100">
                  Start shopping <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/20 bg-white/15 p-5 shadow-xl backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-50">
                <Truck size={16} /> Fast delivery window
              </div>
              <div className="space-y-3">
                {sampleProducts.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-blue-100">{item.detail}</p>
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-50">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-[20px] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-1 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Why families choose DairyFresh</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-[18px] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-3 inline-flex rounded-full bg-blue-100 p-2 text-blue-700">
                      <Icon size={16} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">{feature.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-blue-50 to-sky-50 p-6 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-blue-700 shadow-sm">
              <CheckCircle2 size={16} /> Trusted experience
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-800">Everything you need in one place</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-blue-600" />
                Browse dairy essentials in seconds.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-blue-600" />
                Schedule recurring deliveries for your routine.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-blue-600" />
                Support and order updates in the same app.
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
