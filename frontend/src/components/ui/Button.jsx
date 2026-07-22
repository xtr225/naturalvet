import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-[color:var(--color-secondary)] text-white shadow-sm shadow-[rgb(196_106_66_/_0.22)] hover:bg-[color:var(--color-secondary-dark)] active:scale-95",

  secondary:
    "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-olive-dark)] active:scale-95",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95",

  danger:
    "bg-red-600 text-white hover:bg-red-700 active:scale-95",

  outline:
    "border border-[rgb(126_139_93_/_0.28)] bg-white text-[color:var(--color-primary)] hover:bg-[rgb(126_139_93_/_0.08)]",

  ghost:
    "bg-transparent text-slate-600 hover:bg-[rgb(126_139_93_/_0.10)] hover:text-[color:var(--color-olive-dark)] active:scale-95",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "h-10 w-10 p-0 text-sm",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className,
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-secondary)] focus:ring-offset-2 focus:ring-offset-[color:var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
