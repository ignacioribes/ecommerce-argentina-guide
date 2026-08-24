import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const suggestionSchema = z.object({
  name: z.string().trim().max(120, "El nombre es demasiado largo").optional().or(z.literal("")),
  email: z.string().trim().email("Ingresá un email válido").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Contanos un poco más (mínimo 10 caracteres)")
    .max(5000, "El mensaje es demasiado largo"),
});

export type SuggestionInput = z.infer<typeof suggestionSchema>;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const sendSuggestion = createServerFn({ method: "POST" })
  .validator((input: unknown) => suggestionSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY no está configurada");
    }

    const from = process.env.RESEND_FROM ?? "ComparaTiendas <onboarding@resend.dev>";
    const to = process.env.RESEND_TO ?? "onboarding@resend.dev";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a2e;">
        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 8px;">Nueva sugerencia · ComparaTiendas.com.ar</h2>
        <p><strong>Nombre:</strong> ${data.name ? escapeHtml(data.name) : "—"}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <div style="background: #f6f6f9; border-radius: 8px; padding: 16px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `[Sugerencia] ${data.name || data.email} · ComparaTiendas`,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend respondió ${response.status}: ${body}`);
    }

    return { ok: true as const };
  });
