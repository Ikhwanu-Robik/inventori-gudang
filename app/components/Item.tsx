"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Item({
  item,
}: {
  item: { id: number; name: string; qty: number; unit: string };
}) {
  let router = useRouter();

  return (
    <div
      className="rounded-xl w-2/5 flex flex-col relative"
      id={`item-${item.id}`}
      onClick={(e) => {
        router.push(`/items/${item.id}`);
      }}
    >
      <Image
        src="/chair.png"
        alt="placeholder-item-image"
        width="200"
        height="300"
        className="text-gray-600 rounded-xl"
      ></Image>
      <div className="flex flex-col absolute px-2 bottom-0 bg-gradient-to-t from-black w-full">
        <span className="text-base/4">{item.name}</span>
        <span className="text-xs">
          Stock: {item.qty} {item.unit}
        </span>
      </div>
    </div>
  );
}
