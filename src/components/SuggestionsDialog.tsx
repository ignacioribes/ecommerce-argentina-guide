import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendSuggestion, suggestionSchema } from "@/lib/suggestions";

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

const defaultValues: SuggestionFormValues = {
  name: "",
  email: "",
  message: "",
};

type SuggestionsDialogProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SuggestionsDialog({ isOpen, onOpenChange }: SuggestionsDialogProps) {
  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: SuggestionFormValues) {
    try {
      await sendSuggestion({ data: values });
      toast.success("¡Gracias! Recibimos tu sugerencia.");
      form.reset();
      onOpenChange?.(false);
    } catch (error) {
      console.error(error);
      toast.error("No pudimos enviar tu sugerencia. Probá de nuevo en un rato.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-hairline bg-card">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2 text-xl text-white">
            <Lightbulb className="h-5 w-5 text-accent-3" />
            Sugerencias
          </DialogTitle>
          <DialogDescription>
            ¿Falta algo en la comparativa? ¿Encontraste un dato desactualizado? Contanos y lo
            revisamos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu sugerencia</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Ej: agregarían X plataforma, actualizar el precio de…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[oklch(0.72_0.17_195)] to-[oklch(0.78_0.19_140)] font-bold text-[oklch(0.12_0.02_255)] hover:opacity-90"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Enviar sugerencia
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
