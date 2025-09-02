import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ children, className = "", ...props }: ButtonProps) => (
  <button
    className={
      "px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-sky-blue)] " + className
    }
    {...props}
  >
    {children}
  </button>
);

export default Button;
