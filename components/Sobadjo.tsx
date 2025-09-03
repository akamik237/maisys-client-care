"use client";
import { useEffect, useRef, useState } from "react";

interface SobadjoRobotProps {
  className?: string;
  showDepartments?: boolean;
  onDepartmentSelect?: (department: string) => void;
  departments?: Array<{ short: string; full: string }>;
}

export default function SobadjoRobot({ 
  className = "", 
  showDepartments = false, 
  onDepartmentSelect,
  departments = []
}: SobadjoRobotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Observer pour détecter si le composant est visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Ne charger le script Spline que si le composant est visible et que showDepartments est true
    if (!showDepartments || !isVisible) {
      return;
    }

    // Prevent multiple script loads
    if (scriptLoadedRef.current) return;
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="spline-viewer"]');
    if (existingScript) {
      scriptLoadedRef.current = true;
      createSplineViewer();
      return;
    }

    // Check if custom element is already available
    if (window.customElements && window.customElements.get('spline-viewer')) {
      scriptLoadedRef.current = true;
      createSplineViewer();
      return;
    }

    // Load Spline viewer script seulement si nécessaire
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.37/build/spline-viewer.js';
    
    script.onload = () => {
      scriptLoadedRef.current = true;
      createSplineViewer();
    };

    script.onerror = () => {
      console.error('Failed to load Spline script in Sobadjo');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove the spline-viewer element when component unmounts
      if (containerRef.current) {
        const existingViewer = containerRef.current.querySelector('spline-viewer');
        if (existingViewer) {
          existingViewer.remove();
        }
      }
    };
  }, [showDepartments, isVisible]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
        setMousePosition({ x, y });
      }
    };

    if (showDepartments) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showDepartments]);

  const createSplineViewer = () => {
    if (containerRef.current && !containerRef.current.querySelector('spline-viewer')) {
      const splineViewer = document.createElement('spline-viewer');
      splineViewer.setAttribute('url', 'https://prod.spline.design/0Oz-B7TGc59nsKu0/scene.splinecode');
      splineViewer.className = 'w-full h-full';
      containerRef.current.appendChild(splineViewer);
    }
  };

  const handleDepartmentClick = (department: string) => {
    if (onDepartmentSelect) {
      onDepartmentSelect(department);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Robot Container */}
      <div ref={containerRef} className="w-full h-full relative">
        {/* Fallback si Spline n'est pas chargé */}
        {!scriptLoadedRef.current && (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-dark-blue)]/10 rounded-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <div className="text-[var(--foreground)] text-lg">Robot MAISYS</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Departments floating around robot head */}
      {showDepartments && departments.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {departments.map((dept, index) => {
            const angle = (index / departments.length) * 2 * Math.PI;
            const radius = 300; // Increased from 200 to 350 for wider circle
            const baseX = 50; // Center X percentage
            const baseY = 39; // Decreased from 60 to 45 to bring circle higher
            
            // Fixed positions - no mouse tracking for departments
            const x = Math.round((baseX + Math.cos(angle) * (radius / 10)) * 100) / 100;
            const y = Math.round((baseY + Math.sin(angle) * (radius / 10)) * 100) / 100;

            return (
              <div
                key={dept.short}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <button
                  onClick={() => handleDepartmentClick(dept.full)}
                  className="bg-[var(--color-dark-blue)] text-[var(--foreground)] rounded-lg px-4 py-3 font-medium text-sm hover:bg-[var(--color-sky-blue)] border-2 border-[var(--color-sky-blue)] min-w-[280px] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl whitespace-nowrap"
                  title={dept.full}
                >
                  {dept.full}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
