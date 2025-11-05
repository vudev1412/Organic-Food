import React from "react";
import { Pencil, Trash2 } from "lucide-react";

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex gap-4">
      <button
        className="text-gray-500 hover:text-indigo-600"
        onClick={onEdit}
        title="Chỉnh sửa"
      >
        <Pencil size={18} />
      </button>
      <button
        className="text-gray-500 hover:text-red-600"
        onClick={onDelete}
        title="Xóa"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TableActions;
