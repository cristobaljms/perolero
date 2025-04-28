import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  IconHome,
  IconCar,
  IconBriefcase,
  IconBabyCarriage,
  IconBarbell,
  IconDevices,
  IconMovie,
  IconToolsKitchen3,
  IconHanger,
  IconTool,
  IconDeviceDesktop,
} from "@tabler/icons-react";

export default async function Categories() {

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold my-10">Todas las categorías</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <Link href={`/inmuebles`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconHome className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Inmuebles
              </CardTitle>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/vehiculos`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconCar className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Vehículos
              </CardTitle>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/empleo`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconBriefcase className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Empleo
              </CardTitle>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/c/hogar`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconToolsKitchen3 className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Hogar
              </CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/c/bebes-y-ninos`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconBabyCarriage className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Bebés y Niños
              </CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/c/moda-y-belleza`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconHanger className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Moda y Belleza
              </CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/c/deportes-y-fitness`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconBarbell className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Deportes y Fitness
              </CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/c/electronica`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconDevices className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Electrónica
              </CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/c/servicios`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconDeviceDesktop className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Servicios
              </CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/c/entretenimiento`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconMovie className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Entretenimiento
              </CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/c/repuestos`} className="block w-full h-full">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                <IconTool className="w-full h-full" />
              </div>
              <CardTitle className="text-center text-lg font-bold">
                Repuestos
              </CardTitle>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
