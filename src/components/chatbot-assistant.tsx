
"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chat } from "@/ai/flows/chat-flow";
import { AnimatePresence, motion, useDragControls, useMotionValue } from "framer-motion";

type Message = {
  text: string;
  isUser: boolean;
};

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const wasDragged = useRef(false);
  const dragControls = useDragControls();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userMessage: Message = { text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await chat({ message: inputValue });
      const aiMessage: Message = { text: response.message, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Chatbot error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event);
  }

  return (
    <>
      <div ref={dragConstraintsRef} className="fixed inset-0 pointer-events-none z-50" />
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            drag
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={dragConstraintsRef}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, x: x.get(), y: y.get() }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed z-50 shadow-2xl rounded-xl pointer-events-auto"
            style={{ x, y }} // Use the same motion values to persist position
          >
            <Card className="w-80 md:w-96 h-[500px] flex flex-col bg-card/60 backdrop-blur-xl border-white/10">
              <div
                onPointerDown={startDrag}
                className="cursor-grab active:cursor-grabbing"
              >
                <CardHeader
                  className="flex flex-row items-center justify-between p-3 border-b border-white/10"
                >
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Bot size={20} className="text-primary" /> AI Assistant
                  </CardTitle>
                  <div className="flex items-center">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${
                      msg.isUser ? "justify-end" : ""
                    }`}
                  >
                    {!msg.isUser && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                        <Bot size={20} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                      <Bot size={20} />
                    </div>
                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-secondary flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="p-3 border-t border-white/10">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                    className="pr-10 bg-secondary border-0"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={handleSendMessage}
                    disabled={isLoading || inputValue.trim() === ""}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  Press Enter to send.
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            drag
            dragConstraints={dragConstraintsRef}
            dragMomentum={false}
            onDragStart={() => {
              wasDragged.current = true;
            }}
            onDragEnd={() => {
              // Use a timeout to reset the drag state, allowing onTap to be suppressed
              setTimeout(() => {
                wasDragged.current = false;
              }, 10);
            }}
            onTap={() => {
              if (!wasDragged.current) {
                setIsOpen(true);
              }
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-5 right-5 z-50 group cursor-grab active:cursor-grabbing pointer-events-auto"
            style={{ x, y }}
          >
            <div className="relative w-20 h-20">
               <motion.div
                className="absolute inset-0 bg-primary rounded-full origin-center"
                style={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1, 1.1, 1],
                  opacity: [0, 0.5, 0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                  times: [0, 0.2, 0.4, 0.8, 1],
                }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-primary/50 rounded-full"
                style={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.3, 1],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
              <Button
                className="relative w-full h-full rounded-full shadow-lg bg-transparent hover:bg-primary/20 text-primary-foreground transition-colors duration-300 pointer-events-none"
                aria-label="Open AI Assistant"
              >
                <Bot size={36} className="group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
