import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
}

export default function Card({
    children,
    className = "",
    padding = "md",
    hover = true,
}: CardProps) {
    const paddings = {
        none: "",
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
    };

    return (
        <div
            className={`
                bg-surface
                rounded-xl
                border border-light/30
                shadow-sm
                ${paddings[padding]}
                ${hover ? "hover-lift" : ""}
                ${className}
            `}
        >
            {children}
        </div>
    );
}
