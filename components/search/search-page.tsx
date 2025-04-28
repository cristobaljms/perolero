"use client";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");

  return (
    <div>
      <h1>BuscarPage</h1>
      <p>{search}</p>
    </div>
  );
}
