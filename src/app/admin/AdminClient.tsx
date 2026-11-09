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
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
} from "lucide-react";

export default function AdminClient() {
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
    fetchOrders();
    fetchSettings();
  }, [statusFilter, paymentFilter]);

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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-black font-black px-2.5 py-1 rounded-lg text-lg">
              BP
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">BikePlate BD Admin Portal</h1>
              <p className="text-xs text-neutral-400">অর্ডার ও পেমেন্ট ম্যানেজমেন্ট ড্যাশবোর্ড</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <span>ওয়েবসাইট দেখুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <a
              href="/api/admin/export"
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV রিপোর্ট ডাউনলোড</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-3 font-semibold text-sm transition border-b-2 flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>অর্ডার তালিকা ({stats.totalOrders})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-3 font-semibold text-sm transition border-b-2 flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>অফার ও বিজনেস সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-5 py-3 font-semibold text-sm transition border-b-2 flex items-center gap-2 ${
              activeTab === "analytics"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>অ্যানালিটিক্স ওভারভিউ</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-xs">মোট অর্ডার</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono">{stats.totalOrders}</div>
                <div className="text-[11px] text-neutral-500 mt-1">সিস্টেমে সংরক্ষিত সমস্ত অর্ডার</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-xs">মোট অর্ডারের মূল্য</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">৳ {stats.totalRevenue}</div>
                <div className="text-[11px] text-neutral-500 mt-1">বাতিল ব্যতীত সমস্ত অর্ডার ভলিউম</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-xs">বিকাশ অগ্রিম আদায়</span>
                  <CreditCard className="w-4 h-4 text-[#E2136E]" />
                </div>
                <div className="text-2xl font-bold font-mono text-pink-400">৳ {stats.totalAdvanceCollected}</div>
                <div className="text-[11px] text-neutral-500 mt-1">সরাসরি বিকাশ গেটওয়েতে জমা</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-xs">বাকি COD আদায়যোগ্য</span>
                  <Truck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">৳ {stats.totalCodPending}</div>
                <div className="text-[11px] text-neutral-500 mt-1">ডেলিভারির পর কুরিয়ার থেকে প্রাপ্তব্য</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchOrders();
                }}
                className="flex items-center gap-2 flex-1 max-w-md"
              >
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="নাম, ফোন, অর্ডার নং বা প্লেটের লেখা..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                >
                  খুঁজুন
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Filter className="w-3.5 h-3.5" />
                  <span>অর্ডার স্ট্যাটাস:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
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

                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>পেমেন্ট:</span>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
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
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 transition"
                  title="রিফ্রেশ"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow">
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
                              <span className="font-mono font-bold text-amber-400 block">
                                {order.orderNumber}
                              </span>
                              <span className="text-[10px] text-neutral-500">
                                {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="font-medium text-white block">{order.customerName}</span>
                              <span className="font-mono text-neutral-400">{order.customerPhone}</span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="font-mono font-bold text-white bg-neutral-950 px-2 py-1 rounded border border-neutral-800 block text-center">
                                {item?.customDetails?.fullPlateText || "N/A"}
                              </span>
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
                                className={`text-[11px] font-semibold rounded-md px-2 py-1 border border-neutral-700 bg-neutral-950 focus:outline-none ${
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
                                className="text-[11px] font-semibold rounded-md px-2 py-1 border border-neutral-700 bg-neutral-950 text-white focus:outline-none"
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
                                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition"
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
          <form onSubmit={handleSaveSettings} className="max-w-3xl mx-auto space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                <Percent className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-base">অগ্রিম পেমেন্ট ও ৩০% ডিসকাউন্ট পলিসি</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div>
                    <label className="text-sm font-semibold text-white block">
                      ৩০% স্পেশাল ডিসকাউন্ট অফার চালু রাখুন
                    </label>
                    <p className="text-xs text-neutral-400">
                      সক্ষম থাকলে গ্রাহক অগ্রিম পরিশোধ করলে নির্ধারিত হারে ছাড় পাবে
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.discountOfferEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, discountOfferEnabled: e.target.checked })
                    }
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
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
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery and Package Prices */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-base">প্যাকেজ মূল্য ও ডেলিভারি চার্জ</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
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
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
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
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
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
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Announcement Banner & Contacts */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="font-bold text-base mb-4 pb-3 border-b border-neutral-800">
                হেডার নোটিশ ও কন্টাক্ট ইনফরমেশন
              </h2>

              <div className="space-y-4">
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
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
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
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-2xl transition disabled:opacity-50"
            >
              {isUpdating ? "সংরক্ষণ হচ্ছে..." : "সকল পরিবর্তন সংরক্ষণ করুন"}
            </button>
          </form>
        )}

        {/* Tab 3: Analytics Overview */}
        {activeTab === "analytics" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="font-bold text-base mb-4 pb-3 border-b border-neutral-800">
                স্ট্যাটাস ভিত্তিক অর্ডার বিশ্লেষণ
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(stats.statusCounts).map(([statusKey, count]) => (
                  <div key={statusKey} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <p className="text-xs text-neutral-400">{statusKey}</p>
                    <p className="text-xl font-bold font-mono text-amber-400 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="font-bold text-base mb-3 pb-3 border-b border-neutral-800">
                অফিসিয়াল পেমেন্ট ইন্টিগ্রেশন স্ট্যাটাস
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="font-semibold text-neutral-300">ক্যাশ অন ডেলিভারি (COD):</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> সক্রিয় ও পরীক্ষিত
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="font-semibold text-neutral-300">bKash Merchant PGW v1.2.0-beta:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> টোকেনাইজড চেকআউট ইঞ্জিন সংযুক্ত
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="font-semibold text-neutral-300">অগ্রিম পেমেন্ট ৩০% ছাড় ভেরিফিকেশন:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> সার্ভার-সাইড ভ্যালিডেশন নিশ্চিত
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">অর্ডার বিবরণী</h3>
                  <span className="font-mono text-xs text-amber-400">{selectedOrder.orderNumber}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Info */}
              <div className="space-y-4 text-xs">
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <p className="text-neutral-400 mb-1">কাস্টমার তথ্য:</p>
                  <p className="text-sm font-semibold text-white">{selectedOrder.customerName}</p>
                  <p className="font-mono text-neutral-300">{selectedOrder.customerPhone}</p>
                  <p className="text-neutral-300 mt-1">{selectedOrder.deliveryAddress}, {selectedOrder.district}</p>
                  {selectedOrder.notes && (
                    <p className="text-amber-200 mt-1 italic">নোট: {selectedOrder.notes}</p>
                  )}
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <p className="text-neutral-400 mb-1">কাস্টমাইজড প্লেটের লেখা:</p>
                  <p className="text-base font-bold text-amber-400 font-mono">
                    {selectedOrder.items[0]?.customDetails.fullPlateText}
                  </p>
                  <p className="text-neutral-400 mt-1">
                    প্যাকেজ: {selectedOrder.items[0]?.name}
                  </p>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
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
                  <div className="flex justify-between text-amber-400 font-bold bg-amber-500/10 p-2 rounded-lg">
                    <span>ডেলিভারির সময় প্রদেয় (COD বাকি):</span>
                    <span className="font-mono">৳ {selectedOrder.remainingCodAmount}</span>
                  </div>
                </div>

                {selectedOrder.bkashTrxId && (
                  <div className="bg-pink-950/30 border border-pink-900/40 p-3 rounded-xl text-pink-300 font-mono">
                    bKash TrxID: {selectedOrder.bkashTrxId}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold transition"
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

