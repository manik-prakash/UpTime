import { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "up" | "down" | "degraded" | "neutral";
    className?: string;
}

export default function Badge({
    children,
    variant = "neutral",
    className = "",
}: BadgeProps) {
    const variants = {
        up: "bg-up text-white",
        down: "bg-down text-white",
        degraded: "bg-degraded text-white",
        neutral: "bg-light/50 text-primary",
    };

    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                px-2.5 py-1
                text-xs font-semibold
                rounded-full
                ${variants[variant]}
                ${className}
            `}
        >

            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            {children}
        </span>
    );
}
