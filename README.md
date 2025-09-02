# MAISYS Client Care

Interface client pour l'assistant bancaire virtuel MAISYS de La Régionale Bank.

## 🏦 À Propos

MAISYS Client Care est une interface web moderne permettant aux clients de La Régionale Bank d'interagir avec un assistant IA spécialisé dans les services bancaires. L'interface est optimisée pour mobile et offre une expérience utilisateur fluide.

## ✨ Fonctionnalités

- 🤖 **Assistant IA** : Réponses intelligentes avec Gemma 2B
- 📱 **Interface Mobile-First** : Optimisée pour tous les appareils
- 💬 **Chat en Temps Réel** : Conversations fluides avec l'IA
- 🎨 **Design Moderne** : Interface élégante avec thème sombre/clair
- 🔒 **Sécurisé** : Connexion sécurisée aux services bancaires
- 🌍 **Multi-région** : Support Cameroun et Gabon

## 🚀 Technologies

- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS, CSS Variables
- **IA** : Gemma 2B via Ollama
- **Backend** : FastAPI, LLM Gateway
- **Déploiement** : Vercel

## 🛠️ Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/maisys-client-care.git
cd maisys-client-care

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

## 🌐 Déploiement

L'application est déployée sur Vercel et accessible à l'adresse :
https://maisys-client-care.vercel.app

## 📱 Interface

L'interface comprend :
- **Landing Page** : Présentation des services bancaires
- **Chat Interface** : Assistant IA pour les questions clients
- **Sidebar** : Navigation et gestion des conversations
- **Actions Rapides** : Boutons pour les services courants

## 🔧 Configuration

### Variables d'Environnement

```env
NEXT_PUBLIC_BACKEND_URL=/api/backend
NEXT_PUBLIC_LLM_GATEWAY_URL=http://172.17.184.236:8000
```

### Services Requis

- **LLM Gateway** : Service IA (port 8000)
- **Backend API** : API de gestion (port 8001)

## 📞 Support

Pour toute question ou support technique, contactez l'équipe MAISYS.

## 📄 Licence

Propriétaire - La Régionale Bank © 2024