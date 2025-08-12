import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  hover = false,
  children,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface border border-gray-100 shadow-card transition-all duration-200",
        hover && "hover:shadow-card-hover hover:scale-[1.02] cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;