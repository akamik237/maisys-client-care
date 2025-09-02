# 🎨 **Couleurs MAISYS - Landing Page**

## 📋 **Palette de Couleurs Utilisées**

### **Couleurs Principales (CSS Variables)**
```css
--background: #fffdf4 (clair) / #080E26 (sombre)
--foreground: #080E26 (clair) / #ededed (sombre)
```

### **Couleurs d'Accent**
```css
--color-med-blue: #ffe044 (clair) / #111A40 (sombre)
--color-dark-blue: #fefcf0 (clair) / #080E26 (sombre)
--color-light-blue: #ffe683 (clair) / #223480 (sombre)
--color-sky-blue: #ffe066 (clair) / #223480 (sombre)
--color-golden-yellow: #1a2340 (clair) / #ffd745 (sombre)
--color-light-yellow: #2a3b8f (clair) / #FFF2CC (sombre)
```

## 🎯 **Utilisation dans la Landing Page**

### **1. Arrière-plan**
- **Page principale** : `bg-[var(--background)]`
- **Blobs animés** : Utilisent les couleurs d'accent avec transparence

### **2. Navigation**
- **Logo MAISYS** : `text-[var(--foreground)]`
- **Toggle thème** : Couleurs par défaut du composant

### **3. Hero Section**
- **Titre principal** : `text-[var(--color-golden-yellow)]`
- **Sous-titre** : `text-[var(--color-light-yellow)]`
- **Description** : `text-[var(--foreground)]`

### **4. Boutons CTA**
- **"Commencer"** : 
  - `bg-[var(--color-golden-yellow)]`
  - `text-[var(--color-dark-blue)]`
- **"En Savoir Plus"** :
  - `border-[var(--color-sky-blue)]`
  - `text-[var(--color-sky-blue)]`

### **5. Cartes de Fonctionnalités**
- **Arrière-plan** : `bg-[var(--color-dark-blue)]/80`
- **Bordures** : `border-[var(--color-sky-blue)]`
- **Titres** : `text-[var(--foreground)]`
- **Descriptions** : `text-[var(--foreground)]`
- **Icônes** : Couleurs d'accent variées

### **6. Section CTA**
- **Titre** : `text-[var(--foreground)]`
- **Description** : `text-[var(--foreground)]`
- **Bouton** : Même style que "Commencer"

### **7. Footer**
- **Bordure** : `border-[var(--color-sky-blue)]/20`
- **Texte** : `text-[var(--foreground)]`

## 🌈 **Thèmes Clair vs Sombre**

### **Thème Clair**
- **Arrière-plan** : Jaune très clair (#fffdf4)
- **Texte** : Bleu foncé (#080E26)
- **Accents** : Tons de jaune et bleu

### **Thème Sombre**
- **Arrière-plan** : Bleu très foncé (#080E26)
- **Texte** : Blanc cassé (#ededed)
- **Accents** : Tons de bleu et jaune doré

## 🔄 **Transitions et Animations**

### **Hover Effects**
- **Cartes** : `hover:bg-[var(--color-dark-blue)]`
- **Boutons** : `hover:brightness-95`
- **Échelle** : `hover:scale-105`

### **Animations Blob**
- **Blob 1** : `bg-[var(--color-light-blue)]`
- **Blob 2** : `bg-[var(--color-golden-yellow)]`
- **Blob 3** : `bg-[var(--color-med-blue)]`

## ✅ **Avantages de cette Palette**

### **Cohérence**
- **Toutes les couleurs** proviennent de `globals.css`
- **Thèmes** s'adaptent automatiquement
- **Identité visuelle** MAISYS respectée

### **Accessibilité**
- **Contraste** optimal entre texte et arrière-plan
- **Lisibilité** garantie sur tous les appareils
- **Support** des thèmes clair/sombre

### **Maintenance**
- **Variables CSS** centralisées
- **Modifications** faciles via `globals.css`
- **Cohérence** dans tout le projet

---

**La landing page MAISYS utilise maintenant la palette de couleurs officielle !** 🎨✨
