import { useFeatureFlag } from './hooks/useFeatureFlag';
import { PulseConfigCtx, type PulseConfig } from './hooks/usePulseConfig';
import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

const DASHBOARD_URL = 'http://localhost:4200';
const API_BASE = '/api';

/* ── Dark-mode context ────────────────────────────────── */

const DarkCtx = createContext(false);
const useDark = () => useContext(DarkCtx);

/* ── Types for selector ───────────────────────────────── */

interface ProjectInfo {
  id: string;
  name: string;
  slug: string;
}

interface EnvironmentInfo {
  id: string;
  name: string;
  slug: string;
}

interface ClientInfo {
  id: string;
  name: string;
}

/* ── SVG Icons ────────────────────────────────────────── */

const IconFlag = () => (
  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);
const IconRefresh = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const IconBox = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const IconLink = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

/* ── Flag definitions ─────────────────────────────────── */

interface FlagDef {
  key: string;
  label: string;
  description: string;
}

const ALL_FLAGS: FlagDef[] = [
  { key: 'new-checkout', label: 'New Checkout Flow', description: 'Redesigned checkout experience with improved UX' },
  { key: 'dark-mode', label: 'Dark Mode', description: 'Application-wide dark colour scheme' },
  { key: 'promo-banner', label: 'Promo Banner', description: 'Show promotional banner at the top of the page' },
  { key: 'maintenance-mode', label: 'Maintenance Mode', description: 'Show maintenance overlay, blocking all interactions' },
  { key: 'user-feedback', label: 'Feedback Widget', description: 'Floating widget for collecting user feedback' },
];

/* ═══════════════════════════════════════════════════════
   Components
   ═══════════════════════════════════════════════════════ */

/* ── Flag Status Table ────────────────────────────────── */

