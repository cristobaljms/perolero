import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IconHomeFilled, IconCarFilled, IconBriefcaseFilled, IconShoppingCartFilled } from "@tabler/icons-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default async function NewListingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="relative">
      <div className="w-full flex flex-col items-center justify-center z-10 relative top-16">
        <h2 className="text-xl font-semibold mb-10">
          ¡Hola! Para empezar, ¿que tipo de publicación quieres hacer?
        </h2>
        <div className="max-w-5xl w-full grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          <Link href={`/publicar/inmueble`}>
            <Card className="cursor-pointer hover:shadow-md transition-all duration-300 w-[180px] md:w-[200px]">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                  <IconHomeFilled className="w-full h-full" />
                </div>
                <CardTitle className="text-center text-xl font-semibold">
                  Inmueble
                </CardTitle>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/publicar/vehiculo`}>
          <Card className="cursor-pointer hover:shadow-md transition-all duration-300 w-[180px] md:w-[200px]">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                  <IconCarFilled className="w-full h-full" />
                </div>
                <CardTitle className="text-center text-xl font-semibold">
                  Vehículo
                </CardTitle>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/publicar/empleo`}>
            <Card className="cursor-pointer hover:shadow-md transition-all duration-300 w-[180px] md:w-[200px]">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                  <IconBriefcaseFilled className="w-full h-full" />
                </div>
                <CardTitle className="text-center text-xl font-semibold">
                  Empleo
                </CardTitle>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/publicar/producto-servicio`}>
            <Card className="cursor-pointer hover:shadow-md transition-all duration-300 w-[180px] md:w-[200px]">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] flex items-center justify-center mb-4 hover:scale-105 transition-all duration-300">
                  <IconShoppingCartFilled className="w-full h-full" />
                </div>
                <CardTitle className="text-center text-xl font-semibold">
                  Producto
                </CardTitle>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
