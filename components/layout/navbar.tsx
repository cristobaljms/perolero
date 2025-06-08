"use client";
import Image from "next/image";
import Link from "next/link";
import logoLight from "@/assets/logo-light.png";
import HeaderAuth from "../header-auth";
import SearchAutocomplete from "../search-autocomplete";

export default function Navbar() {
  return (
    <nav className="w-full flex flex-col items-center bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="w-full max-w-5xl flex gap-2 justify-between items-center p-3 text-sm">
        <div className="flex items-center font-semibold text-white text-2xl">
          <Link href={"/"}>
            <Image src={logoLight} alt="Logo" width={100} height={100} />
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 justify-center max-w-lg">
          <SearchAutocomplete />
        </div>
        <HeaderAuth />
      </div>
      <div className="lg:hidden w-full p-3 pt-0">
        <SearchAutocomplete />
      </div>
    </nav>
  );
}
