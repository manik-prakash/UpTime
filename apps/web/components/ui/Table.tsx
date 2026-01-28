import { ReactNode } from "react";

export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => ReactNode;
    align?: "left" | "center" | "right";
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    className?: string;
}

export default function Table<T extends object>({
    columns,
    data,
    className = "",
}: TableProps<T>) {
    const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-light/30">
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={`
                                    px-4 py-3
                                    text-xs font-semibold uppercase tracking-wider
                                    text-secondary
                                    ${alignClasses[column.align || "left"]}
                                `}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-light/20">
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className="hover:bg-surface-dark/50 transition-colors"
                        >
                            {columns.map((column) => (
                                <td
                                    key={String(column.key)}
                                    className={`
                                        px-4 py-4
                                        text-sm text-primary
                                        ${alignClasses[column.align || "left"]}
                                    `}
                                >
                                    {column.render
                                        ? column.render(item)
                                        : String(item[column.key as keyof T] ?? "")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && (
                <div className="text-center py-12 text-secondary">
                    <p className="text-sm">No data available</p>
                </div>
            )}
        </div>
    );
}