function FlagRow({ def }: { def: FlagDef }) {
  const dark = useDark();
  const { enabled, loading, error, refresh } = useFeatureFlag(def.key);

  return (
    <tr className={`border-b last:border-b-0 transition-colors ${
      dark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50/60'
    }`}>
      <td className="px-5 py-4">
        <code className={`rounded px-2 py-1 font-mono text-xs font-medium ${
          dark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
        }`}>
          {def.key}
        </code>
      </td>
      <td className="px-5 py-4">
        <div className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>{def.label}</div>
        <div className={`mt-0.5 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{def.description}</div>
      </td>
      <td className="px-5 py-4 text-center">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          loading
            ? dark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
            : error
              ? dark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-700'
              : enabled
                ? dark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                : dark
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-100 text-gray-600'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${
            loading
              ? 'animate-pulse bg-yellow-500'
              : error
                ? 'bg-red-500'
                : enabled
                  ? 'bg-emerald-500'
                  : 'bg-gray-400'
          }`} />
          {loading ? 'Loading' : error ? 'Error' : enabled ? 'ON' : 'OFF'}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <button
          onClick={refresh}
          className={`rounded-lg p-2 transition-colors ${
            dark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
          title="Refresh flag"
        >
          <IconRefresh />
        </button>
      </td>
    </tr>
  );
}

function FlagStatusTable() {
  const dark = useDark();
  return (
    <div className={`overflow-hidden rounded-xl border shadow-sm transition-colors ${
      dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className={`border-b ${dark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50/80'}`}>
            <th className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Key</th>
            <th className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Feature</th>
            <th className={`px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {ALL_FLAGS.map((f) => <FlagRow key={f.key} def={f} />)}
        </tbody>
      </table>
    </div>
  );
}

/* ── Promo Banner ─────────────────────────────────────── */

function PromoBanner() {
  const { enabled, loading } = useFeatureFlag('promo-banner');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (enabled) setDismissed(false);
  }, [enabled]);

  if (loading || !enabled || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <svg className="h-4 w-4 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
        </svg>
        <span>
          Spring Sale — Use code{' '}
          <code className="rounded bg-white/20 px-1.5 py-0.5 font-bold tracking-wider">LAUNCH20</code>{' '}
          for 20% off your entire order!
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/20"
        aria-label="Dismiss banner"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ── Checkout Demo ────────────────────────────────────── */

const CART = [
  { name: 'Wireless Headphones', price: 79.99 },
  { name: 'USB-C Cable', price: 12.99 },
  { name: 'Phone Stand', price: 24.99 },
];

function ClassicCheckout() {
  const dark = useDark();
  const total = CART.reduce((s, i) => s + i.price, 0);
  return (
    <div className={`rounded-xl border p-6 shadow-sm transition-colors ${
      dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <h3 className={`text-lg font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>Classic Checkout</h3>
      <p className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Standard checkout flow (flag is off)</p>
      <div className="mt-5 space-y-2">
        {CART.map((i) => (
          <div key={i.name} className={`flex justify-between text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
            <span>{i.name}</span>
            <span>${i.price.toFixed(2)}</span>
          </div>
        ))}
        <div className={`border-t pt-2 ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex justify-between text-base font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${
        dark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-gray-700'
      }`}>
        Place Order
      </button>
    </div>
  );
}

function NewCheckout() {
  const total = CART.reduce((s, i) => s + i.price, 0);
  return (
    <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-indigo-900">New Checkout</h3>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">Beta</span>
      </div>
      <p className="mt-1 text-sm text-indigo-600">Redesigned experience (flag is on)</p>
      <div className="mt-5 space-y-3">
        {CART.map((i) => (
          <div key={i.name} className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <IconBox />
              </div>
              <span className="text-sm font-medium text-gray-900">{i.name}</span>
            </div>
            <span className="text-sm font-semibold text-indigo-700">${i.price.toFixed(2)}</span>
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

function CheckoutDemo() {
  const dark = useDark();
  const { enabled, loading } = useFeatureFlag('new-checkout');

  return (
    <div>
      {loading ? (
        <div className={`flex items-center justify-center rounded-xl border py-12 shadow-sm ${
          dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
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
            ? 'Showing the redesigned checkout. Turn it off in the Dashboard to see the classic version.'
            : 'Showing the classic checkout. Turn it on in the Dashboard to see the new design.'}
        </FlagHint>
      )}
    </div>
  );
}

/* ── Maintenance Mode Overlay ─────────────────────────── */

function MaintenanceOverlay() {
  const { enabled, loading } = useFeatureFlag('maintenance-mode');
  if (loading || !enabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Under Maintenance</h2>
        <p className="mt-2 text-sm text-gray-500">
          We're performing scheduled maintenance to improve your experience.
          Please check back shortly.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          Maintenance in progress
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-500">
          Controlled by <code className="font-semibold text-indigo-600">maintenance-mode</code> flag
        </div>
      </div>
    </div>
  );
}

/* ── Feedback Widget ──────────────────────────────────── */

function FeedbackWidget() {
  const { enabled, loading } = useFeatureFlag('user-feedback');
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setOpen(false);
      setSubmitted(false);
      setRating(0);
    }
  }, [enabled]);

  if (loading || !enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open ? (
        <div className="w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-indigo-600 px-5 py-3.5 text-white">
            <h3 className="text-sm font-semibold">Share your feedback</h3>
            <button
              onClick={() => { setOpen(false); setSubmitted(false); setRating(0); }}
              className="rounded-full p-1 transition-colors hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {submitted ? (
            <div className="px-5 py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Thank you!</p>
              <p className="mt-1 text-sm text-gray-500">Your feedback has been received.</p>
            </div>
          ) : (
            <div className="space-y-4 p-5">
              <div>
                <label className="text-sm font-medium text-gray-700">How's your experience?</label>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-indigo-50"
                    >
                      <svg
                        className={`h-6 w-6 transition-colors ${n <= rating ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tell us more (optional)</label>
                <textarea
                  rows={3}
                  placeholder="What can we improve?"
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setSubmitted(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-500 hover:shadow-xl hover:scale-105"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ── Reusable hint bar below demos ────────────────────── */

function FlagHint({ flagKey, enabled, children }: { flagKey: string; enabled: boolean; children: ReactNode }) {
  const dark = useDark();
  return (
    <div className={`mt-3 rounded-lg border border-dashed px-4 py-3 text-center text-sm ${
      dark ? 'border-gray-600 bg-gray-800/50 text-gray-400' : 'border-gray-300 bg-gray-50 text-gray-500'
    }`}>
      <code className="font-semibold text-indigo-500">{flagKey}</code> is{' '}
      {enabled ? (
        <span className="font-semibold text-emerald-500">ON</span>
      ) : (
        <span className={`font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>OFF</span>
      )}
      {' — '}
      {children}
    </div>
  );
}

/* ── Feature Showcase Cards ───────────────────────────── */

function FeatureShowcase({ flagKey, title, description, icon }: {
  flagKey: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  const dark = useDark();
  const { enabled, loading } = useFeatureFlag(flagKey);

  return (
    <div className={`rounded-xl border p-5 shadow-sm transition-colors ${
      dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          enabled
            ? 'bg-emerald-100 text-emerald-600'
            : dark
              ? 'bg-gray-700 text-gray-400'
              : 'bg-gray-100 text-gray-500'
        }`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-900'}`}>{title}</h3>
            {!loading && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                enabled
                  ? 'bg-emerald-50 text-emerald-700'
                  : dark
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {enabled ? 'ON' : 'OFF'}
              </span>
            )}
          </div>
          <p className={`mt-1 text-xs leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Connection health ────────────────────────────────── */

function ConnectionBanner() {
  const dark = useDark();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch(`${API_BASE}/projects`);
        setOk(r.ok);
      } catch {
        setOk(false);
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, []);

  if (ok === null || ok) return null;

  return (
    <div className={`mb-6 flex items-center gap-3 rounded-xl border px-5 py-3 text-sm ${
      dark ? 'border-red-800 bg-red-950/50 text-red-300' : 'border-red-200 bg-red-50 text-red-700'
    }`}>
      <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
      Cannot reach the Pulse Dashboard API at <code className="font-semibold">{DASHBOARD_URL}</code>.
      Make sure it is running.
    </div>
  );
}

/* ── Project / Client Selector ────────────────────────── */

function ConfigSelector({
  config,
  onChange,
}: {
  config: PulseConfig;
  onChange: (c: PulseConfig) => void;
}) {
  const dark = useDark();
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [environments, setEnvironments] = useState<EnvironmentInfo[]>([]);
  const [clients, setClients] = useState<ClientInfo[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!config.projectSlug) {
      setEnvironments([]);
      setClients([]);
      return;
    }
    fetch(`${API_BASE}/projects/${config.projectSlug}/environments`)
      .then((r) => r.json())
      .then(setEnvironments)
      .catch(() => setEnvironments([]));
  }, [config.projectSlug]);

  const selectedEnv = environments.find((e) => e.id === config.environmentId);

  useEffect(() => {
    if (!config.projectSlug || !selectedEnv) {
      setClients([]);
      return;
    }
    fetch(
      `${API_BASE}/projects/${config.projectSlug}/environments/${selectedEnv.slug}/clients`,
    )
      .then((r) => r.json())
      .then(setClients)
      .catch(() => setClients([]));
  }, [config.projectSlug, selectedEnv]);

  useEffect(() => {
    if (projects.length > 0 && !config.projectSlug) {
      onChange({ projectSlug: projects[0].slug, environmentId: null, clientId: null });
    }
  }, [projects, config.projectSlug, onChange]);

  const selectClass = `w-full rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
    dark
      ? 'border-gray-600 bg-gray-700 text-gray-100'
      : 'border-gray-300 bg-white text-gray-900'
  }`;
  const labelClass = `mb-1 block text-xs font-semibold uppercase tracking-wider ${
    dark ? 'text-gray-400' : 'text-gray-500'
  }`;

  return (
    <div className={`mb-8 rounded-xl border p-4 shadow-sm transition-colors ${
      dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className={labelClass}>Project</label>
          <select
            value={config.projectSlug}
            onChange={(e) =>
              onChange({ projectSlug: e.target.value, environmentId: null, clientId: null })
            }
            className={selectClass}
          >
            <option value="">Select a project...</option>
            {projects.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className={labelClass}>
            Environment
            <span className={`ml-1.5 font-normal normal-case ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              (optional)
            </span>
          </label>
          <select
            value={config.environmentId ?? ''}
            onChange={(e) =>
              onChange({ ...config, environmentId: e.target.value || null, clientId: null })
            }
            disabled={!config.projectSlug}
            className={selectClass}
          >
            <option value="">Project default</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className={labelClass}>
            Client
            <span className={`ml-1.5 font-normal normal-case ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              (optional)
            </span>
          </label>
          <select
            value={config.clientId ?? ''}
            onChange={(e) =>
              onChange({ ...config, clientId: e.target.value || null })
            }
            disabled={!config.environmentId}
            className={selectClass}
          >
            <option value="">
              {config.environmentId ? 'Env default' : 'Select env first'}
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   App
   ═══════════════════════════════════════════════════════ */

function AppInner({ configSelector }: { configSelector: ReactNode }) {
  const { enabled: isDark, loading: darkLoading } = useFeatureFlag('dark-mode');
  const dark = !darkLoading && isDark;

  return (
    <DarkCtx.Provider value={dark}>
      <div className={`min-h-screen transition-colors duration-500 ${
        dark
          ? 'bg-gray-950 text-gray-100'
          : 'bg-gradient-to-br from-gray-50 via-white to-indigo-50/30'
      }`}>
        <PromoBanner />
        <MaintenanceOverlay />

        <div className="mx-auto max-w-2xl px-4 py-12">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg ${
              dark ? 'shadow-indigo-500/20' : 'shadow-indigo-200'
            }`}>
              <IconFlag />
            </div>
            <h1 className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              Pulse Demo
            </h1>
            <p className={`mt-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              A standalone consumer app showing how feature flags control UI in real time.
            </p>
            <a
              href={DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-400"
            >
              Open Dashboard <IconLink />
            </a>
          </div>

          <ConnectionBanner />

          {/* Flag status table */}
          <section className="mb-10">
            <h2 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Flag Status <span className={`font-normal ${dark ? 'text-gray-600' : 'text-gray-300'}`}>— auto-refreshes every 5 s</span>
            </h2>
            {configSelector}
            <FlagStatusTable />
          </section>

          {/* Checkout demo */}
          <section className="mb-10">
            <h2 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Live Feature Demo — <code className="normal-case text-indigo-500">new-checkout</code>
            </h2>
            <CheckoutDemo />
          </section>

          {/* Dark mode info card */}
          <section className="mb-10">
            <h2 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Live Feature Demo — <code className="normal-case text-indigo-500">dark-mode</code>
            </h2>
            <div className={`rounded-xl border p-6 shadow-sm transition-colors ${
              dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  dark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  {dark ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-base font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {dark ? 'Dark Mode Active' : 'Light Mode Active'}
                  </p>
                  <p className={`mt-0.5 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {dark
                      ? 'The entire page has switched to a dark theme. Turn off the flag to revert.'
                      : 'Turn on the dark-mode flag in the Dashboard to see the entire page switch to a dark theme.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Feature showcase cards */}
          <section className="mb-10">
            <h2 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              More Feature Demos
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FeatureShowcase
                flagKey="promo-banner"
                title="Promo Banner"
                description="Toggle to show a promotional banner at the top of the page with a discount code."
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                  </svg>
                }
              />
              <FeatureShowcase
                flagKey="maintenance-mode"
                title="Maintenance Mode"
                description="Toggle to show a full-screen overlay simulating a maintenance window."
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                }
              />
              <FeatureShowcase
                flagKey="user-feedback"
                title="Feedback Widget"
                description="Toggle to show a floating feedback button in the bottom-right corner."
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                }
              />
            </div>
          </section>

          {/* How it works */}
          <section className={`rounded-xl border p-6 shadow-sm transition-colors ${
            dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <h2 className={`text-base font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>How it works</h2>
            <ol className={`mt-3 space-y-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              {[
                <>Select a <strong>project</strong>, optional <strong>environment</strong>, and optional <strong>client</strong> to scope flag evaluation.</>,
                <>This app calls <code className={`rounded px-1.5 py-0.5 text-xs ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>GET /api/eval/:projectSlug/:flagKey?environmentId=…&clientId=…</code> to evaluate each flag.</>,
                <>The <code className={`rounded px-1.5 py-0.5 text-xs ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>useFeatureFlag</code> hook polls every 5 seconds to detect changes.</>,
                <>Toggle a flag in the Dashboard and watch this page react — no redeploy needed. Switching environments or clients shows different flag values.</>,
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    dark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  }`}>{i + 1}</span>
                  {text}
                </li>
              ))}
            </ol>
          </section>

          <footer className={`mt-10 border-t pt-6 text-center text-xs ${
            dark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'
          }`}>
            Pulse Feature Flags — Demo App &middot; Connects to Dashboard API
          </footer>
        </div>

        <FeedbackWidget />
      </div>
    </DarkCtx.Provider>
  );
}

export default function App() {
  const [config, setConfig] = useState<PulseConfig>(() => {
    try {
      const saved = localStorage.getItem('pulse-demo-config');
      if (saved) return JSON.parse(saved) as PulseConfig;
    } catch { /* ignore */ }
    return { projectSlug: '', environmentId: null, clientId: null };
  });

  useEffect(() => {
    localStorage.setItem('pulse-demo-config', JSON.stringify(config));
  }, [config]);

  return (
    <PulseConfigCtx.Provider value={config}>
      <AppInner configSelector={<ConfigSelector config={config} onChange={setConfig} />} />
    </PulseConfigCtx.Provider>
  );
}
