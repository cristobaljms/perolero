"use client";
import { useState } from "react";

import MyListings from "./my-listings";
import Favorites from "./favorites";
import Billings from "./billings";
import Configuration from "./configuration";

export default function ProfilePanel({ user_id }: { user_id: string }) {
  const [panel, setPanel] = useState<0 | 1 | 2 | 3>(0);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex gap-2">
        <div className="w-[200px]">
          <div>
            <div
              className={`w-full mb-2 font-medium hover:bg-muted-foreground/10 rounded-md p-3 cursor-pointer ${panel === 0 ? "bg-muted-foreground/20" : ""}`}
              onClick={() => setPanel(0)}
            >
              Mis anuncios
            </div>
          </div>
          <div>
            <div
              className={`w-full mb-2 font-medium hover:bg-muted-foreground/10 rounded-md p-3 cursor-pointer ${panel === 1 ? "bg-muted-foreground/20" : ""}`}
              onClick={() => setPanel(1)}
            >
              Favoritos
            </div>
          </div>
          <div>
            <div
              className={`w-full mb-2 font-medium hover:bg-muted-foreground/10 rounded-md p-3 cursor-pointer ${panel === 2 ? "bg-muted-foreground/20" : ""}`}
              onClick={() => setPanel(2)}
            >
              Facturación
            </div>
          </div>
          <div>
            <div
              className={`w-full mb-2 font-medium hover:bg-muted-foreground/10 rounded-md p-3 cursor-pointer ${panel === 3 ? "bg-muted-foreground/20" : ""}`}
              onClick={() => setPanel(3)}
            >
              Configuraciones
            </div>
          </div>
        </div>
        <div className="flex-1">
          {panel === 0 && <MyListings user_id={user_id} />}
          {panel === 1 && <Favorites user_id={user_id} />}
          {panel === 2 && <Billings />}
          {panel === 3 && <Configuration />}
        </div>
      </div>
    </div>
  );
}
