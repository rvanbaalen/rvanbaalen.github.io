interface Env {
  TURNSTILE_SECRET_KEY: string;
  CONTACT_EMAIL: string;
  POSTMARK_API_TOKEN?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

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
    if (env.TURNSTILE_SECRET_KEY) {
      const turnstileResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
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
    if (env.POSTMARK_API_TOKEN && env.CONTACT_EMAIL) {
      await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": env.POSTMARK_API_TOKEN,
        },
        body: JSON.stringify({
          From: env.CONTACT_EMAIL,
          To: env.CONTACT_EMAIL,
          ReplyTo: email,
          Subject: `[Website] ${subject}`,
          TextBody: `From: ${name} (${email})\n\nSubject: ${subject}\n\n${message}`,
          Tag: "website-contact",
          MessageStream: "outbound",
        }),
      });
    }

    return Response.redirect(
      new URL("/contact?success=true", request.url).toString(),
      303,
    );
  } catch {
    return new Response("Something went wrong. Please try again.", {
      status: 500,
    });
  }
};
