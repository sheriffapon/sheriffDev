
"use server";

import * as z from "zod";

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

  // Simulate sending an email
  console.log("Sending email with the following data:", validatedFields.data);
  // In a real app, you would integrate with an email service like Resend, SendGrid, or Nodemailer.
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Always return success for this simulation
  return { success: true, message: "Email sent successfully!" };
}
