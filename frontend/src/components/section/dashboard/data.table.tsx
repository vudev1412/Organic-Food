// File path: /src/components/section/dashboard/data.table.tsx

import React from "react";

interface DataTableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}

const DataTable = <T,>({
  columns,
  data,
  renderRow,
}: DataTableProps<T>): React.ReactElement => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-b">
            {columns.map((col) => (
              <th
                key={col}
                className="p-4 text-sm font-semibold text-gray-600 uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item) => renderRow(item))}</tbody>
      </table>
    </div>
  );
};

export default DataTable;
