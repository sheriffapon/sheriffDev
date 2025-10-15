
"use server";

import * as z from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

const reviewEmailSchema = z.object({
  authorName: z.string(),
  comment: z.string(),
  rating: z.number(),
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
      message: "Invalid fields provided.",
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
      return { success: false, message: error.message || "Failed to send email." };
    }

    return { success: true, message: "Email sent successfully!" };

  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Something went wrong: ${errorMessage}` };
  }
}

export async function sendReviewNotificationEmail(reviewData: {
  authorName: string;
  comment: string;
  rating: number;
}) {
  const validatedFields = reviewEmailSchema.safeParse(reviewData);

  if (!validatedFields.success) {
    // This is a server-side validation, so we'll just log the error
    console.error("Invalid review data for email:", validatedFields.error.flatten().fieldErrors);
    return;
  }
  
  const { authorName, comment, rating } = validatedFields.data;

  try {
    await resend.emails.send({
      from: "Portfolio Notification <onboarding@resend.dev>",
      to: ["sheriffabdulraheemafunsho23@gmail.com"],
      subject: `New ${"⭐".repeat(rating)} Review on Your Portfolio!`,
      html: `
        <h2>You've received a new review!</h2>
        <p><strong>Author:</strong> ${authorName}</p>
        <p><strong>Rating:</strong> ${"⭐".repeat(rating)}</p>
        <p><strong>Comment:</strong></p>
        <p>${comment}</p>
      `,
    });
  } catch (error) {
    // We don't want to block the user flow if the email fails, so we just log it.
    console.error("Error sending review notification email:", error);
  }
}
