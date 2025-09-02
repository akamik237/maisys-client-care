"use client";

import { useEffect, useState } from "react";

interface SplineViewerProps {
  url: string;
}

export const SplineViewer = ({ url }: SplineViewerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Charger le script Spline seulement si pas déjà chargé
    const loadSplineScript = async () => {
      // Vérifier si le script est déjà chargé
      if (document.querySelector('script[src*="spline-viewer.js"]')) {
        setIsLoaded(true);
        return;
      }

      // Vérifier si le composant custom est déjà disponible
      if (window.customElements && window.customElements.get('spline-viewer')) {
        setIsLoaded(true);
        return;
      }

      try {
        // Charger le script dynamiquement
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@splinetool/viewer@1.10.53/build/spline-viewer.js';
        script.type = 'module';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          // Attendre que le composant custom soit enregistré
          const checkCustomElement = () => {
            if (window.customElements && window.customElements.get('spline-viewer')) {
              setIsLoaded(true);
            } else {
              setTimeout(checkCustomElement, 50);
            }
          };
          checkCustomElement();
        };

        script.onerror = () => {
          console.error('Failed to load Spline script');
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Spline script:', error);
      }
    };

    loadSplineScript();
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--color-dark-blue)]/10">
        <div className="text-[var(--foreground)] text-lg">Chargement du design 3D...</div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full"
      dangerouslySetInnerHTML={{
        __html: `<spline-viewer url="${url}" class="w-full h-full" style="width: 100%; height: 100%;"></spline-viewer>`
      }}
    />
  );
};
