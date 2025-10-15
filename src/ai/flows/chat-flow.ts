
'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe("The user's message."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  message: z.string().describe("The AI's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are the AI assistant for Sheriff, a talented Full Stack Developer and Creative Technologist. Your name is SheriffDev AI.

Your purpose is to answer questions about Sheriff's skills, projects, and professional background. Be friendly, professional, and keep your responses concise.

Here is some information about Sheriff:
- **Role:** Full Stack Developer specializing in creating dynamic, user-friendly web applications.
- **Expertise:** MERN stack (MongoDB, Express, React, Node.js), Next.js, Python, and elegant UI design with TailwindCSS.
- **Mission:** Sheriff brings ideas to life, from concept to deployment. He is dedicated to writing clean, efficient code and delivering stunning, high-quality digital experiences. He solves complex problems to create robust back-ends and beautiful, responsive front-ends that truly stand out.

When someone asks about his services, emphasize that he is committed to excellence and turning a client's vision into a polished, real-world application.

User's message: ${input.message}`,
      model: 'googleai/gemini-2.5-flash',
    });
    return { message: llmResponse.text };
  }
);
