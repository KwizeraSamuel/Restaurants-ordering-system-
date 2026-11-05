import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-100">
      <h2 className="text-3xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-slate-400 mb-6">The requested page or resource could not be found.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg transition-colors shadow-md"
      >
        Return to Kampala Bistro POS
      </Link>
    </div>
  );
}
