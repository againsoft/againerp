"use client";

import { useState, useRef } from "react";
import {
  Search, ShoppingCart, Trash2, Plus, Minus, X,
  CreditCard, Banknote, Smartphone, Receipt,
  ChevronRight, CheckCircle2, RotateCcw, Tag,
  User, Settings, LogOut, Percent, Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Product catalogue (POS subset) ──────────────────────────────────────────

interface POSProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  emoji: string;
}

const POS_PRODUCTS: POSProduct[] = [
  { id: "p1",  name: "Classic Cotton T-Shirt", sku: "UW-TEE-001", price: 299,  category: "Apparel",     stock: 24, emoji: "👕" },
  { id: "p2",  name: "Wireless Earbuds Pro",   sku: "SKU-0002",   price: 2490, category: "Electronics", stock: 7,  emoji: "🎧" },
  { id: "p3",  name: "Ceramic Coffee Mug",     sku: "SKU-0003",   price: 450,  category: "Home",        stock: 14, emoji: "☕" },
  { id: "p4",  name: "Running Shoes Ultra",    sku: "SKU-0004",   price: 3200, category: "Apparel",     stock: 21, emoji: "👟" },
  { id: "p5",  name: "Smart Watch Series 5",   sku: "SKU-0005",   price: 8900, category: "Electronics", stock: 3,  emoji: "⌚" },
  { id: "p6",  name: "Linen Summer Dress",     sku: "SKU-0006",   price: 1850, category: "Apparel",     stock: 35, emoji: "👗" },
  { id: "p7",  name: "Bluetooth Speaker Mini", sku: "SKU-0007",   price: 1200, category: "Electronics", stock: 42, emoji: "🔊" },
  { id: "p8",  name: "Organic Face Serum",     sku: "SKU-0008",   price: 890,  category: "Beauty",      stock: 49, emoji: "🧴" },
  { id: "p9",  name: "Yoga Mat Pro",           sku: "SKU-0009",   price: 1500, category: "Sports",      stock: 56, emoji: "🧘" },
  { id: "p10", name: "LED Desk Lamp",          sku: "SKU-0010",   price: 1800, category: "Home",        stock: 0,  emoji: "💡" },
  { id: "p11", name: "Leather Wallet",         sku: "SKU-0011",   price: 650,  category: "Apparel",     stock: 70, emoji: "👛" },
  { id: "p12", name: "Water Bottle (Steel)",   sku: "SKU-0012",   price: 580,  category: "Sports",      stock: 77, emoji: "🍶" },
  { id: "p13", name: "Graphic Hoodie",         sku: "SKU-0013",   price: 1400, category: "Apparel",     stock: 84, emoji: "🧥" },
  { id: "p14", name: "USB-C Hub 7-in-1",       sku: "SKU-0014",   price: 2200, category: "Electronics", stock: 0,  emoji: "🔌" },
  { id: "p15", name: "Notebook (A5)",          sku: "SKU-0015",   price: 180,  category: "Stationery",  stock: 120, emoji: "📓" },
  { id: "p16", name: "Sunscreen SPF 50",       sku: "SKU-0016",   price: 420,  category: "Beauty",      stock: 60, emoji: "🧴" },
];

const CATEGORIES = ["All", "Apparel", "Electronics", "Home", "Beauty", "Sports", "Stationery"];

// ─── Cart types ───────────────────────────────────────────────────────────────

interface CartItem {
  product: POSProduct;
  qty: number;
  discount: number;
}

type PaymentMethod = "cash" | "bkash" | "card";
type Screen = "pos" | "payment" | "receipt";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) { return `৳${n.toLocaleString()}`; }
function genOrderNo() { return `POS-${Date.now().toString().slice(-6)}`; }

// ─── Receipt Modal ────────────────────────────────────────────────────────────

