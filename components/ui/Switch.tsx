import React from "react";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export default function Switch({ checked, onChange, disabled, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      tabIndex={0}
      className={`inline-flex items-center w-10 h-6 rounded-full border-2 transition-colors duration-200 focus:outline-none ${checked ? "bg-[var(--color-sky-blue)] border-[var(--color-sky-blue)]" : "bg-[var(--color-light-yellow)] border-[var(--color-light-blue)]"} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className || ""}`}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={e => {
        if ((e.key === " " || e.key === "Enter") && !disabled) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <span
        className={`inline-block w-5 h-5 rounded-full shadow transform transition-transform duration-200 ${checked ? "translate-x-4 bg-[var(--color-dark-blue)]" : "translate-x-0 bg-[var(--background)]"}`}
      />
    </button>
  );
} 