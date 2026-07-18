"use client";

import Image from "next/image";

export default function ItemDetails({
  itemDetails,
}: {
  itemDetails: { id: number; note: string; location: string }[];
}) {
  return (
    <>
      <div>
        <span>Catatan:</span>
        <ul className="flex flex-col items-start">
          {itemDetails.map((itemDetail) => {
            return (
              <li key={itemDetail.id}>
                <button
                  id={`itemnote-${itemDetail.id}`}
                  className="w-content px-2 text-gray-800"
                  onClick={(e) => {
                    let target = e.target as HTMLElement;
                    target.classList.add("text-white");

                    let marker = document.getElementById(
                      `itemmarker-${itemDetail.id}`
                    );
                    marker?.classList.add("w-4");
                    marker?.classList.add("h-4");
                  }}
                  onBlur={(e) => {
                    let target = e.target as HTMLElement;
                    target.classList.remove("text-white");

                    let marker = document.getElementById(
                      `itemmarker-${itemDetail.id}`
                    );
                    marker?.classList.remove("w-4");
                    marker?.classList.remove("h-4");
                  }}
                >
                  {itemDetail.note}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <span>Lokasi</span>
        <div className="relative">
          <Image
            src="/denah-gudang-selatan.svg"
            alt="denah-gudang-selatan"
            id="map"
            width={756}
            height={411}
          ></Image>
          {itemDetails.map((itemDetail) => {
            return (
              <div
                key={itemDetail.id}
                id={`itemmarker-${itemDetail.id}`}
                className="absolute w-2 h-2 bg-red-600   -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: `${JSON.parse(itemDetail.location).yPercent}%`,
                  left: `${JSON.parse(itemDetail.location).xPercent}%`,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </>
  );
}
