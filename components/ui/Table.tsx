import React from "react";

export type TableColumn = {
  key: string;
  label: string;
  className?: string;
};

export type TableProps = {
  columns: TableColumn[];
  data: any[];
  className?: string;
  onRowClick?: (row: any) => void;
};

const Table: React.FC<TableProps> = ({ columns, data, className = "", onRowClick }) => (
  <div className="overflow-x-auto mt-4">
    <table className={`min-w-full bg-[var(--background)] border border-[var(--color-light-blue)] rounded-lg shadow ${className}`}>
      <thead>
        <tr className="bg-[var(--color-sky-blue)] text-[var(--color-dark-blue)] text-left">
          {columns.map((col) => (
            <th key={col.key} className={`px-4 py-2 font-bold ${col.className || ""}`}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr 
            key={i} 
            className={`border-t border-[var(--color-light-blue)] ${onRowClick ? 'hover:bg-[var(--color-sky-blue)]/10 cursor-pointer' : ''}`}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <td key={col.key} className={`px-4 py-2 ${col.className || ""}`}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table; 