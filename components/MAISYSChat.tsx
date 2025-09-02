"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "@/context/UserContext";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  agent?: string;
  confidence?: number;
}

export default function MAISYSChat() {
  const { user } = useUserContext();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Appel à l'API du LLM Gateway
      const response = await fetch('http://172.17.184.236:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: 'coworker_assistant',
          question: input,
          user_id: user?.id || 'anonymous'
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.response || "Désolé, je n'ai pas pu traiter votre demande.",
          isUser: false,
          timestamp: new Date(),
          agent: result.agent_used,
          confidence: result.confidence_score
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Erreur de communication avec le serveur');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
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
            {messages.length > 0 && (
              <span className="text-xs bg-[var(--color-light-blue)] px-2 py-1 rounded-full">
                {messages.length} message{messages.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-1 hover:bg-[var(--color-light-blue)] rounded transition-colors text-xs"
                title="Effacer la conversation"
              >
                🗑️
              </button>
            )}
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
        </div>

        {/* Chat messages area - expandable */}
        {isExpanded && (
          <div className="h-96 bg-gray-50 border-t border-gray-200">
            {/* Messages container */}
            <div className="h-full overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="w-16 h-16 bg-[var(--color-golden-yellow)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[var(--color-dark-blue)] text-2xl">M</span>
                  </div>
                  <p className="font-medium text-gray-700 mb-2">Assistant MAISYS</p>
                  <p className="text-sm text-gray-500">Posez vos questions sur les workflows, agents, annuaire, ou tout autre sujet</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-400">Exemples de questions :</p>
                    <div className="text-xs space-y-1">
                      <p>• "Quel est l'IP de Mr Bahiliki SERGE ?"</p>
                      <p>• "Combien de GDP dans l'annuaire ?"</p>
                      <p>• "Comment créer un workflow ?"</p>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.isUser
                          ? 'bg-[var(--color-sky-blue)] text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.isUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {!message.isUser && message.agent && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {message.agent}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-sky-blue)]"></div>
                      <span className="text-sm text-gray-600">MAISYS réfléchit...</span>
                    </div>
                  </div>
                </div>
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
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-blue)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-[var(--color-sky-blue)] text-white rounded-lg hover:bg-[var(--color-dark-blue)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Envoyer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed chat */}
      <div className="h-20"></div>
    </>
  );
}
