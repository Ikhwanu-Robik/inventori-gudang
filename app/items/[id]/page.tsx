import { prisma } from "@/app/lib/prisma";
import Image from "next/image";
import ItemDetails from "@/app/components/ItemDetails";

export default async function ItemInfo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let { id } = await params;
  let item = await prisma.item.findFirst({
    where: {
      id: Number.parseInt(id),
    },
    include: {
      itemDetails: true,
    },
  });

  if (!item) throw Error;

  return (
    <div className="flex flex-col gap-4 pb-20">
      <Image
        src="/chair.png"
        alt="placeholder-item-image"
        width="200"
        height="200"
        className="text-gray-600 w-full"
      ></Image>

      <div className="px-4 text-sm">
        <h1 className="text-bolder text-xl">{item?.name}</h1>
        <span>
          Jumlah tersedia: {item?.qty} {item?.unit}
        </span>
        <ItemDetails itemDetails={item.itemDetails}></ItemDetails>
      </div>
    </div>
  );
}
