import { prisma } from "../lib/prisma";
import Item from "../components/Item";

export default async function ItemList() {
  let items = await prisma.item.findMany({
    select: { id: true, name: true, qty: true, unit: true },
  });

  return (
    <div className="pb-20 pt-4 flex flex-col items-center gap-4">
      <h1 className="self-start pl-8 text-bolder text-[25px]">Daftar Barang</h1>
      <div className="flex flex-wrap max-w-content gap-2 justify-center">
        {items.map((item) => {
          return <Item key={item.id} item={item}></Item>;
        })}
      </div>
    </div>
  );
}
