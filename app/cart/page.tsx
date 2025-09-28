"use client";
import { useCart } from "@/lib/cart-store";
import { getSettings } from "@/lib/supabase";
import React from "react";
import { ShoppingCart, Trash2, Package } from "lucide-react";
import Image from "next/image";

function money(cents: number) { return `$${(cents/100).toFixed(2)}`; }

export default function CartPage() {
  const { items, updateQty, remove, subtotal, clear } = useCart();
  const sub = subtotal();
  const [settings, setSettings] = React.useState<any>({});

  React.useEffect(() => { getSettings().then(setSettings); }, []);

  const checkout = () => {
    const lines = items.map(i => `• ${i.name} × ${i.qty} — ${money(i.price_cents * i.qty)}`);
    const message = [
      `🛒 Order for ${settings?.business_name || "cook-shop"}`,
      `━━━━━━━━━━━━━━━`,
      ...lines,
      `━━━━━━━━━━━━━━━`,
      `💰 Subtotal: ${money(sub)}`,
      "",
      `📍 Delivery Address: (please provide)`,
      `💳 Payment: Cash on delivery`,
      `📞 Contact: (your number)`
    ].join("\n");
    const phone = (settings?.whatsapp_number || "").replace(/[^\d]/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (!items.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-6 text-gray-500">Add some delicious items to get started!</p>
        <a href="/" className="btn btn-primary">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map(i => (
              <div key={i.id} className="card flex items-center gap-4 p-4">
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <Package className="h-full w-full p-5 text-gray-400" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{i.name}</h3>
                  <p className="text-sm text-gray-500">{money(i.price_cents)} each</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => updateQty(i.id, Math.max(1, i.qty - 1))}
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">{i.qty}</span>
                  <button 
                    className="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => updateQty(i.id, i.qty + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">{money(i.price_cents * i.qty)}</p>
                  <button 
                    className="mt-1 text-sm text-red-500 hover:text-red-600"
                    onClick={() => remove(i.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
            
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{money(sub)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="my-2 border-t pt-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-2xl">{money(sub)}</span>
              </div>
            </div>
            
            <button className="btn btn-primary mb-2 w-full" onClick={checkout}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Checkout via WhatsApp
            </button>
            <button className="btn btn-ghost w-full text-sm" onClick={() => clear()}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
