import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const turnstileToken = formData.get("cf-turnstile-response") as string;

    if (!name || !email || !subject || !message) {
      return new Response("All fields are required.", { status: 400 });
    }

    // Validate Turnstile token
    const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const turnstileResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken || "",
          }),
        },
      );
      const turnstileResult =
        (await turnstileResponse.json()) as { success: boolean };
      if (!turnstileResult.success) {
        return new Response("Spam check failed. Please try again.", {
          status: 403,
        });
      }
    }

    // Send email via Postmark
    const postmarkToken = import.meta.env.POSTMARK_API_TOKEN;
    const contactEmail = import.meta.env.CONTACT_EMAIL;
    if (postmarkToken && contactEmail) {
      const emailResponse = await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": postmarkToken,
        },
        body: JSON.stringify({
          From: contactEmail,
          To: contactEmail,
          ReplyTo: email,
          Subject: `[Website] ${subject}`,
          TextBody: `From: ${name} (${email})\n\nSubject: ${subject}\n\n${message}`,
          Tag: "website-contact",
          MessageStream: "outbound",
        }),
      });
      if (!emailResponse.ok) {
        return new Response("Failed to send message. Please try again.", {
          status: 500,
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Something went wrong. Please try again.", {
      status: 500,
    });
  }
};
