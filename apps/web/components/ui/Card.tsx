import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
    children,
    className = "",
    padding = "md",
}: CardProps) {
    const paddings = {
        none: "",
        sm: "p-3",
        md: "p-5",
        lg: "p-8",
    };

    return (
        <div
            className={`
        bg-white 
        rounded-lg 
        shadow-sm 
        border border-light/30
        ${paddings[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
