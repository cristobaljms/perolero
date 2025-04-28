import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfilePanel from "./profile-panel";
import TopBanner from "@/components/banners/top-banner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <TopBanner />
      <Card className="flex gap-5 items-start p-5 bg-white mb-5">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.user_metadata.avatar_url} sizes="100%" />
          <AvatarFallback>{user.user_metadata.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1 mt-2">
          <h2 className="text-xl font-semibold">{user.user_metadata.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>

          {(() => {
            const createdAt = new Date(user.created_at);
            const now = new Date();
            const diffMonths =
              (now.getFullYear() - createdAt.getFullYear()) * 12 +
              (now.getMonth() - createdAt.getMonth());

            let timeText = "";
            if (diffMonths < 1) {
              timeText = "Menos de un mes";
            } else if (diffMonths < 12) {
              timeText = `${diffMonths} ${diffMonths === 1 ? "mes" : "meses"}`;
            } else {
              const years = Math.floor(diffMonths / 12);
              const remainingMonths = diffMonths % 12;
              timeText = `${years} ${years === 1 ? "año" : "años"}`;
              if (remainingMonths > 0) {
                timeText += ` y ${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`;
              }
            }

            return (
              <p className="text-sm text-muted-foreground">
                Miembro desde hace {timeText}
              </p>
            );
          })()}

          {!user.email_confirmed_at && (
            <div className="mt-1 px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-md inline-block">
              Correo no confirmado
            </div>
          )}
        </div>
      </Card>
      <ProfilePanel user_id={user.id} />

      <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto mt-4">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
