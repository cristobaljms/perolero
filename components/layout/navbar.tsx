"use client";
import Image from "next/image";
import Link from "next/link";
import logoLight from "@/assets/logo-light.png";
import { Input } from "../ui/input";
import HeaderAuth from "../header-auth";
import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitSearch();
    }
  };

  const handleSubmitSearch = () => {
    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      window.location.href = `/buscar?q=${encodeURIComponent(trimmedSearch)}`;
    }
  };

  return (
    <nav className="w-full flex flex-col items-center bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="w-full max-w-5xl flex gap-2 justify-between items-center p-3 text-sm">
        <div className="flex items-center font-semibold text-white text-2xl">
          <Link href={"/"}>
            <Image src={logoLight} alt="Logo" width={100} height={100} />
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 justify-center">
          <Input
            type="search"
            placeholder="Buscar..."
            className="max-w-lg h-11"
            value={search}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
          />
        </div>
        <HeaderAuth />
      </div>
      <div className="lg:hidden w-full p-3 pt-0">
        <Input
          type="search"
          placeholder="Buscar..."
          className="h-11"
          value={search}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
    </nav>
  );
}
