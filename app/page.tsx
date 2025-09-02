"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useUserContext } from "../context/UserContext";
import { 
  Shield, 
  Clock, 
  Smartphone, 
  Headphones, 
  CreditCard, 
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const initialized = useRef(false);

  // Allow users to stay on landing page - no automatic redirects
  useEffect(() => {
    console.log("Landing: Page loaded, user can stay here");
  }, []);

  const handleGetStarted = () => {
    router.push("/onboarding");
  };

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClientCare = () => {
    router.push("/client-care/home");
  };
  
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top Navigation Bar */}
      <nav className="relative z-50 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--color-golden-yellow)]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand/Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="bg-[var(--color-golden-yellow)] rounded-xl px-4 py-2 flex items-center space-x-2 shadow-md">
                <img src="/Logo-Maisys.png" alt="MAISYS" className="w-6 h-6" />
                <span className="text-[var(--color-dark-blue)] font-bold text-lg">MAISYS</span>
              </div>
              <span className="text-[var(--foreground)] font-semibold text-lg">Client Care</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-[var(--foreground)] font-medium hover:text-[var(--color-golden-yellow)] transition-colors">
                Services
              </a>
              <a href="#benefits" className="text-[var(--foreground)] font-medium hover:text-[var(--color-golden-yellow)] transition-colors">
                Avantages
              </a>
              <a href="#testimonials" className="text-[var(--foreground)] font-medium hover:text-[var(--color-golden-yellow)] transition-colors">
                Témoignages
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClientCare}
                className="bg-[var(--color-golden-yellow)] text-[var(--color-dark-blue)] px-4 py-2 rounded-xl font-medium hover:brightness-95 transition-all shadow-md"
              >
                Accéder au Service
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-[var(--foreground)] mb-6 leading-tight">
              Votre <span className="text-[var(--color-golden-yellow)]">Assistant Bancaire</span>
              <br />
              <span className="text-[var(--color-light-yellow)]">Intelligent</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--foreground)]/80 max-w-3xl mx-auto leading-relaxed">
              Découvrez le futur de la banque avec MAISYS Client Care. 
              Un assistant IA dédié à vos besoins bancaires, disponible 24h/24.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handleClientCare}
              className="bg-[var(--color-golden-yellow)] text-[var(--color-dark-blue)] font-bold py-4 px-8 rounded-full text-lg hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2"
            >
              <span>Commencer Maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleLearnMore}
              className="border-2 border-[var(--color-golden-yellow)] text-[var(--color-golden-yellow)] font-bold py-4 px-8 rounded-full text-lg hover:bg-[var(--color-golden-yellow)] hover:text-[var(--background)] transition-all duration-300"
            >
              En Savoir Plus
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-golden-yellow)] mb-2">24/7</div>
              <div className="text-[var(--foreground)]/70">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-golden-yellow)] mb-2">100%</div>
              <div className="text-[var(--foreground)]/70">Sécurisé</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-golden-yellow)] mb-2">IA</div>
              <div className="text-[var(--foreground)]/70">Intelligence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-golden-yellow)] mb-2">0€</div>
              <div className="text-[var(--foreground)]/70">Frais</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[var(--color-dark-blue)]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
              Services <span className="text-[var(--color-golden-yellow)]">Bancaires</span> Intelligents
            </h2>
            <p className="text-xl text-[var(--foreground)]/80 max-w-3xl mx-auto">
              MAISYS Client Care révolutionne votre expérience bancaire avec des services personnalisés et instantanés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[var(--background)] rounded-2xl p-8 shadow-lg border border-[var(--color-golden-yellow)]/20 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-golden-yellow)] rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-[var(--color-dark-blue)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">Gestion de Comptes</h3>
              <p className="text-[var(--foreground)]/70 mb-6">
                Consultez vos soldes, historiques de transactions et informations de compte en temps réel.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Consultation instantanée des soldes
                </li>
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Historique détaillé des transactions
                </li>
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Alertes personnalisées
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-[var(--background)] rounded-2xl p-8 shadow-lg border border-[var(--color-golden-yellow)]/20 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-golden-yellow)] rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-[var(--color-dark-blue)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">Virements & Paiements</h3>
              <p className="text-[var(--foreground)]/70 mb-6">
                Effectuez vos virements et paiements en toute sécurité avec l'assistance de l'IA.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Virements instantanés
                </li>
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Paiements sécurisés
                </li>
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Suivi en temps réel
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-[var(--background)] rounded-2xl p-8 shadow-lg border border-[var(--color-golden-yellow)]/20 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-golden-yellow)] rounded-xl flex items-center justify-center mb-6">
                <Headphones className="w-8 h-8 text-[var(--color-dark-blue)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">Support Client</h3>
              <p className="text-[var(--foreground)]/70 mb-6">
                Obtenez une assistance personnalisée 24h/24 pour toutes vos questions bancaires.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Assistance instantanée
                </li>
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Réponses personnalisées
                </li>
                <li className="flex items-center text-[var(--foreground)]/80">
                  <CheckCircle className="w-5 h-5 text-[var(--color-golden-yellow)] mr-2" />
                  Disponible 24h/24
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
              Pourquoi Choisir <span className="text-[var(--color-golden-yellow)]">MAISYS</span> ?
            </h2>
            <p className="text-xl text-[var(--foreground)]/80 max-w-3xl mx-auto">
              Découvrez les avantages qui font de MAISYS Client Care le choix intelligent pour vos besoins bancaires.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-golden-yellow)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[var(--color-dark-blue)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">Sécurité Maximale</h3>
                    <p className="text-[var(--foreground)]/70">
                      Vos données et transactions sont protégées par les dernières technologies de sécurité bancaire.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-golden-yellow)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[var(--color-dark-blue)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">Gain de Temps</h3>
                    <p className="text-[var(--foreground)]/70">
                      Plus besoin d'attendre en ligne ou de prendre rendez-vous. Obtenez des réponses instantanées.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-golden-yellow)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-6 h-6 text-[var(--color-dark-blue)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">Accessible Partout</h3>
                    <p className="text-[var(--foreground)]/70">
                      Accédez à vos services bancaires depuis n'importe où, à tout moment, sur tous vos appareils.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-dark-blue)]/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">
                Statistiques Impressionnantes
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[var(--color-golden-yellow)] mb-2">98%</div>
                  <div className="text-[var(--foreground)]/70">Satisfaction Client</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[var(--color-golden-yellow)] mb-2">2min</div>
                  <div className="text-[var(--foreground)]/70">Temps de Réponse</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[var(--color-golden-yellow)] mb-2">50k+</div>
                  <div className="text-[var(--foreground)]/70">Clients Actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[var(--color-golden-yellow)] mb-2">24/7</div>
                  <div className="text-[var(--foreground)]/70">Disponibilité</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-[var(--color-dark-blue)]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
              Ce Que Disent Nos <span className="text-[var(--color-golden-yellow)]">Clients</span>
            </h2>
            <p className="text-xl text-[var(--foreground)]/80 max-w-3xl mx-auto">
              Découvrez les témoignages de nos clients qui ont révolutionné leur expérience bancaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[var(--background)] rounded-2xl p-8 shadow-lg border border-[var(--color-golden-yellow)]/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[var(--color-golden-yellow)] fill-current" />
                ))}
              </div>
              <p className="text-[var(--foreground)]/80 mb-6 italic">
                "MAISYS a transformé ma façon de gérer mes finances. L'assistant IA répond à toutes mes questions instantanément."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[var(--color-golden-yellow)] rounded-full flex items-center justify-center mr-4">
                  <span className="text-[var(--color-dark-blue)] font-bold">MJ</span>
                </div>
                <div>
                  <div className="font-semibold text-[var(--foreground)]">Marie Johnson</div>
                  <div className="text-[var(--foreground)]/60">Entrepreneure</div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--background)] rounded-2xl p-8 shadow-lg border border-[var(--color-golden-yellow)]/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[var(--color-golden-yellow)] fill-current" />
                ))}
              </div>
              <p className="text-[var(--foreground)]/80 mb-6 italic">
                "Plus besoin d'attendre en ligne ! MAISYS m'aide avec mes virements et mes questions bancaires en quelques secondes."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[var(--color-golden-yellow)] rounded-full flex items-center justify-center mr-4">
                  <span className="text-[var(--color-dark-blue)] font-bold">PD</span>
                </div>
                <div>
                  <div className="font-semibold text-[var(--foreground)]">Pierre Dubois</div>
                  <div className="text-[var(--foreground)]/60">Ingénieur</div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--background)] rounded-2xl p-8 shadow-lg border border-[var(--color-golden-yellow)]/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[var(--color-golden-yellow)] fill-current" />
                ))}
              </div>
              <p className="text-[var(--foreground)]/80 mb-6 italic">
                "L'assistant IA comprend parfaitement mes besoins et me propose des solutions adaptées. Un service exceptionnel !"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[var(--color-golden-yellow)] rounded-full flex items-center justify-center mr-4">
                  <span className="text-[var(--color-dark-blue)] font-bold">AS</span>
                </div>
                <div>
                  <div className="font-semibold text-[var(--foreground)]">Anna Schmidt</div>
                  <div className="text-[var(--foreground)]/60">Consultante</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
            Prêt à Révolutionner Votre <span className="text-[var(--color-golden-yellow)]">Expérience Bancaire</span> ?
          </h2>
          <p className="text-xl text-[var(--foreground)]/80 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de clients qui ont déjà adopté MAISYS Client Care pour une banque plus intelligente et accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleClientCare}
              className="bg-[var(--color-golden-yellow)] text-[var(--color-dark-blue)] font-bold py-4 px-8 rounded-full text-lg hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2"
            >
              <span>Commencer Maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleGetStarted}
              className="border-2 border-[var(--color-golden-yellow)] text-[var(--color-golden-yellow)] font-bold py-4 px-8 rounded-full text-lg hover:bg-[var(--color-golden-yellow)] hover:text-[var(--background)] transition-all duration-300"
            >
              En Savoir Plus
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-dark-blue)]/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/Logo-Maisys.png" alt="MAISYS" className="w-8 h-8" />
                <span className="text-[var(--foreground)] font-bold text-xl">MAISYS</span>
              </div>
              <p className="text-[var(--foreground)]/70">
                Votre assistant bancaire intelligent pour une expérience client exceptionnelle.
              </p>
            </div>
            <div>
              <h3 className="text-[var(--foreground)] font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-[var(--foreground)]/70">
                <li>Gestion de Comptes</li>
                <li>Virements & Paiements</li>
                <li>Support Client</li>
                <li>Conseils Financiers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[var(--foreground)] font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-[var(--foreground)]/70">
                <li>Centre d'Aide</li>
                <li>Contact</li>
                <li>FAQ</li>
                <li>Guide d'Utilisation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[var(--foreground)] font-semibold mb-4">Sécurité</h3>
              <ul className="space-y-2 text-[var(--foreground)]/70">
                <li>Protection des Données</li>
                <li>Chiffrement SSL</li>
                <li>Authentification 2FA</li>
                <li>Audit de Sécurité</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--color-golden-yellow)]/20 mt-8 pt-8 text-center text-[var(--foreground)]/70">
            <p>&copy; 2024 MAISYS Client Care. Tous droits réservés. Service bancaire sécurisé et fiable.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}