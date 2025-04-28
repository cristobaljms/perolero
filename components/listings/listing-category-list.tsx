"use client";
import { useParams } from "next/navigation";

export default function ListingCategoryList() {
  const { category } = useParams();
  return <div>ListingCategoryList: {category}</div>;
}
