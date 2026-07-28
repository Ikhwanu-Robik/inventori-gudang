"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveItemMutasi } from "@/app/actions/inventory";
import {
  generateNextSku,
  getActiveCategories,
  getActiveWarehousesWithGrids,
} from "@/app/actions/sku";
import {
  ArrowLeft,
  Save,
  Loader2,
  Sparkles,
  MapPin,
  AlertCircle,
  ArrowRightLeft,
  ArrowDown,
  ArrowUp,
  Building2,
} from "lucide-react";
import Link from "next/link";

type WarehouseData = {
  id: number;
  name: string;
  rows: number;
  cols: number;
  grids: Array<{
    id: number;
    code: string;
    row?: number | null;
    col?: number | null;
    isActive: boolean;
  }>;
};

export default function NewItemPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"IN" | "OUT" | "TRANSFER">("IN");
  const [error, setError] = useState<string | null>(null);

  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);

  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [selectedDestLoc, setSelectedDestLoc] = useState<string | null>(null);
  const [pickingTarget, setPickingTarget] = useState<"source" | "dest">("source");

  const [skuMode, setSkuMode] = useState<"auto" | "manual">("auto");
  const [categories, setCategories] = useState<Array<{ code: string; name: string }>>([]);
  const [category, setCategory] = useState<string>("");
  const [generatedSku, setGeneratedSku] = useState("");
  const [isLoadingSku, setIsLoadingSku] = useState(false);

  useEffect(() => {
    getActiveCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setCategory(cats[0].code);
      }
    });

    getActiveWarehousesWithGrids().then((whs) => {
      setWarehouses(whs);
      if (whs.length > 0) {
        setSelectedWarehouseId(whs[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (skuMode === "auto" && activeTab === "IN" && category) {
      let active = true;
      const fetchSku = async () => {
        setIsLoadingSku(true);
        try {
          const nextSku = await generateNextSku(category);
          if (active) {
            setGeneratedSku(nextSku);
          }
        } catch {
          if (active) {
            setGeneratedSku(`${category}-001`);
          }
        } finally {
          if (active) {
            setIsLoadingSku(false);
          }
        }
      };
      fetchSku();
      return () => {
        active = false;
      };
    }
  }, [category, skuMode, activeTab]);

  const currentWarehouse =
    warehouses.find((w) => w.id === selectedWarehouseId) ?? warehouses[0];

  const handleGridClick = (code: string, isActive: boolean) => {
    if (!isActive) return;

    if (activeTab === "TRANSFER") {
      if (pickingTarget === "source") {
        setSelectedLoc(code);
        setPickingTarget("dest");
      } else {
        setSelectedDestLoc(code);
        setPickingTarget("source");
      }
    } else {
      setSelectedLoc(code);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!selectedLoc) {
      setError("Pilih Gudang dan Grid asal / lokasi penyimpanan terlebih dahulu.");
      return;
    }
    if (activeTab === "TRANSFER" && !selectedDestLoc) {
      setError("Pilih Grid tujuan pemindahan barang.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set("type", activeTab);
    formData.set("location", selectedLoc);
    if (activeTab === "TRANSFER" && selectedDestLoc) {
      formData.set("destLocation", selectedDestLoc);
    }
    startTransition(async () => {
      const res = await saveItemMutasi(formData);
      if (res.success) router.push("/");
      else setError(res.error ?? "Terjadi kesalahan sistem");
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 transition-all shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Transaksi Mutasi Gudang & Grid
          </h1>
          <p className="text-xs text-zinc-400">
            Pencatatan barang masuk, keluar, atau pindah grid antar-gudang secara real-time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-md w-full shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveTab("IN");
            setError(null);
          }}
          className={
            "py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 " +
            (activeTab === "IN"
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-200")
          }
        >
          <ArrowDown className="h-3.5 w-3.5" /> Barang Masuk
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("OUT");
            setError(null);
          }}
          className={
            "py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 " +
            (activeTab === "OUT"
              ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-200")
          }
        >
          <ArrowUp className="h-3.5 w-3.5" /> Barang Keluar
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("TRANSFER");
            setError(null);
          }}
          className={
            "py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 " +
            (activeTab === "TRANSFER"
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-200")
          }
        >
          <ArrowRightLeft className="h-3.5 w-3.5" /> Pindah Grid
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/30 rounded-2xl text-rose-400 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Kesalahan Transaksi</span>
            <span className="text-xs leading-relaxed">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col gap-5 shadow-sm text-white"
        >
          <div
            className={
              "flex items-center gap-2 font-semibold text-sm border-b border-zinc-800 pb-3 " +
              (activeTab === "IN"
                ? "text-emerald-400"
                : activeTab === "OUT"
                  ? "text-rose-400"
                  : "text-indigo-400")
            }
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {activeTab === "IN"
                ? "Informasi Barang Masuk"
                : activeTab === "OUT"
                  ? "Informasi Barang Keluar"
                  : "Informasi Pemindahan Grid"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeTab === "IN" ? (
              <>
                <div className="sm:col-span-2 flex items-center gap-4 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="skuModeToggle"
                      value="auto"
                      checked={skuMode === "auto"}
                      onChange={() => setSkuMode("auto")}
                      className="w-4 h-4 text-indigo-500"
                    />
                    <span className="text-xs font-bold text-zinc-300">
                      SKU Otomatis (Recommended)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="skuModeToggle"
                      value="manual"
                      checked={skuMode === "manual"}
                      onChange={() => setSkuMode("manual")}
                      className="w-4 h-4 text-indigo-500"
                    />
                    <span className="text-xs font-bold text-zinc-300">
                      Input Manual
                    </span>
                  </label>
                </div>

                {skuMode === "auto" ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="category" className="text-xs font-semibold text-zinc-400">
                        Kategori Barang
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        disabled={isPending}
                      >
                        {categories.map((cat) => (
                          <option key={cat.code} value={cat.code} className="bg-zinc-900 text-white">
                            {cat.code} - {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="sku" className="text-xs font-semibold text-zinc-400">
                        SKU / Kode Barang
                      </label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={generatedSku}
                        onChange={(e) => setGeneratedSku(e.target.value)}
                        placeholder={isLoadingSku ? "Generating..." : "KRS-001"}
                        className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                        required
                        disabled={isPending || isLoadingSku}
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor="sku" className="text-xs font-semibold text-zinc-400">
                      SKU / Kode Barang
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      placeholder="Contoh: KRS-A12 atau CUSTOM-001"
                      className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                      required
                      disabled={isPending}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sku" className="text-xs font-semibold text-zinc-400">
                  SKU / Kode Barang
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  required
                  placeholder="KRS-A12"
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  disabled={isPending}
                />
              </div>
            )}

            {activeTab === "IN" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold text-zinc-400"
                >
                  Nama Barang
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Kursi Kayu Jati Minimalis"
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="qty"
                className="text-xs font-semibold text-zinc-400"
              >
                Jumlah Mutasi
              </label>
              <input
                type="number"
                id="qty"
                name="qty"
                required
                min="1"
                defaultValue="1"
                className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            {activeTab === "IN" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="unit"
                  className="text-xs font-semibold text-zinc-400"
                >
                  Satuan
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  required
                  placeholder="pcs / unit"
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="note"
              className="text-xs font-semibold text-zinc-400"
            >
              Catatan Transaksi (Opsional)
            </label>
            <textarea
              id="note"
              name="note"
              rows={2}
              placeholder="Detail mutasi / alasan..."
              className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            {activeTab !== "TRANSFER" ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  {activeTab === "IN"
                    ? "Lokasi Grid Penyimpanan"
                    : "Lokasi Grid Asal"}
                </label>
                <div className="px-4 py-3 rounded-xl border border-dashed border-zinc-800 flex items-center justify-between text-sm bg-zinc-950 shadow-sm">
                  <span className="font-medium text-zinc-300">
                    {selectedLoc
                      ? "Grid " + selectedLoc
                      : "Pilih Gudang & Grid di sebelah kanan"}
                  </span>
                  {selectedLoc && (
                    <MapPin className="h-4 w-4 text-indigo-400" />
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPickingTarget("source")}
                  aria-pressed={pickingTarget === "source"}
                  className={
                    "flex flex-col gap-1.5 cursor-pointer p-3 rounded-xl border transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 " +
                    (pickingTarget === "source"
                      ? "border-rose-500 bg-rose-950/20"
                      : "border-zinc-800 bg-zinc-950/40")
                  }
                >
                  <span className="text-[10px] font-semibold text-zinc-400">
                    1. Grid Asal
                  </span>
                  <span className="font-bold text-sm text-zinc-200">
                    {selectedLoc ? "Grid " + selectedLoc : "Pilih Grid Asal"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPickingTarget("dest")}
                  aria-pressed={pickingTarget === "dest"}
                  className={
                    "flex flex-col gap-1.5 cursor-pointer p-3 rounded-xl border transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 " +
                    (pickingTarget === "dest"
                      ? "border-emerald-500 bg-emerald-950/20"
                      : "border-zinc-800 bg-zinc-950/40")
                  }
                >
                  <span className="text-[10px] font-semibold text-zinc-400">
                    2. Grid Tujuan
                  </span>
                  <span className="font-bold text-sm text-zinc-200">
                    {selectedDestLoc
                      ? "Grid " + selectedDestLoc
                      : "Pilih Grid Tujuan"}
                  </span>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={
              "w-full py-3 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 " +
              (activeTab === "IN"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                : activeTab === "OUT"
                  ? "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                  : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700")
            }
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses Mutasi...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Transaksi
              </>
            )}
          </button>
        </form>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col gap-4 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 font-semibold text-sm text-white">
              <Building2 className="h-4 w-4 text-indigo-500" />
              <span>Pilih Gudang & Grid</span>
            </div>
            {activeTab === "TRANSFER" && (
              <span className="text-xs text-indigo-400 font-bold px-2.5 py-0.5 bg-indigo-950/60 border border-indigo-500/30 rounded-full">
                {pickingTarget === "source"
                  ? "Pilih Asal (Merah)"
                  : "Pilih Tujuan (Hijau)"}
              </span>
            )}
          </div>

          {/* Gudang Selection Dropdown / Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {warehouses.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedWarehouseId(w.id)}
                className={
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border " +
                  (w.id === currentWarehouse?.id
                    ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/50"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200")
                }
              >
                {w.name} ({w.rows}x{w.cols})
              </button>
            ))}
          </div>

          {currentWarehouse && (
            <div
              className="grid gap-2 w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 select-none"
              style={{
                gridTemplateColumns: `repeat(${currentWarehouse.cols}, minmax(0, 1fr))`,
              }}
            >
              {currentWarehouse.grids.map((grid) => {
                const isSource = selectedLoc === grid.code;
                const isDest = selectedDestLoc === grid.code;
                const isInactive = !grid.isActive;

                return (
                  <button
                    key={grid.id}
                    type="button"
                    onClick={() => handleGridClick(grid.code, grid.isActive)}
                    disabled={isInactive}
                    className={
                      "py-3 px-2 rounded-lg border text-xs font-mono font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer " +
                      (isInactive
                        ? "bg-zinc-950 text-zinc-700 border-zinc-900 cursor-not-allowed"
                        : isSource
                          ? "bg-rose-600 text-white border-rose-500 shadow-md"
                          : isDest
                            ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                            : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-indigo-500/50 hover:text-white")
                    }
                  >
                    <span>{grid.code}</span>
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            {activeTab === "TRANSFER"
              ? "Pilih gudang, lalu klik Grid untuk menetapkan asal (merah) & tujuan (hijau)"
              : "Pilih gudang, lalu klik Grid lokasi penyimpanan yang diinginkan"}
          </p>
        </div>
      </div>
    </div>
  );
}
