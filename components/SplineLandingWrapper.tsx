"use client";

import { SplineViewer } from "./SplineViewer";

interface SplineLandingWrapperProps {
  children: React.ReactNode;
  splineUrl: string;
}

export const SplineLandingWrapper = ({ children, splineUrl }: SplineLandingWrapperProps) => {
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 w-full h-full">
        <SplineViewer url={splineUrl} />
      </div>
      
      {/* Content */}
      {children}
    </div>
  );
};
