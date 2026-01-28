import { ReactNode } from "react";

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    className?: string;
}

export default function Table<T extends Record<string, unknown>>({
    columns,
    data,
    className = "",
}: TableProps<T>) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-light/30">
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className="px-4 py-3 text-sm font-semibold text-secondary"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className="border-b border-light/20 hover:bg-light/10 transition-colors"
                        >
                            {columns.map((column) => (
                                <td
                                    key={String(column.key)}
                                    className="px-4 py-3 text-sm text-primary"
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
                <div className="text-center py-8 text-secondary">No data available</div>
            )}
        </div>
    );
}
