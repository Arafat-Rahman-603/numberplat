"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Order, OrderStatus, PaymentStatus, AdminSettings } from "@/types";
import {
  Package,
  DollarSign,
  CreditCard,
  Truck,
  Search,
  Filter,
  Download,
  Settings as SettingsIcon,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
  Lock,
  LogOut,
  Phone,
  Copy,
  Check,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authMounted, setAuthMounted] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"orders" | "settings" | "analytics">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalAdvanceCollected: 0,
    totalCodPending: 0,
    statusCounts: {} as Record<string, number>,
  });
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    if (!text) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedField(fieldId);
      setTimeout(() => {
        setCopiedField((prev) => (prev === fieldId ? null : prev));
      }, 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const CopyButton = ({ text, id, label }: { text: string; id: string; label?: string }) => {
    const isCopied = copiedField === id;
    return (
      <button
        type="button"
        onClick={() => handleCopy(text, id)}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer shrink-0"
        title={`${label || "কপি"} করুন`}
      >
        {isCopied ? (
          <>
            <Check className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-semibold">কপি হয়েছে!</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            {label && <span className="text-[10px]">{label}</span>}
          </>
        )}
      </button>
    );
  };

  useEffect(() => {
    setAuthMounted(true);
    const sessionAuth = typeof window !== "undefined" ? sessionStorage.getItem("bp_admin_auth") : null;
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const trimmed = passwordInput.trim();
    if (trimmed === "admin123" || trimmed === "bikeplate2026" || trimmed === "admin") {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("bp_admin_auth", "true");
      }
    } else {
      setAuthError("ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন। (ডিফল্ট: admin123)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("bp_admin_auth");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (paymentFilter !== "all") params.append("paymentStatus", paymentFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchSettings();
    }
  }, [isAuthenticated, statusFilter, paymentFilter]);

  const handleStatusUpdate = async (
    orderId: string,
    updates: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus }
  ) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsUpdating(true);
    setSaveSuccessMsg("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSaveSuccessMsg("সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        setTimeout(() => setSaveSuccessMsg(""), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (authMounted && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative">
          <div className="text-center mb-5 sm:mb-6">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-neutral-950 font-black flex items-center justify-center mx-auto mb-2.5 sm:mb-3 shadow-lg">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white">BikePlate BD Admin</h1>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">অর্ডার ম্যানেজমেন্ট কন্ট্রোল প্যানেল</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                অ্যাডমিন পাসওয়ার্ড দিন
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  autoFocus
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 sm:p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold py-2.5 sm:py-3 rounded-xl transition shadow-md cursor-pointer text-xs sm:text-sm"
            >
              ড্যাশবোর্ডে লগইন করুন
            </button>

            <div className="pt-1.5 text-center">
              <span className="text-[11px] text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-md font-mono inline-block">
                ডিফল্ট পাসওয়ার্ড: <span className="text-amber-400 font-bold">admin123</span>
              </span>
            </div>

            <div className="pt-2.5 border-t border-neutral-800/80 text-center">
              <Link
                href="/"
                className="text-xs text-neutral-400 hover:text-white transition inline-flex items-center gap-1"
              >
                <span>← মূল ওয়েবসাইটে ফিরে যান</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-3 sm:px-6 py-2.5 sm:py-3.5 sticky top-0 z-30 backdrop-blur-md bg-neutral-900/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="bg-amber-400 text-neutral-950 font-black px-2 py-0.5 rounded-lg text-sm sm:text-base shrink-0 shadow-xs">
              BP
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm sm:text-base leading-tight truncate">
                BikePlate BD <span className="hidden min-[480px]:inline text-xs font-normal text-amber-400">Admin</span>
              </h1>
              <p className="text-[10px] text-neutral-400 truncate hidden sm:block">অর্ডার ও পেমেন্ট কন্ট্রোল প্যানেল</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 sm:px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
              title="মূল ওয়েবসাইট দেখুন"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">ওয়েবসাইট</span>
            </Link>

            <a
              href="/api/admin/export?format=xlsx"
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="এক্সেল (.xlsx) ফরম্যাটে সমস্ত অর্ডার ডাউনলোড করুন"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Excel ডাউনলোড</span>
            </a>

            <a
              href="/api/admin/export?format=csv"
              className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 sm:px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              title="CSV ফরম্যাটে ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden min-[540px]:inline">CSV</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-200 px-2 sm:px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              title="লগআউট"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-3 sm:p-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-neutral-800 mb-4 sm:mb-6 gap-1 sm:gap-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === "orders"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>অর্ডার তালিকা ({stats.totalOrders})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === "settings"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>অফার ও বিজনেস সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === "analytics"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>অ্যানালিটিক্স ওভারভিউ</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4 sm:space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-neutral-900 border border-neutral-800 p-3 sm:p-5 rounded-xl sm:rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                  <span className="text-[11px] sm:text-xs">মোট অর্ডার</span>
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">{stats.totalOrders}</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 sm:mt-1 truncate">সংরক্ষিত সমস্ত অর্ডার</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-3 sm:p-5 rounded-xl sm:rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                  <span className="text-[11px] sm:text-xs">মোট বিক্রয় মূল্য</span>
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">৳ {stats.totalRevenue}</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 sm:mt-1 truncate">বাতিল ব্যতীত সর্বমোট ভলিউম</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-3 sm:p-5 rounded-xl sm:rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                  <span className="text-[11px] sm:text-xs">বিকাশ অগ্রিম আদায়</span>
                  <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E2136E]" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-pink-400">৳ {stats.totalAdvanceCollected}</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 sm:mt-1 truncate">সরাসরি বিকাশ গেটওয়েতে জমা</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-3 sm:p-5 rounded-xl sm:rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                  <span className="text-[11px] sm:text-xs">বাকি COD পাওনা</span>
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">৳ {stats.totalCodPending}</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 sm:mt-1 truncate">কুরিয়ার থেকে ডেলিভারিতে প্রাপ্য</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-neutral-900 border border-neutral-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchOrders();
                }}
                className="flex items-center gap-2 w-full md:max-w-md"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="নাম, ফোন, অর্ডার নং বা প্লেটের লেখা..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition shrink-0 cursor-pointer"
                >
                  খুঁজুন
                </button>
              </form>

              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-400 flex-1 min-[420px]:flex-none">
                  <Filter className="w-3.5 h-3.5 shrink-0 hidden min-[520px]:inline text-neutral-400" />
                  <span className="text-[11px] sm:text-xs">স্ট্যাটাস:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 min-[420px]:flex-none bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">সব স্ট্যাটাস</option>
                    <option value="Pending">Pending</option>
                    <option value="Awaiting Payment">Awaiting Payment</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-400 flex-1 min-[420px]:flex-none">
                  <span className="text-[11px] sm:text-xs">পেমেন্ট:</span>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="flex-1 min-[420px]:flex-none bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">সব পেমেন্ট</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Advance Paid">Advance Paid</option>
                    <option value="Fully Paid">Fully Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <button
                  onClick={fetchOrders}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 transition shrink-0 cursor-pointer"
                  title="রিফ্রেশ"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Mobile Order Cards View (visible on screens < md) */}
            <div className="md:hidden space-y-3">
              {orders.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-500 text-xs">
                  {loading ? "অর্ডার লোড হচ্ছে..." : "কোনো অর্ডার পাওয়া যায়নি"}
                </div>
              ) : (
                orders.map((order) => {
                  const item = order.items[0];
                  return (
                    <div
                      key={order.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 space-y-3 shadow-xs"
                    >
                      {/* Card Header: Order #, Date & View Details */}
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            {order.orderNumber}
                          </span>
                          <CopyButton text={order.orderNumber} id={`order-m-${order.id}`} />
                          <span className="text-[10px] text-neutral-500 ml-1">
                            {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>বিস্তারিত</span>
                        </button>
                      </div>

                      {/* Customer & Plate Info */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="min-w-0">
                          <span className="text-[10px] text-neutral-500 block">গ্রাহকের নাম:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-white truncate">{order.customerName}</span>
                            <CopyButton text={order.customerName} id={`name-m-${order.id}`} />
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="font-mono text-amber-400/90 text-[11px] inline-flex items-center gap-1 hover:underline truncate"
                            >
                              <Phone className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{order.customerPhone}</span>
                            </a>
                            <CopyButton text={order.customerPhone} id={`phone-m-${order.id}`} />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-neutral-500 block">প্লেটের নম্বর:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-bold text-white bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 text-[11px] inline-block truncate max-w-full">
                              {item?.customDetails?.fullPlateText || "N/A"}
                            </span>
                            {item?.customDetails?.fullPlateText && (
                              <CopyButton text={item.customDetails.fullPlateText} id={`plate-m-${order.id}`} />
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400 block truncate mt-0.5">
                            {order.district}
                          </span>
                        </div>
                      </div>

                      {/* Financials Strip */}
                      <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80 text-center">
                        <div>
                          <span className="text-[10px] text-neutral-400 block">মোট বিল</span>
                          <span className="font-mono font-bold text-white text-xs">৳{order.totalPayable}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 block">অগ্রিম</span>
                          <span className="font-mono font-bold text-pink-400 text-xs">৳{order.advanceAmount}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 block">বাকি COD</span>
                          <span className="font-mono font-bold text-amber-400 text-xs">৳{order.remainingCodAmount}</span>
                        </div>
                      </div>

                      {/* Status Dropdowns */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div>
                          <label className="text-[10px] text-neutral-400 block mb-1">পেমেন্ট স্ট্যাটাস:</label>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              handleStatusUpdate(order.id, {
                                paymentStatus: e.target.value as PaymentStatus,
                              })
                            }
                            className={`w-full text-xs font-semibold rounded-lg px-2 py-1.5 border border-neutral-700 bg-neutral-950 focus:outline-none cursor-pointer ${
                              order.paymentStatus === "Fully Paid"
                                ? "text-emerald-400"
                                : order.paymentStatus === "Advance Paid"
                                ? "text-amber-400"
                                : order.paymentStatus === "Failed"
                                ? "text-rose-400"
                                : "text-neutral-300"
                            }`}
                          >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Advance Paid">Advance Paid</option>
                            <option value="Fully Paid">Fully Paid</option>
                            <option value="Partially Paid">Partially Paid</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 block mb-1">অর্ডার স্ট্যাটাস:</label>
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusUpdate(order.id, {
                                orderStatus: e.target.value as OrderStatus,
                              })
                            }
                            className="w-full text-xs font-semibold rounded-lg px-2 py-1.5 border border-neutral-700 bg-neutral-950 text-white focus:outline-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Awaiting Payment">Awaiting Payment</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table View (visible on screens >= md) */}
            <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-3.5 font-semibold">অর্ডার নং / তারিখ</th>
                      <th className="p-3.5 font-semibold">গ্রাহকের নাম ও ফোন</th>
                      <th className="p-3.5 font-semibold">কাস্টম প্লেট</th>
                      <th className="p-3.5 font-semibold">বিল ও ছাড়</th>
                      <th className="p-3.5 font-semibold">অগ্রিম / বাকি COD</th>
                      <th className="p-3.5 font-semibold">পেমেন্ট স্ট্যাটাস</th>
                      <th className="p-3.5 font-semibold">অর্ডার স্ট্যাটাস</th>
                      <th className="p-3.5 font-semibold text-right">একশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-neutral-500">
                          {loading ? "অর্ডার লোড হচ্ছে..." : "কোনো অর্ডার পাওয়া যায়নি"}
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => {
                        const item = order.items[0];
                        return (
                          <tr key={order.id} className="hover:bg-neutral-800/40 transition">
                            <td className="p-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-amber-400">
                                  {order.orderNumber}
                                </span>
                                <CopyButton text={order.orderNumber} id={`order-d-${order.id}`} />
                              </div>
                              <span className="text-[10px] text-neutral-500 block mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-white">{order.customerName}</span>
                                <CopyButton text={order.customerName} id={`name-d-${order.id}`} />
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-neutral-400">{order.customerPhone}</span>
                                <CopyButton text={order.customerPhone} id={`phone-d-${order.id}`} />
                              </div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <span className="font-mono font-bold text-white bg-neutral-950 px-2 py-1 rounded border border-neutral-800 text-center">
                                  {item?.customDetails?.fullPlateText || "N/A"}
                                </span>
                                {item?.customDetails?.fullPlateText && (
                                  <CopyButton text={item.customDetails.fullPlateText} id={`plate-d-${order.id}`} />
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-400 mt-0.5 block text-center">
                                {item?.plateType === "both" ? "সামনে+পেছনে" : item?.plateType === "back" ? "পেছনে" : "সামনে"}
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="font-mono font-bold text-white block">৳ {order.totalPayable}</span>
                              {order.discountAmount > 0 && (
                                <span className="text-[10px] text-emerald-400 block">
                                  -৳{order.discountAmount} (৩০% ছাড়)
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="text-pink-400 font-mono block">
                                অগ্রিম: ৳{order.advanceAmount}
                              </span>
                              <span className="text-amber-400 font-mono font-bold block">
                                বাকি COD: ৳{order.remainingCodAmount}
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <select
                                value={order.paymentStatus}
                                onChange={(e) =>
                                  handleStatusUpdate(order.id, {
                                    paymentStatus: e.target.value as PaymentStatus,
                                  })
                                }
                                className={`text-[11px] font-semibold rounded-md px-2 py-1 border border-neutral-700 bg-neutral-950 focus:outline-none cursor-pointer ${
                                  order.paymentStatus === "Fully Paid"
                                    ? "text-emerald-400"
                                    : order.paymentStatus === "Advance Paid"
                                    ? "text-amber-400"
                                    : order.paymentStatus === "Failed"
                                    ? "text-rose-400"
                                    : "text-neutral-300"
                                }`}
                              >
                                <option value="Unpaid">Unpaid</option>
                                <option value="Advance Paid">Advance Paid</option>
                                <option value="Fully Paid">Fully Paid</option>
                                <option value="Partially Paid">Partially Paid</option>
                                <option value="Failed">Failed</option>
                                <option value="Refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <select
                                value={order.orderStatus}
                                onChange={(e) =>
                                  handleStatusUpdate(order.id, {
                                    orderStatus: e.target.value as OrderStatus,
                                  })
                                }
                                className="text-[11px] font-semibold rounded-md px-2 py-1 border border-neutral-700 bg-neutral-950 text-white focus:outline-none cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Awaiting Payment">Awaiting Payment</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition cursor-pointer"
                                title="বিস্তারিত দেখুন"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Settings & Discounts */}
        {activeTab === "settings" && settings && (
          <form onSubmit={handleSaveSettings} className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-neutral-800">
                <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <h2 className="font-bold text-sm sm:text-base">অগ্রিম পেমেন্ট ও ৩০% ডিসকাউন্ট পলিসি</h2>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 gap-3">
                  <div className="min-w-0">
                    <label className="text-xs sm:text-sm font-semibold text-white block">
                      ৩০% স্পেশাল ডিসকাউন্ট অফার চালু রাখুন
                    </label>
                    <p className="text-[11px] sm:text-xs text-neutral-400">
                      সক্ষম থাকলে গ্রাহক অগ্রিম পরিশোধ করলে নির্ধারিত হারে ছাড় পাবে
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.discountOfferEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, discountOfferEnabled: e.target.checked })
                    }
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer shrink-0"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      ডিসকাউন্ট শতকরা (%)
                    </label>
                    <input
                      type="number"
                      value={settings.discountPercentage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          discountPercentage: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      ন্যূনতম অগ্রিম টাকা (৳)
                    </label>
                    <input
                      type="number"
                      value={settings.minAdvanceAmount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minAdvanceAmount: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery and Package Prices */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-neutral-800">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <h2 className="font-bold text-sm sm:text-base">প্যাকেজ মূল্য ও ডেলিভারি চার্জ</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    সামনের প্লেটের মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.frontPlatePrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        frontPlatePrice: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    পেছনের প্লেটের মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.backPlatePrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        backPlatePrice: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    সামনে + পেছনে কম্বো (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.comboPlatePrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        comboPlatePrice: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    ঢাকার ভিতরে ডেলিভারি চার্জ (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.shippingInsideDhaka}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shippingInsideDhaka: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    ঢাকার বাইরে ডেলিভারি চার্জ (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.shippingOutsideDhaka}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shippingOutsideDhaka: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Announcement Banner & Contacts */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="font-bold text-sm sm:text-base mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-neutral-800">
                হেডার নোটিশ ও কন্টাক্ট ইনফরমেশন
              </h2>

              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    টপ ব্যানার ঘোষণা বার্তা (Announcement Text)
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) =>
                      setSettings({ ...settings, announcementText: e.target.value })
                    }
                    className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      হটলাইন ফোন নম্বর
                    </label>
                    <input
                      type="text"
                      value={settings.hotlinePhone}
                      onChange={(e) =>
                        setSettings({ ...settings, hotlinePhone: e.target.value })
                      }
                      className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      হোয়াটসঅ্যাপ নম্বর (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) =>
                        setSettings({ ...settings, whatsappNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 sm:py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl transition disabled:opacity-50 cursor-pointer text-xs sm:text-sm shadow-md"
            >
              {isUpdating ? "সংরক্ষণ হচ্ছে..." : "সকল পরিবর্তন সংরক্ষণ করুন"}
            </button>
          </form>
        )}

        {/* Tab 3: Analytics Overview */}
        {activeTab === "analytics" && (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="font-bold text-sm sm:text-base mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-neutral-800">
                স্ট্যাটাস ভিত্তিক অর্ডার বিশ্লেষণ
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                {Object.entries(stats.statusCounts).map(([statusKey, count]) => (
                  <div key={statusKey} className="bg-neutral-950 p-3 sm:p-4 rounded-xl border border-neutral-800">
                    <p className="text-[11px] sm:text-xs text-neutral-400 truncate">{statusKey}</p>
                    <p className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="font-bold text-sm sm:text-base mb-3 pb-2.5 border-b border-neutral-800">
                অফিসিয়াল পেমেন্ট ইন্টিগ্রেশন স্ট্যাটাস
              </h2>
              <div className="space-y-2.5 sm:space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-neutral-950 rounded-xl border border-neutral-800 gap-2">
                  <span className="font-semibold text-neutral-300">ক্যাশ অন ডেলিভারি (COD):</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] sm:text-xs shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> সক্রিয় ও পরীক্ষিত
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-neutral-950 rounded-xl border border-neutral-800 gap-2">
                  <span className="font-semibold text-neutral-300">bKash Merchant PGW:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] sm:text-xs shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> টোকেনাইজড ইঞ্জিন সংযুক্ত
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-neutral-950 rounded-xl border border-neutral-800 gap-2">
                  <span className="font-semibold text-neutral-300">অগ্রিম ৩০% ছাড় ভ্যালিডেশন:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] sm:text-xs shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> সার্ভার-সাইড নিশ্চিত
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-white">অর্ডার বিবরণী</h3>
                  <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    <span className="font-mono text-xs text-amber-400 font-bold">{selectedOrder.orderNumber}</span>
                    <CopyButton text={selectedOrder.orderNumber} id={`modal-order-${selectedOrder.id}`} />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Action: Copy for Courier Booking (Steadfast, Pathao, RedX) */}
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `অর্ডার নং: ${selectedOrder.orderNumber}\nগ্রাহকের নাম: ${selectedOrder.customerName}\nমোবাইল নম্বর: ${selectedOrder.customerPhone}\nডেলিভারি ঠিকানা: ${selectedOrder.deliveryAddress}, ${selectedOrder.district}\nপ্লেটের লেখা: ${selectedOrder.items[0]?.customDetails.fullPlateText || ""}\nক্যাশ অন ডেলিভারি (COD): ৳${selectedOrder.remainingCodAmount}`,
                    `modal-courier-${selectedOrder.id}`
                  )
                }
                className="w-full bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2 border border-emerald-600/40 cursor-pointer shadow-xs"
              >
                {copiedField === `modal-courier-${selectedOrder.id}` ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span className="text-emerald-200">কুরিয়ার বুকিং টেক্সট কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>📦 কুরিয়ার পার্সেল বুকিংয়ের জন্য সমস্ত তথ্য এক ক্লিকে কপি করুন</span>
                  </>
                )}
              </button>

              {/* Order Info Cards */}
              <div className="space-y-3 text-xs">
                {/* Customer Details */}
                <div className="bg-neutral-950 p-3 sm:p-4 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-neutral-400 text-[11px] font-semibold">গ্রাহকের তথ্য</p>
                    <CopyButton
                      text={`${selectedOrder.customerName}\n${selectedOrder.customerPhone}\n${selectedOrder.deliveryAddress}, ${selectedOrder.district}`}
                      id={`modal-cust-all-${selectedOrder.id}`}
                      label="সব তথ্য কপি"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-neutral-900 pt-1.5">
                    <span className="text-neutral-400">নাম:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">{selectedOrder.customerName}</span>
                      <CopyButton text={selectedOrder.customerName} id={`modal-name-${selectedOrder.id}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">মোবাইল:</span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${selectedOrder.customerPhone}`}
                        className="font-mono text-amber-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{selectedOrder.customerPhone}</span>
                      </a>
                      <CopyButton text={selectedOrder.customerPhone} id={`modal-phone-${selectedOrder.id}`} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-neutral-400 shrink-0">ঠিকানা:</span>
                    <div className="flex items-start gap-1.5 text-right">
                      <span className="text-neutral-300">{selectedOrder.deliveryAddress}, {selectedOrder.district}</span>
                      <CopyButton
                        text={`${selectedOrder.deliveryAddress}, ${selectedOrder.district}`}
                        id={`modal-addr-${selectedOrder.id}`}
                      />
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div className="pt-1 border-t border-neutral-900 text-amber-200/90 italic">
                      নোট: {selectedOrder.notes}
                    </div>
                  )}
                </div>

                {/* Plate Details */}
                <div className="bg-neutral-950 p-3 sm:p-4 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-neutral-400 text-[11px] font-semibold">কাস্টমাইজড প্লেটের লেখা</p>
                    {selectedOrder.items[0]?.customDetails.fullPlateText && (
                      <CopyButton
                        text={selectedOrder.items[0].customDetails.fullPlateText}
                        id={`modal-plate-${selectedOrder.id}`}
                        label="প্লেট কপি"
                      />
                    )}
                  </div>
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800 text-center">
                    <p className="text-base sm:text-lg font-bold text-amber-400 font-mono">
                      {selectedOrder.items[0]?.customDetails.fullPlateText || "N/A"}
                    </p>
                    <p className="text-neutral-400 mt-1 text-[11px]">
                      প্যাকেজ: {selectedOrder.items[0]?.name}
                    </p>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="bg-neutral-950 p-3 sm:p-4 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">মূল প্রোডাক্ট মূল্য:</span>
                    <span className="font-mono text-white">৳ {selectedOrder.originalSubtotal}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>৩০% ছাড়:</span>
                      <span className="font-mono">- ৳ {selectedOrder.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">ডেলিভারি চার্জ:</span>
                    <span className="font-mono text-white">৳ {selectedOrder.shippingCharge}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-neutral-800 text-sm">
                    <span className="text-white">সর্বমোট প্রদেয়:</span>
                    <span className="font-mono text-amber-400">৳ {selectedOrder.totalPayable}</span>
                  </div>
                  <div className="flex justify-between text-pink-400 font-semibold">
                    <span>বিকাশ অগ্রিম প্রাপ্ত:</span>
                    <span className="font-mono">৳ {selectedOrder.advanceAmount}</span>
                  </div>
                  <div className="flex justify-between text-amber-400 font-bold bg-amber-500/10 p-2 rounded-lg items-center">
                    <span>ডেলিভারির সময় প্রদেয় (COD বাকি):</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-base">৳ {selectedOrder.remainingCodAmount}</span>
                      <CopyButton
                        text={String(selectedOrder.remainingCodAmount)}
                        id={`modal-cod-${selectedOrder.id}`}
                      />
                    </div>
                  </div>
                </div>

                {selectedOrder.bkashTrxId && (
                  <div className="bg-pink-950/30 border border-pink-900/40 p-2.5 sm:p-3 rounded-xl text-pink-300 font-mono text-[11px] sm:text-xs flex items-center justify-between">
                    <span>bKash TrxID: {selectedOrder.bkashTrxId}</span>
                    <CopyButton text={selectedOrder.bkashTrxId} id={`modal-trx-${selectedOrder.id}`} />
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

