import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  className, 
  src,
  alt = "Avatar",
  size = "default",
  children,
  ...props 
}, ref) => {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    default: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg"
  };

  const initials = alt.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-light text-white font-medium",
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover"
        />
      ) : children ? (
        children
      ) : (
        initials
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;