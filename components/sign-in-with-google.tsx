'use client';

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { signInWithGoogle } from "../app/actions/auth-actions";

export default function SignInWithGoogle() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={() => startTransition(() => signInWithGoogle())}
      disabled={isPending}
    >
      {isPending ? "Conectando..." : "Iniciar sesión con Google"}
    </Button>
  );
}
