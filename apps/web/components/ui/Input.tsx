import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({
    label,
    error,
    className = "",
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-primary">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          px-4 py-2 
          border border-light 
          rounded-lg 
          bg-white 
          text-primary 
          placeholder:text-secondary/50
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          transition-all duration-200
          ${error ? "border-down ring-1 ring-down" : ""}
          ${className}
        `}
                {...props}
            />
            {error && <span className="text-sm text-down">{error}</span>}
        </div>
    );
}
