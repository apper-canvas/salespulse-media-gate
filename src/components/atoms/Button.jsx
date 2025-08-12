import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white shadow-md hover:shadow-lg",
    secondary: "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    accent: "bg-gradient-to-r from-accent to-emerald-400 hover:from-emerald-400 hover:to-accent text-white shadow-md hover:shadow-lg",
    ghost: "hover:bg-gray-100 text-gray-600 hover:text-gray-800",
    danger: "bg-gradient-to-r from-error to-red-500 hover:from-red-500 hover:to-error text-white shadow-md hover:shadow-lg"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;