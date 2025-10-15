
"use server";

import * as z from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function sendEmail(formData: {
  name: string;
  email: string;
  message: string;
}) {
  const validatedFields = emailSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["sheriffabdulraheemafunsho23@gmail.com"],
      subject: `New message from ${name} on your portfolio`,
      reply_to: email,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, message: "Failed to send email." };
    }

    return { success: true, message: "Email sent successfully!" };

  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Something went wrong." };
  }
}
