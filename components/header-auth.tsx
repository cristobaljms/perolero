"use client";
import { signOutAction } from "@/app/actions/auth-actions";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/perfil">Perfil</Link>
      </Button>

      <Button asChild size="sm" variant={"default"}>
        <Link href="/publicar">+ Publicar</Link>
      </Button>

      {/* <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Cerrar sesión
        </Button>
      </form> */}
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Iniciar sesión</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Registrarse</Link>
      </Button>
    </div>
  );
}
