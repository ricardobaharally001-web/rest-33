"use client";
import { useCart } from "@/lib/cart-store";
import { getSettings } from "@/lib/supabase";
import React from "react";

function money(cents: number) { return `$${(cents/100).toFixed(2)}`; }

export default function CartPage() {
  const { items, updateQty, remove, subtotal, clear } = useCart();
  const sub = subtotal();
  const [settings, setSettings] = React.useState<any>({});

  React.useEffect(() => { getSettings().then(setSettings); }, []);

  const checkout = () => {
    const lines = items.map(i => `• ${i.name} × ${i.qty} — ${money(i.price_cents * i.qty)}`);
    const message = [
      `Order for ${settings?.business_name || "cook-shop"}`,
      ...lines,
      `Subtotal: ${money(sub)}`,
      "",
      "Note: Pickup/Delivery? (add details)",
      "Payment method: Cash"
    ].join("\n");
    const phone = (settings?.whatsapp_number || "").replace(/[^\d]/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">${(i.price_cents/100).toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" min={1} className="input w-20" value={i.qty} onChange={e => updateQty(i.id, parseInt(e.target.value||'1'))} />
              <button className="btn btn-danger" onClick={() => remove(i.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Subtotal: {money(sub)}</div>
        <div className="flex gap-2">
          <button className="btn" onClick={() => clear()}>Clear</button>
          <button className="btn btn-primary" onClick={checkout}>Checkout via WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
