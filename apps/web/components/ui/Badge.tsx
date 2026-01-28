import { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "up" | "down" | "neutral";
    className?: string;
}

export default function Badge({
    children,
    variant = "neutral",
    className = "",
}: BadgeProps) {
    const variants = {
        up: "bg-up/10 text-up border-up/20",
        down: "bg-down/10 text-down border-down/20",
        neutral: "bg-light/20 text-secondary border-light/30",
    };

    return (
        <span
            className={`
        inline-flex items-center
        px-2.5 py-0.5
        text-xs font-medium
        rounded-full
        border
        ${variants[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
