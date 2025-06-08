import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Listing } from "@/types/listing-types";
import { Copy, MessageSquare } from "lucide-react";
import { useState } from "react";

type ContactInfoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing | null;
};

export function ContactInfoDialog({ open, listing, onOpenChange }: ContactInfoDialogProps) {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyToClipboard = (text: string | null | undefined) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
  };

  const openWhatsApp = (phone: string | null | undefined) => {
    if (!phone) return;
    
    // Eliminar cualquier carácter que no sea número
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Crear el enlace de WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    
    // Abrir en una nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Información de contacto</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <p>Email: {listing?.user?.email}</p>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => copyToClipboard(listing?.user?.email)}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p>Teléfono: {listing?.user?.phone}</p>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => openWhatsApp(listing?.user?.phone)}
              className="h-8 w-8"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