function ReceiptModal({ items, total, method, orderNo, onClose }: {
  items: CartItem[];
  total: number;
  method: PaymentMethod;
  orderNo: string;
  onClose: () => void;
}) {
  const methodLabel = { cash: "Cash", bkash: "bKash", card: "Card" }[method];
  const now = new Date().toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-input bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-5 text-center text-primary-foreground">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-90" />
          <p className="text-lg font-bold">Payment Successful</p>
          <p className="text-sm opacity-80">{fmt(total)} via {methodLabel}</p>
        </div>

        {/* Receipt body */}
        <div className="px-5 py-4 font-mono text-[12px] space-y-2">
          <div className="text-center mb-3">
            <p className="font-bold text-base not-italic font-sans">AgainShop</p>
            <p className="text-muted-foreground">Dhaka HQ · 01712-345678</p>
            <p className="text-muted-foreground">{now}</p>
            <p className="font-semibold mt-1">#{orderNo}</p>
          </div>

          <div className="border-t border-dashed border-input pt-2 space-y-1">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span className="flex-1 truncate pr-2">{item.product.name} ×{item.qty}</span>
                <span>{fmt(item.product.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-input pt-2 space-y-0.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (5%)</span><span>{fmt(Math.round(total * 0.05))}</span>
            </div>
            <div className="flex justify-between font-bold text-[14px] pt-1 border-t border-input mt-1">
              <span>TOTAL</span><span>{fmt(Math.round(total * 1.05))}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-input pt-2 text-center text-muted-foreground">
            <p>Thank you for shopping!</p>
            <p>Exchange within 7 days with receipt</p>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <Button variant="outline" className="flex-1 gap-1.5" size="sm">
            <Receipt className="h-3.5 w-3.5" /> Print
          </Button>
          <Button className="flex-1" size="sm" onClick={onClose}>
            New Sale
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment screen ───────────────────────────────────────────────────────────

function PaymentScreen({ total, onPay, onBack }: {
  total: number;
  onPay: (method: PaymentMethod, tender: number) => void;
  onBack: () => void;
}) {
  const [method, setMethod]   = useState<PaymentMethod>("cash");
  const [tender, setTender]   = useState(String(total));
  const change = Math.max(0, Number(tender) - total);

  const METHODS: { key: PaymentMethod; label: string; icon: React.ElementType; color: string }[] = [
    { key: "cash",   label: "Cash",   icon: Banknote,    color: "text-emerald-600 border-emerald-300 bg-emerald-50" },
    { key: "bkash",  label: "bKash",  icon: Smartphone,  color: "text-pink-600 border-pink-300 bg-pink-50"         },
    { key: "card",   label: "Card",   icon: CreditCard,  color: "text-blue-600 border-blue-300 bg-blue-50"         },
  ];

  const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-input">
        <button onClick={onBack} className="rounded-md p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        <p className="font-semibold">Payment</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Amount */}
        <div className="rounded-xl border border-input bg-muted/30 p-4 text-center">
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Amount Due</p>
          <p className="text-4xl font-bold mt-1">{fmt(total)}</p>
        </div>

        {/* Method */}
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Payment Method</p>
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 transition-all ${
                  method === m.key ? `${m.color} border-current` : "border-input bg-card hover:bg-muted"
                }`}
              >
                <m.icon className="h-5 w-5" />
                <span className="text-[12px] font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cash tender */}
        {method === "cash" && (
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Cash Tendered</p>
            <input
              className="w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-xl font-bold text-center focus:outline-none focus:border-primary"
              value={tender}
              onChange={(e) => setTender(e.target.value.replace(/[^0-9]/g, ""))}
            />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setTender(String(a))}
                  className="rounded-lg border border-input bg-card py-2 text-[12px] font-medium hover:bg-muted transition-colors"
                >
                  {fmt(a)}
                </button>
              ))}
            </div>
            {change > 0 && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex justify-between items-center">
                <span className="text-[13px] text-emerald-700 font-medium">Change Due</span>
                <span className="text-xl font-bold text-emerald-700">{fmt(change)}</span>
              </div>
            )}
          </div>
        )}

        {method === "bkash" && (
          <div className="rounded-xl border-2 border-pink-200 bg-pink-50 p-4 text-center space-y-2">
            <Smartphone className="h-10 w-10 text-pink-500 mx-auto" />
            <p className="font-semibold text-pink-800">bKash Payment</p>
            <p className="text-[12px] text-pink-700">Merchant: 01712-345678</p>
            <p className="text-[12px] text-pink-700">Amount: <span className="font-bold">{fmt(total)}</span></p>
            <p className="text-[11px] text-pink-600">Ask customer to send via bKash Send Money</p>
          </div>
        )}

        {method === "card" && (
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center space-y-2">
            <CreditCard className="h-10 w-10 text-blue-500 mx-auto" />
            <p className="font-semibold text-blue-800">Card Payment</p>
            <p className="text-[12px] text-blue-700">Insert or tap card on terminal</p>
            <p className="text-[12px] text-blue-700">Amount: <span className="font-bold">{fmt(total)}</span></p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-input">
        <Button
          className="w-full h-12 text-base font-semibold gap-2"
          onClick={() => onPay(method, Number(tender))}
          disabled={method === "cash" && Number(tender) < total}
        >
          <CheckCircle2 className="h-5 w-5" />
          Confirm Payment — {fmt(total)}
        </Button>
      </div>
    </div>
  );
}

// ─── Main POS Terminal ────────────────────────────────────────────────────────

export function POSTerminal() {
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("All");
  const [cart,       setCart]       = useState<CartItem[]>([]);
  const [screen,     setScreen]     = useState<Screen>("pos");
  const [orderNo,    setOrderNo]    = useState(genOrderNo());
  const [paidMethod, setPaidMethod] = useState<PaymentMethod>("cash");
  const [discount,   setDiscount]   = useState(0);
  const [showDisc,   setShowDisc]   = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = POS_PRODUCTS.filter((p) => {
    const matchCat  = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const subtotal = cart.reduce((s, item) => s + item.product.price * item.qty, 0);
  const discAmt  = Math.round(subtotal * (discount / 100));
  const total    = subtotal - discAmt;
  const itemCount = cart.reduce((s, item) => s + item.qty, 0);

  function addToCart(product: POSProduct) {
    if (product.stock === 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) return prev.map((c) => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { product, qty: 1, discount: 0 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) => prev
      .map((c) => c.product.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
      .filter((c) => c.qty > 0)
    );
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((c) => c.product.id !== id));
  }

  function clearCart() {
    setCart([]);
    setDiscount(0);
    setShowDisc(false);
  }

  function handlePay(method: PaymentMethod) {
    setPaidMethod(method);
    setScreen("receipt");
  }

  function handleNewSale() {
    clearCart();
    setOrderNo(genOrderNo());
    setScreen("pos");
    setTimeout(() => searchRef.current?.focus(), 100);
  }

  return (
    <div className="flex h-[calc(100vh-2.75rem)] bg-muted/20 overflow-hidden">

      {/* ── Left: Product grid ── */}
      <div className="flex flex-col flex-1 overflow-hidden border-r border-input">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-input shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1.5 text-primary font-bold text-lg">
              <ShoppingCart className="h-5 w-5" />
              POS
            </div>
            <span className="text-muted-foreground text-sm hidden sm:block">Point of Sale</span>
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              autoFocus
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Search product or scan barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded-md p-1.5 hover:bg-muted text-muted-foreground"><Settings className="h-4 w-4" /></button>
            <button className="rounded-md p-1.5 hover:bg-muted text-muted-foreground"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-4 py-2 bg-card border-b border-input overflow-x-auto shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {filtered.map((product) => {
              const inCart = cart.find((c) => c.product.id === product.id);
              const outOfStock = product.stock === 0;
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={outOfStock}
                  className={`relative rounded-xl border-2 bg-card p-3 text-left transition-all hover:shadow-md active:scale-95 ${
                    outOfStock ? "opacity-40 cursor-not-allowed border-input" :
                    inCart ? "border-primary bg-primary/5" : "border-input hover:border-primary/40"
                  }`}
                >
                  {inCart && (
                    <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {inCart.qty}
                    </div>
                  )}
                  <div className="text-3xl mb-2">{product.emoji}</div>
                  <p className="text-[12px] font-semibold leading-tight line-clamp-2">{product.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{product.sku}</p>
                  <p className="text-[13px] font-bold text-primary mt-1.5">{fmt(product.price)}</p>
                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-[10px] text-amber-600 mt-0.5">Only {product.stock} left</p>
                  )}
                  {outOfStock && <p className="text-[10px] text-red-500 mt-0.5">Out of stock</p>}
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Package className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Cart / Payment ── */}
      <div className="w-80 shrink-0 flex flex-col bg-card">
        {screen === "pos" && (
          <>
            {/* Cart header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-input">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <p className="font-semibold text-sm">Cart</p>
                {itemCount > 0 && (
                  <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5">{itemCount}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowDisc((v) => !v)} className="rounded-md p-1 hover:bg-muted text-muted-foreground" title="Discount">
                  <Percent className="h-3.5 w-3.5" />
                </button>
                <button onClick={clearCart} className="rounded-md p-1 hover:bg-muted text-muted-foreground" title="Clear cart">
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Customer row */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-input bg-muted/30">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground">Walk-in Customer</span>
              <button className="ml-auto text-[11px] text-primary hover:underline">Select</button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto divide-y divide-input">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                  <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm">Cart is empty</p>
                  <p className="text-[12px] mt-1">Click products to add</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-2 px-4 py-2.5">
                    <div className="text-xl shrink-0">{item.product.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate">{item.product.name}</p>
                      <p className="text-[11px] text-primary font-semibold">{fmt(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updateQty(item.product.id, -1)}
                        className="h-6 w-6 rounded-md border border-input bg-muted flex items-center justify-center hover:bg-muted/80"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-[13px] font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.product.id, 1)}
                        className="h-6 w-6 rounded-md border border-input bg-muted flex items-center justify-center hover:bg-muted/80"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item.product.id)} className="ml-1 text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount row */}
            {showDisc && (
              <div className="px-4 py-2.5 border-t border-input bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-[12px] font-medium text-amber-700">Order Discount</span>
                  <div className="flex items-center gap-1 ml-auto border border-amber-300 rounded-lg overflow-hidden">
                    {[0, 5, 10, 15, 20].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDiscount(d)}
                        className={`px-2 py-1 text-[11px] font-semibold transition-colors ${
                          discount === d ? "bg-amber-500 text-white" : "text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {d}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="border-t border-input px-4 py-3 space-y-1.5 bg-muted/20">
              <div className="flex justify-between text-[12px] text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[12px] text-amber-600">
                  <span>Discount ({discount}%)</span>
                  <span>-{fmt(discAmt)}</span>
                </div>
              )}
              <div className="flex justify-between text-[12px] text-muted-foreground">
                <span>Tax (5%)</span>
                <span>{fmt(Math.round(total * 0.05))}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-input pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary">{fmt(Math.round(total * 1.05))}</span>
              </div>
            </div>

            {/* Charge button */}
            <div className="px-4 pb-4 pt-2">
              <Button
                className="w-full h-12 text-base font-semibold gap-2"
                disabled={cart.length === 0}
                onClick={() => setScreen("payment")}
              >
                Charge {cart.length > 0 ? fmt(Math.round(total * 1.05)) : ""}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {screen === "payment" && (
          <PaymentScreen
            total={Math.round(total * 1.05)}
            onPay={handlePay}
            onBack={() => setScreen("pos")}
          />
        )}
      </div>

      {/* Receipt modal */}
      {screen === "receipt" && (
        <ReceiptModal
          items={cart}
          total={Math.round(total * 1.05)}
          method={paidMethod}
          orderNo={orderNo}
          onClose={handleNewSale}
        />
      )}
    </div>
  );
}
