"use client";
import { useSearchParams } from "next/navigation";
import CategoryMenu from "../category-menu";
import Location from "../location";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");
  const location = searchParams.get("location");

  return (
    <div>
      <div className="flex">
        <div className="flex min-w-[250px]">
          <div className="flex-1">
            <CategoryMenu />
            <Location location={location} />
          </div>
        </div>
        <div className="flex-1 ">
          <p>{search}</p>
        </div>
      </div>
    </div>
  );
}
