"use client";
import { CATEGORIES_MAP } from "@/utils/constants";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("category", category);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-100">
        Categorías
      </h2>
      <div className="p-2">
        {CATEGORIES_MAP.map((category) => {
          const isActive = activeCategory === category.tag;
          return (
            <div key={category.id} className="mb-1">
              <div className={`p-2 rounded ${isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                <div
                  onClick={() => handleCategoryClick(category.tag)}
                  className={`font-medium block cursor-pointer ${
                    isActive 
                      ? 'text-blue-700' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {category.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
