"use client";

import { useState, useEffect, useRef } from "react";
import { useUserContext } from '../../../context/UserContext';
import { 
  PencilLine,
  Plus,
  Paperclip, 
  ChevronRight,
  PanelLeftClose,
  Menu as MenuIcon,
  LogOut,
  Trash2,
  Mic,
  ArrowUp
} from "lucide-react";
import { ThemeToggle } from '../../../components/ThemeToggle';

// Custom Hamburger Menu Component
const CustomMenuIcon = () => (
  <div className="flex flex-col space-y-1">
    <div className="w-5 h-0.5 bg-[var(--color-light-yellow)]"></div>
    <div className="w-6 h-0.5 bg-[var(--color-golden-yellow)]"></div>
    <div className="w-5 h-0.5 bg-[var(--color-light-yellow)]"></div>
  </div>
);

// Typing Effect Component pour texte progressif
const TypingEffect = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayedText}</span>;
};

type Variant = "home" | "service";

type Message = {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentName?: string;
};

type Conversation = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread?: boolean;
};

export default function ClientCareHome() {
  const { user, logout } = useUserContext();
  const [variant, setVariant] = useState<Variant>("home");
  const [inputMessage, setInputMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [currentConversationTitle, setCurrentConversationTitle] = useState<string>('Nouvelle conversation');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // API base URLs
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend';
  const LLM_GATEWAY_URL = process.env.NEXT_PUBLIC_LLM_GATEWAY_URL || 'http://172.17.184.236:8000';

  // Get quick action buttons based on client type
  const getQuickActionButtons = () => {
    // @ts-ignore - clientType is added in onboarding
    const clientType = user?.clientType;
    
    if (clientType === "discovery") {
      // Actions pour nouveaux clients
      return [
        "Découvrir nos services",
        "Ouvrir un compte",
        "Contacter un conseiller",
        "Simuler un crédit",
        "Prendre rendez-vous",
        "Nos avantages"
      ];
    } else {
      // Actions pour clients existants (plus avancées)
      return [
        "Consulter mes comptes",
        "Effectuer un virement",
        "Demander un relevé",
        "Historique des transactions",
        "Gérer mes cartes",
        "Support technique"
      ];
    }
  };

  // Initialize conversations from backend
  const initializeConversations = () => {
    // Start with empty conversations - no hard-coded data
    setConversations([]);
  };

  // Fetch conversations from backend
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/data/conversations?user_id=${user?.name || 'default'}`);
      if (response.ok) {
        const data = await response.json();
        // Don't load conversations from backend - start fresh
        console.log('Backend returned conversations, but ignoring them:', data);
        setConversations([]);
      } else {
        initializeConversations(); // Fallback to empty data
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      initializeConversations(); // Fallback to empty data
    }
  };

  // Send message to LLM gateway using API proxy
  const sendMessageToAgent = async (message: string) => {
    try {
      const response = await fetch('/api/llm/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: 'client-care-bot',
          question: message
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.error('Error sending message to agent:', error);
    }
    return 'Désolé, je ne peux pas traiter votre demande pour le moment.';
  };

  const handleQuickAction = async (actionText: string) => {
    setHasInteracted(true);
    setVariant("service");
    setCurrentConversationTitle(actionText);
    
    // Add new conversation to sidebar
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: actionText,
      lastMessage: actionText,
      timestamp: new Date(),
      unread: false
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: actionText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Get real agent response from LLM
    try {
      const agentResponse = await sendMessageToAgent(actionText);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: agentResponse,
        timestamp: new Date(),
        agentName: 'MAISYS Client Care'
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Update conversation in sidebar with last message
      if (activeConversation) {
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation 
            ? { ...conv, lastMessage: agentResponse, timestamp: new Date() }
            : conv
        ));
      }
      
      setIsTyping(false);
    } catch (error) {
      console.error('Error getting agent response:', error);
      
      // Fallback response if LLM fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: "Désolé, je ne peux pas traiter votre demande pour le moment. Veuillez réessayer.",
        timestamp: new Date(),
        agentName: 'MAISYS Client Care'
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;
    
    setHasInteracted(true);
    setVariant("service");
    
    // Update conversation title with first message if it's still default
    if (currentConversationTitle === 'Nouvelle conversation') {
      const newTitle = inputMessage.length > 30 ? inputMessage.substring(0, 30) + '...' : inputMessage;
      setCurrentConversationTitle(newTitle);
      
      // Add new conversation to sidebar
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: newTitle,
        lastMessage: inputMessage,
        timestamp: new Date(),
        unread: false
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversation.id);
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Get real agent response from LLM
    try {
      const agentResponse = await sendMessageToAgent(inputMessage);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: agentResponse,
        timestamp: new Date(),
        agentName: 'MAISYS Client Care'
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Update conversation in sidebar with last message
      if (activeConversation) {
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation 
            ? { ...conv, lastMessage: agentResponse, timestamp: new Date() }
            : conv
        ));
      }
      
      setIsTyping(false);
    } catch (error) {
      console.error('Error getting agent response:', error);
      
      // Fallback response if LLM fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: "Désolé, je ne peux pas traiter votre demande pour le moment. Veuillez réessayer.",
        timestamp: new Date(),
        agentName: 'MAISYS Client Care'
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    const selectedConversation = conversations.find(conv => conv.id === conversationId);
    if (selectedConversation) {
      setActiveConversation(conversationId);
      setCurrentConversationTitle(selectedConversation.title);
      setHasInteracted(true);
      setVariant("service");
      
      // Load conversation messages from backend
      loadConversationMessages(conversationId);
    }
  };

  // Load conversation messages from backend
  const loadConversationMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const messages = await response.json();
        setMessages(messages);
      } else {
        console.error('Failed to load conversation messages');
        // For now, keep empty messages - in real app, you'd handle this better
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading conversation messages:', error);
      setMessages([]);
    }
  };

  // Delete conversation
  const handleDeleteConversation = (conversationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If deleted conversation was active, clear it
      if (activeConversation === conversationId) {
        setActiveConversation(null);
        setMessages([]);
        setCurrentConversationTitle('Nouvelle conversation');
        setHasInteracted(false);
        setVariant("home");
      }
      
      // Remove from localStorage
      const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
      localStorage.setItem('maisys_client_conversations', JSON.stringify(updatedConversations));
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      window.location.href = '/';
    }
  };

  // Create new conversation
  const handleNewConversation = () => {
    setHasInteracted(false);
    setVariant("home");
    setMessages([]);
    setActiveConversation(null);
    setCurrentConversationTitle('Nouvelle conversation');
    setInputMessage('');
  };

  useEffect(() => {
    // Start with empty conversations - let user create their own
    setConversations([]);
    
    // Clear any existing conversations from localStorage
    localStorage.removeItem('maisys_client_conversations');
    
    // Don't load any saved conversations - start fresh
    console.log('Starting with empty conversations');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('maisys_client_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Help modal component
  const HelpModal = () => {
    if (!showHelpModal) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--color-dark-blue)] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[var(--color-light-blue)] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-golden-yellow)] rounded-lg flex items-center justify-center">
                <span className="text-[var(--color-dark-blue)] font-bold text-xl">?</span>
                </div>
              <h2 className="text-[var(--color-light-yellow)] text-xl font-bold">Comment utiliser MAISYS Client Care</h2>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="p-2 rounded-lg hover:bg-[var(--color-light-blue)]/20 transition-colors text-[var(--color-light-yellow)]"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Section 1: Interface */}
            <div>
              <h3 className="text-[var(--color-golden-yellow)] font-semibold text-lg mb-3">🎯 Interface principale</h3>
              <div className="space-y-2 text-[var(--color-light-yellow)] text-sm">
                <p><strong>• Logo MAISYS :</strong> Cliquez pour revenir à l'accueil</p>
                <p><strong>• Menu hamburger :</strong> Ouvre/ferme la barre latérale</p>
                <p><strong>• Bouton stylo :</strong> Crée une nouvelle conversation</p>
                <p><strong>• Zone de chat :</strong> Historique de vos conversations</p>
                <p><strong>• Barre de saisie :</strong> Tapez vos questions en bas</p>
              </div>
            </div>

            {/* Section 2: Conversations */}
            <div>
              <h3 className="text-[var(--color-golden-yellow)] font-semibold text-lg mb-3">💬 Gestion des conversations</h3>
              <div className="space-y-2 text-[var(--color-light-yellow)] text-sm">
                <p><strong>• Nouvelle conversation :</strong> Cliquez sur le stylo ou tapez un message</p>
                <p><strong>• Changer de conversation :</strong> Utilisez la barre latérale quand elle est ouverte</p>
                <p><strong>• Supprimer une conversation :</strong> Cliquez sur l'icône poubelle dans la barre latérale</p>
                <p><strong>• Titre automatique :</strong> Le titre se génère à partir de votre premier message</p>
              </div>
            </div>

            {/* Section 3: Actions rapides */}
            <div>
              <h3 className="text-[var(--color-golden-yellow)] font-semibold text-lg mb-3">⚡ Actions rapides</h3>
              <div className="space-y-2 text-[var(--color-light-yellow)] text-sm">
                <p><strong>• Boutons prédéfinis :</strong> Cliquez sur les suggestions pour des actions courantes</p>
                <p><strong>• Services bancaires :</strong> Consultez vos comptes, effectuez des virements, etc.</p>
                <p><strong>• Raccourcis clavier :</strong> Appuyez sur Entrée pour envoyer un message</p>
                <p><strong>• Édition :</strong> Utilisez Shift+Entrée pour une nouvelle ligne</p>
              </div>
            </div>

            {/* Section 4: Fonctionnalités */}
            <div>
              <h3 className="text-[var(--color-golden-yellow)] font-semibold text-lg mb-3">🔧 Fonctionnalités avancées</h3>
              <div className="space-y-2 text-[var(--color-light-yellow)] text-sm">
                <p><strong>• Assistant IA :</strong> MAISYS utilise l'intelligence artificielle pour vous aider</p>
                <p><strong>• Contexte :</strong> L'assistant se souvient de vos conversations précédentes</p>
                <p><strong>• Personnalisation :</strong> Les réponses s'adaptent à vos besoins bancaires</p>
                <p><strong>• Historique :</strong> Toutes vos conversations sont sauvegardées</p>
              </div>
            </div>

            {/* Section 5: Conseils */}
            <div>
              <h3 className="text-[var(--color-golden-yellow)] font-semibold text-lg mb-3">💡 Conseils d'utilisation</h3>
              <div className="space-y-2 text-[var(--color-light-yellow)] text-sm">
                <p><strong>• Soyez précis :</strong> Plus votre question est claire, meilleure sera la réponse</p>
                <p><strong>• Utilisez les boutons :</strong> Les actions rapides vous font gagner du temps</p>
                <p><strong>• Explorez :</strong> N'hésitez pas à poser des questions sur différents services</p>
                <p><strong>• Feedback :</strong> Vos interactions aident à améliorer l'assistant</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[var(--color-light-blue)]/20">
            <div className="flex justify-between items-center">
              <p className="text-[var(--color-light-yellow)] text-xs opacity-80">
                MAISYS Client Care - Assistant bancaire virtuel
              </p>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-[var(--color-golden-yellow)] text-[var(--color-dark-blue)] rounded-lg font-semibold hover:bg-[var(--color-light-yellow)] transition-colors"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-[var(--color-dark-blue)] text-[var(--color-light-yellow)] overflow-hidden">
      <div className="h-full bg-[var(--background)] overflow-hidden rounded-2xl m-2 shadow-2xl ring-1 ring-white/5 relative">
        {/* Sidebar - fixe quand ouverte */}
        {sidebarOpen && (
          <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[var(--color-med-blue)] rounded-l-2xl transition-all duration-300 z-10 shadow-xl overflow-hidden flex flex-col">
            {/* Header - Logo et titre */}
            <div className="flex-shrink-0 p-2 pt-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/Logo-Maisys.png" 
                  alt="MAISYS Logo" 
                  className="w-8 h-8"
                />
                <span className="font-black tracking-wide text-[var(--color-golden-yellow)]">MAISYS Client Care</span>
                </div>
            </div>

            <div className="flex-shrink-0 px-4 pt-2">
              <div className="mb-2 text-sm font-semibold text-[var(--color-light-yellow)] opacity-80">Conversations</div>
              <div className="h-[1px] w-full bg-white bg-opacity-[0.06]" />
        </div>

            {/* Conversations scrollables */}
            <nav className="flex-1 overflow-y-auto min-h-0 mt-2">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                  onClick={() => handleConversationSelect(conversation.id)}
                  className={`group flex w-full items-center justify-between px-4 py-3 text-left text-sm text-[var(--color-light-yellow)] opacity-85 ${
                    activeConversation === conversation.id ? 'bg-[var(--color-light-blue)] bg-opacity-20' : ''
                  }`}
                >
                  <span className="line-clamp-1">{conversation.title}</span>
                  <div className="flex items-center gap-2">
                    {conversation.unread && <div className="w-2 h-2 bg-[var(--color-golden-yellow)] rounded-full"></div>}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className="p-1 rounded hover:bg-white/10 transition-colors text-[var(--color-light-yellow)] opacity-60 hover:opacity-100 cursor-pointer"
                      title="Supprimer la conversation"
                    >
                      <Trash2 className="h-3 w-3" />
                          </div>
                    <ChevronRight className="h-4 w-4 text-[var(--color-light-yellow)] opacity-30" />
                      </div>
                    </button>
                  ))}
            </nav>
              
            {/* User Profile - fixe en bas */}
            <div className="flex-shrink-0 p-3">
              {/* Theme Toggle - positioned above logout when sidebar is open */}
              <div className="mb-3">
                <ThemeToggle />
        </div>

              {/* Logout Button - positioned above avatar when sidebar is open */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-[var(--color-light-yellow)]"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Se déconnecter</span>
              </button>
              
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="overflow-hidden ring-2 ring-white ring-opacity-10" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }}>
                  <div className="w-full h-full bg-[var(--color-golden-yellow)] flex items-center justify-center" style={{ borderRadius: '50%' }}>
                    <span className="text-[var(--color-dark-blue)] font-bold text-xs">
                      {user?.name ? 
                        user.name.includes('\\') ? 
                          user.name.split('\\')[1]?.split('.')?.map(n => n[0])?.join('').slice(0, 2).toUpperCase() || 'U' :
                          user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                        : 'U'}
                    </span>
                  </div>
                  </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--color-light-yellow)]">{user?.name || 'Client'}</p>
                  <p className="text-xs text-[var(--color-light-yellow)] opacity-60">{user?.role || 'Client'}</p>
                </div>
              </button>
                  </div>
          </aside>
        )}
        
        

        {/* Main Content - Optimisé pour mobile */}
        <main className={`flex-1 bg-[var(--background)] flex flex-col rounded-2xl h-full transition-all duration-300 ${sidebarOpen ? 'ml-[260px]' : 'ml-0'}`}>
          {/* Mobile hamburger button - Only visible on mobile when sidebar is closed */}
          {!sidebarOpen && (
            <div className="sm:hidden absolute top-4 left-4 z-20">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-[var(--color-med-blue)]/20 hover:bg-[var(--color-med-blue)]/30 transition-colors"
                title="Ouvrir le menu"
              >
                <CustomMenuIcon />
              </button>
            </div>
          )}
                    {/* Top bar with controls when sidebar is collapsed - Hidden on mobile */}
          {!sidebarOpen && (
            <div className="hidden sm:flex absolute top-6 left-2 items-center gap-2 z-20">
              <img 
                src="/Logo-Maisys.png" 
                alt="MAISYS Logo" 
                className="w-8 h-8"
              />
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 rounded hover:bg-white/5 transition-colors"
              >
                <CustomMenuIcon />
              </button>
                <button
                onClick={handleNewConversation}
                className="p-1 rounded hover:bg-white/5 transition-colors"
                title="Nouvelle conversation"
                >
                <PencilLine className="h-4 w-4 text-[var(--color-light-yellow)] opacity-80" />
                </button>
            </div>
          )}
          
          {/* Titre centré quand sidebar fermée - Hidden on mobile */}
          {!sidebarOpen && (
            <div className="hidden sm:flex justify-center pt-4">
              <div className="rounded-full px-4 py-1 text-sm text-[var(--color-light-yellow)] opacity-80">
                {currentConversationTitle}
              </div>
            </div>
          )}
          

                      {/* User avatar when sidebar is collapsed - Hidden on mobile to avoid overlap */}
            {!sidebarOpen && (
              <div className="hidden sm:flex absolute bottom-6 left-2 z-10 flex-col items-center gap-3">
                {/* Help button */}
                <button 
                  onClick={() => setShowHelpModal(true)}
                  className="p-2 rounded-full hover:bg-white/5 transition-colors text-[var(--color-light-yellow)]" 
                  title="Aide"
                >
                  <span className="text-lg font-bold">?</span>
                </button>
                
                {/* Theme toggle */}
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                
                {/* Logout button when sidebar is collapsed */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-white/5 transition-colors text-[var(--color-light-yellow)]"
                  title="Se déconnecter"
                  >
                  <LogOut className="h-4 w-4" />
                  </button>
                 
                {/* User avatar */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="overflow-hidden ring-2 ring-white ring-opacity-10 hover:ring-opacity-20 transition-all duration-200"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }}
                >
                  <div className="w-full h-full bg-[var(--color-golden-yellow)] flex items-center justify-center" style={{ borderRadius: '50%' }}>
                    <span className="text-[var(--color-dark-blue)] font-bold text-xs">
                      {user?.name ? 
                        user.name.includes('\\') ? 
                          user.name.split('\\')[1]?.split('.')?.map(n => n[0])?.join('').slice(0, 2).toUpperCase() || 'U' :
                          user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                        : 'U'}
                    </span>
                  </div>
                </button>
              </div>
            )}

          {/* Controls when sidebar is open - hamburger and new message button */}
          {sidebarOpen && (
            <div className="flex items-center gap-4 px-6 pt-6 flex-shrink-0">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded hover:bg-white/5 transition-colors"
              >
                <CustomMenuIcon />
              </button>
                <button
                onClick={handleNewConversation}
                className="p-2 rounded hover:bg-white/5 transition-colors"
                title="Nouvelle conversation"
              >
                <PencilLine className="h-4 w-4 text-[var(--color-light-yellow)] opacity-80" />
                </button>
              <div className="flex-1 flex justify-center">
                <div className="rounded-full px-4 py-1 text-sm text-[var(--color-light-yellow)] opacity-80">
                  {currentConversationTitle}
                </div>
              </div>
            </div>
          )}

                      {/* Content - scrollable area */}
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col custom-scrollbar">
              {!hasInteracted ? (
                <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-20">
                {/* Welcome message centered */}
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-light-yellow)] mb-3 sm:mb-4">
                    Bonjour et bienvenue !
                  </h2>
                  <p className="text-base sm:text-lg text-[var(--color-light-yellow)]/80 max-w-2xl leading-relaxed">
                    Je suis MAISYS, votre assistant bancaire virtuel. N'hésitez pas à me poser toutes vos questions pour découvrir nos services. Je suis là pour vous aider, à tout moment.
                  </p>
                                  </div>
                  

                  
                  {/* Input bar pour la page d'accueil */}
                                     <div className="w-full max-w-4xl mb-6 sm:mb-8">
                     <div className="rounded-2xl bg-transparent p-3 sm:p-4 ring-1 ring-[var(--color-light-blue)] shadow-lg">
                      <div className="flex items-start gap-2 sm:gap-3">
                        {/* Logo MAISYS officiel */}
                        <div className="flex-shrink-0 mt-1 sm:mt-2">
                          <img
                            src="/Logo-Maisys.png"
                            alt="MAISYS Logo"
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg"
                          />
                        </div>
                        
                        {/* Input principal */}
                        <textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Posez votre question..."
                          rows={1}
                          className="flex-1 px-3 sm:px-4 py-2 text-[var(--color-light-yellow)] placeholder-opacity-60 rounded-lg text-sm sm:text-base resize-none overflow-hidden min-h-[40px] sm:min-h-[44px] max-h-32 transition-all duration-200 ease-in-out bg-transparent"
                          style={{
                            height: 'auto',
                            minHeight: '40px'
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                          }}
                        />
                        
                        {/* Utilitaires */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <button className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--color-light-blue)]/20 transition-colors">
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-light-yellow)]" />
                          </button>
                          <button className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--color-light-blue)]/20 transition-colors">
                            <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-light-yellow)]" />
                          </button>
                          
                          {/* Bouton d'envoi */}
                          <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="p-1.5 sm:p-2 rounded-lg bg-[var(--color-golden-yellow)] hover:bg-[var(--color-light-yellow)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-dark-blue)]" />
                          </button>
                        </div>
                      </div>
        </div>
      </div>

                                 {/* Quick action buttons */}
                 <div className={`w-full ${sidebarOpen ? 'max-w-4xl' : 'max-w-2xl'}`}>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                     {getQuickActionButtons().map((action, index) => (
                   <button
                         key={index}
                         onClick={() => handleQuickAction(action)}
                         className="p-3 sm:p-4 rounded-xl bg-[var(--color-sky-blue)] hover:bg-[var(--color-sky-blue)] hover:bg-opacity-80 transition-all duration-200 text-left"
                       >
                         <span className="text-[var(--color-light-yellow)] font-medium text-sm sm:text-base">{action}</span>
                   </button>
                 ))}
               </div>
             </div>
          </div>
            ) : (
              <div className="flex-1 flex flex-col">
        {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-32 space-y-4">
                  <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                  message.type === 'user'
                              ? 'bg-[var(--color-light-blue)] text-[var(--color-light-yellow)]'
                              : 'text-[var(--color-light-yellow)]'
                          }`}
                        >
                        {message.type === 'agent' && (
                          <div className="text-xs text-[var(--color-golden-yellow)] mb-1 font-medium">
                            {message.agentName}
                          </div>
                        )}
                        <div className="text-sm sm:text-base">
                          {message.type === 'agent' ? (
                            <TypingEffect text={message.content} />
                          ) : (
                            message.content
                          )}
                        </div>
                        <div className="text-xs opacity-60 mt-1 sm:mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
                  
                  {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
                      <div className="max-w-4xl mx-auto w-full">
                        <div className=" text-[var(--color-light-yellow)] rounded-2xl px-4 py-3">
                          <div className="text-xs text-[var(--color-golden-yellow)] mb-1 font-medium">
                            MAISYS Client Care
                          </div>
                <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-[var(--foreground)] rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-[var(--color-golden-yellow)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-[var(--foreground)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                </div>
              </div>
            </div>
          )}
                  
          <div ref={messagesEndRef} />
                    </div>
                  </div>
                
                {/* Input bar fixe en bas - Optimisé pour mobile */}
                <div className={`fixed bottom-0 right-0 bg-transparent z-50 transition-all duration-300 ${
                  sidebarOpen ? 'left-[264px]' : 'left-0'
                }`}>
                  <div className="max-w-4xl mx-auto">
                                        {/* Input principal style MAISYS */}
                                         <div className="rounded-2xl bg-transparent p-3 sm:p-4 ring-1 ring-[var(--color-light-blue)] shadow-lg">
                      {/* Logo + Input + Utilitaires sur la même ligne */}
                      <div className="flex items-start gap-2 sm:gap-3">
                        {/* Logo MAISYS officiel */}
                        <div className="flex-shrink-0 mt-1 sm:mt-2">
                          <img
                            src="/Logo-Maisys.png"
                            alt="MAISYS Logo"
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg"
                          />
        </div>

                        {/* Input principal */}
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                          placeholder="Posez votre question..."
                rows={1}
                          className="flex-1 px-3 sm:px-4 py-2 text-[var(--color-light-yellow)] placeholder-opacity-60 rounded-lg text-sm sm:text-base resize-none overflow-hidden min-h-[40px] sm:min-h-[44px] max-h-32 transition-all duration-200 ease-in-out bg-transparent"
                          style={{
                            height: 'auto',
                            minHeight: '40px'
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                          }}
                        />
                        
                        {/* Utilitaires */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <button className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--color-light-blue)]/20 transition-colors">
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-light-yellow)]" />
                          </button>
                          <button className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--color-light-blue)]/20 transition-colors">
                            <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-light-yellow)]" />
            </button>
                          
                          {/* Bouton d'envoi */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
                            className="p-1.5 sm:p-2 rounded-lg bg-[var(--color-golden-yellow)] hover:bg-[var(--color-light-yellow)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                            <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-dark-blue)]" />
            </button>
          </div>
        </div>
      </div>

                    {/* Disclaimer style MAISYS */}
                    <div className="mt-2 sm:mt-3 text-center">
                      <p className="text-xs text-[var(--color-light-yellow)] opacity-80">
                        MAISYS utilise l'IA. Vérifiez les informations. Les conversations sont utilisées pour entraîner l'IA et MAISYS peut apprendre vos préférences.{' '}
                        <button className="underline hover:text-[var(--color-golden-yellow)] transition-colors">Paramètres</button>
                        {' '}ou{' '}
                        <button className="underline hover:text-[var(--color-golden-yellow)] transition-colors">En savoir plus</button>
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          )}
        </div>
        </main>
      </div>
      {showHelpModal && <HelpModal />}
    </div>
  );
}