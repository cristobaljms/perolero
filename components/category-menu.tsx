"use client"
import { getAllCategories } from "@/services/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

interface GroupedCategory {
  id: number;
  name: string;
  parent_id: null;
  tag: string;
  subcategories: Array<{
    id: number;
    name: string;
    parent_id: number;
    tag: string;
  }>;
}

export default function CategoryMenu() {
  const [groupedCategories, setGroupedCategories] = useState<Record<string, GroupedCategory>>({});
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (categories) {
      const grouped = categories.reduce((acc, category) => {
        if (category.parent_id === null) {
          // It's a main category
          acc[category.id] = {
            ...category,
            subcategories: []
          };
        } else {
          // It's a subcategory
          if (!acc[category.parent_id]) {
            acc[category.parent_id] = {
              subcategories: []
            };
          }
          acc[category.parent_id].subcategories.push(category);
        }
        return acc;
      }, {} as Record<string, GroupedCategory>);
      
      setGroupedCategories(grouped);
    }
  }, [categories]);

  const toggleCategory = (id: number) => {
    setOpenCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-100">Categories</h2>
      <div className="p-2">
        {Object.values(groupedCategories).map((category) => (
          <div key={category.id} className="mb-1">
            <div 
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
              onClick={() => toggleCategory(category.id)}
            >
              <Link 
                href={`/c/${category.tag}`} 
                className="text-gray-700 hover:text-blue-600 font-medium flex-grow"
                onClick={(e) => e.stopPropagation()}
              >
                {category.name}
              </Link>
              {category.subcategories && category.subcategories.length > 0 && (
                <span className="text-gray-400">
                  {openCategories[category.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </span>
              )}
            </div>
            
            {category.subcategories && category.subcategories.length > 0 && openCategories[category.id] && (
              <div className="pl-4 mt-1 border-l-2 border-gray-100 ml-2">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="py-1 px-2">
                    <Link 
                      href={`/c/${subcategory.tag}`}
                      className="text-gray-600 hover:text-blue-600 text-sm block"
                    >
                      {subcategory.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
