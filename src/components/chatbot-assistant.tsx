
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chat } from '@/ai/flows/chat-flow';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';

type Message = {
  text: string;
  isUser: boolean;
};

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for position, initialized to null
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);

  const constraintsRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Set initial position only on the client-side after mount
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 100, // Position from right edge
      y: window.innerHeight - 100, // Position from bottom edge
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = { text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
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
      console.error('Chatbot error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  
  const handleClose = () => {
    // When closing, update the icon's position to where the chat window was
    const chatWindow = document.querySelector('[data-chat-window="true"]') as HTMLElement;
    if (chatWindow) {
      const { x, y } = chatWindow.getBoundingClientRect();
      setPosition({ x, y });
    }
    setIsOpen(false);
  };

  // Do not render anything on the server or until the initial position is calculated on the client.
  if (!position) {
    return null;
  }

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            key="chat-icon"
            drag
            dragControls={dragControls}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onPointerDown={(e) => dragControls.start(e)}
            onTap={handleOpen}
            onDragEnd={(_event, info) => {
              setPosition({ x: info.point.x, y: info.point.y });
            }}
            initial={{ scale: 0, opacity: 0, x: position.x, y: position.y }}
            animate={{ scale: 1, opacity: 1, x: position.x, y: position.y }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed z-50 cursor-grab active:cursor-grabbing pointer-events-auto"
            style={{
              // We manage position through animate props, not direct style to avoid conflicts
            }}
          >
            <Button
              className="w-16 h-16 rounded-full shadow-lg bg-primary/80 backdrop-blur-sm text-primary-foreground hover:bg-primary transition-colors duration-300 pointer-events-none"
              aria-label="Open AI Assistant"
            >
              <Bot size={32} />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="chat-window"
            data-chat-window="true"
            drag
            dragControls={dragControls}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onPointerDown={(e) => dragControls.start(e)}
            initial={{ opacity: 0, scale: 0.9, x: position.x, y: position.y }}
            animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="fixed z-50 cursor-grab active:cursor-grabbing pointer-events-auto"
          >
            <Card className="w-80 md:w-96 h-[500px] flex flex-col bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader 
                className="flex flex-row items-center justify-between p-3 border-b border-white/10 cursor-grab active:cursor-grabbing"
              >
                <CardTitle className="text-lg font-semibold flex items-center gap-2 pointer-events-none">
                  <Bot size={20} className="text-primary" /> AI Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 cursor-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${
                      msg.isUser ? 'justify-end' : ''
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
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className="pr-10 bg-secondary border-0"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={handleSendMessage}
                    disabled={isLoading || inputValue.trim() === ''}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

    