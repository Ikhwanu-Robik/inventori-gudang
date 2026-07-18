import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BsFolder2, BsList } from "react-icons/bs";

export const metadata: Metadata = {
  title: "Inventori Gudang",
  description: "Pencatatan barang gudang dengan denah lokasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex flex-col flex-1 items-center justify-start bg-zinc-50 font-sans dark:bg-black">
          {children}
        </div>
        <nav className="bg-zinc-900 p-2 pb-4 flex justify-around text-[10px] gap-4 text-zinc-500 fixed bottom-0 w-screen">
          <Link
            href={"/"}
            className="flex flex-col items-center justify-center"
          >
            <BsFolder2 size={20}></BsFolder2>
            Form Masuk
          </Link>
          <Link
            href={"/items"}
            className="flex flex-col items-center justify-center"
          >
            <BsList size={20}></BsList>
            Daftar Barang
          </Link>
        </nav>
      </body>
    </html>
  );
}
