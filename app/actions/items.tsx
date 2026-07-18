"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { redirect } from "next/navigation";

export async function saveItem(formData: FormData) {
  let name = formData.get("name");
  let qty = formData.get("qty");
  let unit = formData.get("unit");
  let note = formData.get("note");
  let location = formData.get("location");

  if (!name || !qty || !unit || !note || !location)
    redirect("/?item_save_status=error&error=all_fields_must_be_filled");

  let itemInDatabase = await prisma.item.findFirst({
    where: { name: name.toString() },
    include: { itemDetails: true },
  });

  if (itemInDatabase !== null) {
    let updateItemPromise = prisma.item.update({
      where: { id: itemInDatabase.id },
      data: {
        qty: itemInDatabase.qty + Number.parseInt(qty.toString()),
      },
    });

    let createItemDetailPromise = prisma.itemDetail.create({
      data: {
        item_id: itemInDatabase.id,
        note: note.toString(),
        location: location.toString(),
      },
    });

    Promise.all([updateItemPromise, createItemDetailPromise]);
  } else {
    await prisma.item.create({
      data: {
        name: name.toString(),
        qty: Number.parseInt(qty.toString()),
        unit: unit.toString(),
        itemDetails: {
          create: {
            note: note.toString(),
            location: location.toString(),
          },
        },
      },
    });
  }

  revalidatePath("/");
  redirect("/?item_save_status=success");
}
