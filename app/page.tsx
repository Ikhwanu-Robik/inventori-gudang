"use client";

import Image from "next/image";
import { saveItem } from "./actions/items";
import { useSearchParams } from "next/navigation";

export default function ItemInForm() {
  let searchParams = useSearchParams();

  return (
    <div className="pb-20 pt-4 flex flex-col items-center gap-4">
      <div
        className={
          "rounded p-4 flex items-center justify-center rounded " +
          (searchParams.get("item_save_status") == "error"
            ? "bg-red-600"
            : " ") +
          " " +
          (searchParams.get("item_save_status") == "success"
            ? "bg-green-600"
            : " ") +
          " " +
          (!searchParams.has("item_save_status") ? "hidden" : "static")
        }
      >
        {searchParams.get("item_save_status") == "error" &&
          searchParams.get("error")}
        {searchParams.get("item_save_status") == "success" &&
          "Item berhasil disimpan"}
      </div>

      <h1 className="self-start pl-8 text-bolder text-[25px]">
        Form Barang Masuk
      </h1>
      <form action={saveItem} className="px-4 flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="name">Nama Barang</label>
          <input
            type="text"
            id="name"
            name="name"
            className="rounded bg-zinc-800"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="qty">Jumlah</label>
          <input
            type="number"
            id="qty"
            name="qty"
            min={1}
            defaultValue={1}
            className="rounded bg-zinc-800"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="unit">Satuan</label>
          <input
            type="text"
            id="unit"
            name="unit"
            className="rounded bg-zinc-800"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="note">Catatan</label>
          <textarea
            id="note"
            name="note"
            rows={4}
            className="rounded bg-zinc-800"
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label htmlFor="location" className="flex flex-col">
            <span>Lokasi Barang</span>
            <span className="text-[10px]">(klik pada denah)</span>
          </label>
          <input type="hidden" id="location" name="location" />

          <div className="relative">
            <Image
              src="/denah-gudang-selatan.svg"
              alt="denah-gudang-selatan"
              id="map"
              width={756}
              height={411}
              onClick={(e) => {
                let map = document.getElementById("map");
                if (!map) return;

                let rect = map.getBoundingClientRect();
                let marker = document.getElementById("marker");
                if (!marker) return;

                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;

                let xPercent = (x / rect.width) * 100;
                let yPercent = (y / rect.height) * 100;

                let locationInput = document.getElementById(
                  "location"
                ) as HTMLInputElement;
                if (!locationInput) return;
                locationInput.value = JSON.stringify({
                  xPercent: xPercent,
                  yPercent: yPercent,
                });

                marker.style.top = `${yPercent}%`;
                marker.style.left = `${xPercent}%`;

                marker.classList.remove("hidden");
              }}
            ></Image>
            <div
              id="marker"
              className="absolute w-2 h-2 bg-red-600 -translate-x-1/2 -translate-y-1/2 hidden"
            ></div>
          </div>
        </div>

        <button className="bg-zinc-600 rounded px-4 py-2 mt-4">Simpan</button>
      </form>
    </div>
  );
}
