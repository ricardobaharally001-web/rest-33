"use client";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";

export default function ProductCard({ product }: { product: any }) {
  const add = useCart(s => s.add);
  const price = (product.price_cents ?? 0) / 100;
  return (
    <div className="card overflow-hidden">
      {product.image_url && (
        <div className="relative aspect-square">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold">${price.toFixed(2)}</span>
          <button className="btn btn-primary"
            onClick={() => add({ id: product.id, name: product.name, price_cents: product.price_cents, qty: 1 })}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
