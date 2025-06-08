import { useState } from "react";
import { getCities, getStates } from "@/services/client";
import { useQuery } from "@tanstack/react-query";

export default function useLocation() {
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const statesQuery = useQuery({
    queryKey: ["states"],
    queryFn: () => getStates(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const citiesQuery = useQuery({
    queryKey: ["cities", selectedState],
    queryFn: () => getCities(selectedState!),
    enabled: !!selectedState,
    staleTime: 60 * 60 * 1000,
  });

  const states = statesQuery.data;
  const cities = citiesQuery.data;

  return {
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    states,
    cities,
  };
}
