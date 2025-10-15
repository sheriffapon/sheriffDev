
"use client";

import { useState, useRef, useEffect, type MouseEvent } from "react";
import { Bot, Send, X, Loader2, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chat } from "@/ai/flows/chat-flow";

type Message = {
  text: string;
  isUser: boolean;
};

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
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

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (chatRef.current) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging && dragStartRef.current && chatRef.current) {
      const x = e.clientX - dragStartRef.current.x;
      const y = e.clientY - dragStartRef.current.y;
      setPosition({ x, y });
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };
  
  useEffect(() => {
    const handleMouseUp = () => onMouseUp();
    const handleMouseMove = (e: globalThis.MouseEvent) => onMouseMove(e as unknown as MouseEvent<HTMLDivElement>);
    
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);


  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-5 right-5 z-50 rounded-full w-16 h-16 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Bot size={32} />
      </Button>
    );
  }

  return (
    <div
      ref={chatRef}
      className="fixed z-50 shadow-2xl rounded-lg"
      style={{
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      <Card className="w-80 h-96 flex flex-col bg-background/80 backdrop-blur-lg">
        <CardHeader
          className="flex flex-row items-center justify-between p-4 border-b cursor-grab"
          onMouseDown={onMouseDown}
        >
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot /> AI Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                msg.isUser ? "justify-end" : ""
              }`}
            >
              {!msg.isUser && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <Bot size={20} />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
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
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                <Bot size={20} />
              </div>
              <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm bg-secondary flex items-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
              className="pr-10"
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
           <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            Press <CornerDownLeft className="h-3 w-3" /> to send.
          </p>
        </div>
      </Card>
    </div>
  );
}
