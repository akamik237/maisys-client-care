import React from "react";
import Link from "next/link";

export type CardAction = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  title?: string;
};

export type CardComponentProps = {
  title: string | React.ReactNode;
  type?: string;
  status?: "active" | "inactive" | string;
  description?: string;
  actions?: CardAction[];
  // Optional switch element (e.g. activation toggle), rendered bottom right
  switch?: React.ReactNode;
  // Optional click/keyboard accessibility props for clickable cards
  onClick?: () => void;
  tabIndex?: number;
  role?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
};

export default function CardComponent({ title, type, status, description, actions, switch: switchEl, onClick, tabIndex, role, onKeyDown, children }: CardComponentProps) {
  return (
    <div
      className="rounded-xl shadow-md border flex flex-col gap-2 p-4 min-w-[220px] max-w-xs w-full hover:shadow-lg transition relative"
      style={{
        background: "var(--background)",
        borderColor: "var(--color-light-blue)",
        color: "var(--foreground)",
      }}
      onClick={onClick}
      tabIndex={tabIndex}
      role={role}
      onKeyDown={onKeyDown}
    >
      <div className="flex items-center justify-between">
        <div className="font-bold text-lg font-quicksand" style={{ color: "var(--foreground)" }}>{title}</div>
        {status && (
          <span
            className={`px-2 py-1 rounded text-xs font-bold font-quicksand ${status === "active" ? "bg-[var(--color-sky-blue)] text-[var(--color-dark-blue)]" : "bg-[var(--color-light-yellow)] text-[var(--color-dark-blue)]"}`}
          >
            {status === "active" ? "Actif" : status === "inactive" ? "Inactif" : status}
          </span>
        )}
      </div>
      {type && <div className="text-xs text-[var(--color-golden-yellow)] font-quicksand">{type}</div>}
      {description && <div className="text-sm font-quicksand opacity-80 mb-2">{description}</div>}
      {children}
      {switchEl ? (
        <div className="absolute bottom-4 right-4 z-10" onClick={e => e.stopPropagation()}>{switchEl}</div>
      ) : actions && actions.length > 0 && (
        <div className="flex gap-2 mt-auto">
          {actions.map((action, idx) =>
            action.href ? (
              <Link href={action.href} key={idx}>
                <button
                  className="p-1 rounded transition border border-[var(--color-light-blue)] hover:bg-[var(--color-sky-blue)]"
                  style={{ color: action.color || "var(--color-sky-blue)" }}
                  title={action.title || action.label}
                >
                  {action.icon}
                </button>
              </Link>
            ) : (
              <button
                key={idx}
                className="p-1 rounded transition border border-[var(--color-light-blue)] hover:bg-[var(--color-sky-blue)]"
                style={{ color: action.color || "var(--color-sky-blue)" }}
                title={action.title || action.label}
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
} 