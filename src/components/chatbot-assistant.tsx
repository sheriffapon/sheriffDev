
"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chat } from "@/ai/flows/chat-flow";
import { AnimatePresence, motion, useMotionValue, useDragControls } from "framer-motion";

type Message = {
  text: string;
  isUser: boolean;
};

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const constraintsRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragDidMove = useRef(false);
  const dragControls = useDragControls();

  // Separate motion values for icon and window
  const iconX = useMotionValue(0);
  const iconY = useMotionValue(0);
  const windowX = useMotionValue(0);
  const windowY = useMotionValue(0);

  // Set initial position once the component mounts
  useEffect(() => {
    // Position the icon at the bottom right of the screen initially
    const initialX = window.innerWidth - 120;
    const initialY = window.innerHeight - 120;
    iconX.set(initialX);
    iconY.set(initialY);
    // Sync window position with icon
    windowX.set(initialX);
    windowY.set(initialY);
  }, [iconX, iconY, windowX, windowY]);
  
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
  
  const handleOpen = () => {
    // Only open if it wasn't a drag
    if (!dragDidMove.current) {
        // Sync window position with icon before opening
        windowX.set(iconX.get());
        windowY.set(iconY.get());
        setIsOpen(true);
    }
  };
  
  const handleClose = () => {
    // Sync icon position with window before closing
    iconX.set(windowX.get());
    iconY.set(windowY.get());
    setIsOpen(false);
  };

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event);
  }

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-window"
            drag="x"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            className="fixed top-0 left-0 z-50 cursor-grab active:cursor-grabbing"
            style={{ x: windowX, y: windowY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <Card className="w-80 md:w-96 h-[500px] flex flex-col bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl">
              <div
                onPointerDown={startDrag}
                className="cursor-grab active:cursor-grabbing"
              >
                <CardHeader
                  className="flex flex-row items-center justify-between p-3 border-b border-white/10"
                >
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <Bot size={20} className="text-primary" /> AI Assistant
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={handleClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
              </div>
              <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 cursor-auto">
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
              <div className="p-3 border-t border-white/10 cursor-auto">
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
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="chat-icon"
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onTap={handleOpen}
            onDragStart={() => {
                dragDidMove.current = true;
            }}
            onDragEnd={() => {
                // Use a timeout to ensure tap event is not fired on drag end
                setTimeout(() => {
                    dragDidMove.current = false;
                }, 100);
            }}
            className="fixed top-0 left-0 z-50"
            style={{ x: iconX, y: iconY }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="group cursor-grab active:cursor-grabbing">
              <div className="relative w-16 h-16">
                <Button
                  className="relative w-full h-full rounded-full shadow-lg bg-primary/80 backdrop-blur-sm text-primary-foreground hover:bg-primary transition-colors duration-300"
                  aria-label="Open AI Assistant"
                >
                  <Bot size={32} className="group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
