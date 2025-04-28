import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  IconHome,
  IconCar,
  IconBriefcase,
  IconToolsKitchen3,
  IconDevices,
} from "@tabler/icons-react";

export default async function MostPopularCategories() {
  return (
    <div className="w-full mb-10">
      <h2 className="text-2xl font-bold mb-5 flex items-center">
        Categorías más populares
        <Link
          href="/categorias"
          className="ml-4 text-sm text-muted-foreground border border-muted-foreground rounded-md px-2 py-1"
        >
          Ver todas
        </Link>
      </h2>
      <div className="max-w-5xl w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
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
      </div>
    </div>
  );
}
