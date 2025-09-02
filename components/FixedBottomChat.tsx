"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "@/context/UserContext";

export default function FixedBottomChat() {
  const { user } = useUserContext();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean, timestamp: Date}>>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only show for admin users
  if (user?.role !== 'admin') {
    return null;
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInput("");

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = { 
        text: "Je suis l'assistant MAiSYS. Comment puis-je vous aider ?", 
        isUser: false, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Fixed bottom chat container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        {/* Chat header - always visible */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-dark-blue)] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-golden-yellow)] rounded-full flex items-center justify-center">
              <span className="text-[var(--color-dark-blue)] font-bold text-sm">M</span>
            </div>
            <span className="font-semibold">MAISYS Assistant</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-[var(--color-light-blue)] rounded transition-colors"
            aria-label={isExpanded ? "Réduire le chat" : "Développer le chat"}
          >
            {isExpanded ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Chat messages area - expandable */}
        {isExpanded && (
          <div className="h-96 bg-gray-50 border-t border-gray-200">
            {/* Messages container */}
            <div className="h-full overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Démarrez une conversation avec l'assistant MAiSYS</p>
                  <p className="text-sm mt-1">Posez vos questions sur les workflows, agents, ou tout autre sujet</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.isUser
                          ? 'bg-[var(--color-sky-blue)] text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input area - always visible */}
        <div className="px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-blue)] focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="px-4 py-2 bg-[var(--color-sky-blue)] text-white rounded-lg hover:bg-[var(--color-dark-blue)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed chat */}
      <div className="h-20"></div>
    </>
  );
}
