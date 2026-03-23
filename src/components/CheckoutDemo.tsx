import { type ReactNode } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { useDark } from "../context/DarkContext";
import { CART } from "../constants/demoData";
import { IconBox } from "./icons";

function FlagHint({
  flagKey,
  enabled,
  children,
}: {
  flagKey: string;
  enabled: boolean;
  children: ReactNode;
}) {
  const dark = useDark();
  return (
    <div
      className={`mt-3 rounded-lg border border-dashed px-4 py-3 text-center text-sm ${
        dark
          ? "border-gray-600 bg-gray-800/50 text-gray-400"
          : "border-gray-300 bg-gray-50 text-gray-500"
      }`}
    >
      <code className="font-semibold text-indigo-500">{flagKey}</code> is{" "}
      {enabled ? (
        <span className="font-semibold text-emerald-500">ON</span>
      ) : (
        <span
          className={`font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}
        >
          OFF
        </span>
      )}
      {" — "}
      {children}
    </div>
  );
}

function ClassicCheckout() {
  const dark = useDark();
  const total = CART.reduce((sum, item) => sum + item.price, 0);
  return (
    <div
      className={`rounded-xl border p-6 shadow-sm transition-colors ${
        dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <h3
        className={`text-lg font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}
      >
        Classic Checkout
      </h3>
      <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
        Standard checkout flow (flag is off)
      </p>
      <div className="mt-5 space-y-2">
        {CART.map((item) => (
          <div
            key={item.name}
            className={`flex justify-between text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}
          >
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div
          className={`border-t pt-2 ${dark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div
            className={`flex justify-between text-base font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}
          >
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button
        className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${
          dark ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        Place Order
      </button>
    </div>
  );
}

function NewCheckout() {
  const total = CART.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-indigo-900">New Checkout</h3>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
          Beta
        </span>
      </div>
      <p className="mt-1 text-sm text-indigo-600">
        Redesigned experience (flag is on)
      </p>
      <div className="mt-5 space-y-3">
        {CART.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <IconBox />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-indigo-700">
              ${item.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-indigo-100/50 px-4 py-3">
        <span className="font-semibold text-indigo-900">Total</span>
        <span className="text-xl font-bold text-indigo-700">${total.toFixed(2)}</span>
      </div>
      <button className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-lg">
        Complete Purchase
      </button>
    </div>
  );
}

export function CheckoutDemo() {
  const dark = useDark();
  const { enabled, loading } = useFeatureFlag("new-checkout");

  return (
    <div>
      {loading ? (
        <div
          className={`flex items-center justify-center rounded-xl border py-12 shadow-sm ${
            dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : enabled ? (
        <NewCheckout />
      ) : (
        <ClassicCheckout />
      )}
      {!loading && (
        <FlagHint flagKey="new-checkout" enabled={enabled}>
          {enabled
            ? "Showing the redesigned checkout. Turn it off in the Dashboard to see the classic version."
            : "Showing the classic checkout. Turn it on in the Dashboard to see the new design."}
        </FlagHint>
      )}
    </div>
  );
}
