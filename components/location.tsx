"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { getCities, getStates } from "@/services/client/location";
import { useQuery } from "@tanstack/react-query";

interface LocationFormValues {
  state: string;
  city: string;
}

interface LocationProps {
  location: string | null;
}

export default function Location({ location }: LocationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const form = useForm<LocationFormValues>({
    defaultValues: {
      state: "",
      city: "",
    },
  });

  // Procesar el formato "state_id, city_id" cuando el componente se monta
  // Inicializar los valores del formulario cuando se monta el componente
  useEffect(() => {
    if (location) {
      const [stateId, cityId] = location.split(',').map(id => id.trim());
      if (stateId) {
        form.setValue("state", stateId);
      }
      if (cityId) {
        form.setValue("city", cityId);
      }
    }
  }, [location, form]);

  // Efecto para limpiar la ciudad cuando cambia el estado
  useEffect(() => {
    const stateSubscription = form.watch((value, { name }) => {
      if (name === "state") {
        form.setValue("city", "");
        citiesQuery.refetch();
      }
    });
    
    return () => stateSubscription.unsubscribe();
  }, [form]);

  const statesQuery = useQuery({
    queryKey: ["states"],
    queryFn: () => getStates(),
    staleTime: 5 * 60 * 1000
  });

    const citiesQuery = useQuery({
    queryKey: ["cities", form.watch("state")],
    queryFn: () => getCities(Number(form.watch("state").split("-")[0])),
    enabled: !!form.watch("state"),
    staleTime: 60 * 60 * 1000,
  });

  const onSubmit = (data: LocationFormValues) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (data.city) {
      params.set("location", `${data.state},${data.city}`);
    } 
    else if (data.state) {
      params.set("location", `${data.state}`);
    }
    else {
      params.delete("location");
    }
    
    // Actualizar la URL con los nuevos parámetros
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-100">
        Ubicación
      </h2>
      <div className="p-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {statesQuery.isLoading || citiesQuery.isLoading ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-pulse h-5 w-32 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <Button variant="link" className="text-gray-700 hover:text-blue-600 font-medium flex-grow text-md">
                {form.watch("city") 
                  ? `${form.watch("state")?.split("-")[1]} - ${form.watch("city")?.split("-")[1]}`
                  : form.watch("state") 
                    ? `${form.watch("state")?.split("-")[1]}`
                    : "Toda Venezuela"}
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Seleccionar ubicación</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {statesQuery.data?.map((state) => (
                            <SelectItem key={state.id} value={`${state.id}-${state.name}`}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar ciudad" />
                        </SelectTrigger>
                        <SelectContent>
                          {citiesQuery.data?.map((city) => (
                            <SelectItem key={city.id} value={`${city.id}-${city.name}`}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit">Confirmar</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
