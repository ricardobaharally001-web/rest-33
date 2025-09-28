import Link from "next/link";

export default function AdminIndex() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Link href="/admin/settings" className="card p-6 hover:shadow-lg transition">Settings</Link>
      <Link href="/admin/categories" className="card p-6 hover:shadow-lg transition">Categories</Link>
      <Link href="/admin/products" className="card p-6 hover:shadow-lg transition">Products</Link>
    </div>
  );
}
