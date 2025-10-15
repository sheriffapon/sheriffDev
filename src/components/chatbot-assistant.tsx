
"use client";

import { useState, useRef, useEffect, type MouseEvent } from "react";
import { Bot, Send, X, Loader2, CornerDownLeft, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chat } from "@/ai/flows/chat-flow";
import { AnimatePresence, motion } from "framer-motion";

type Message = {
  text: string;
  isUser: boolean;
};

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number, initialX: number, initialY: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [initialPositionSet, setInitialPositionSet] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialPositionSet) {
      setPosition({ x: window.innerWidth - 400, y: window.innerHeight - 550 });
      setInitialPositionSet(true);
    }
  }, [initialPositionSet]);

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

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (chatRef.current) {
      setIsDragging(true);
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: position.x,
        initialY: position.y,
      };
       // Prevent text selection while dragging
      e.preventDefault();
    }
  };
  
  const onMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
    if (chatRef.current) {
      chatRef.current.style.cursor = 'grab';
    }
  };

  const onMouseMove = (e: globalThis.MouseEvent) => {
    if (isDragging && dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const newX = dragStartRef.current.initialX + dx;
      const newY = dragStartRef.current.initialY + dy;
      setPosition({ x: newX, y: newY });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);


  return (
    <>
      <AnimatePresence>
        {!isOpen && (
           <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-5 right-5 z-50"
          >
            <Button
              className="w-16 h-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsOpen(true)}
              aria-label="Open AI Assistant"
            >
              <Bot size={32} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed z-50 shadow-2xl rounded-xl"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <Card className="w-80 md:w-96 h-[500px] flex flex-col bg-background/80 backdrop-blur-xl border-white/10">
              <CardHeader
                className="flex flex-row items-center justify-between p-3 border-b border-white/10 cursor-grab"
                onMouseDown={onMouseDown}
              >
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <GripVertical size={18} className="text-muted-foreground"/>
                  <Bot size={20} className="text-primary"/> AI Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
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
                  Press <CornerDownLeft className="h-3 w-3" /> to send.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
