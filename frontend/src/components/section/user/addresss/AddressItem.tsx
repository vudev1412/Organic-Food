import React from "react";
import { Phone, User, Edit3, Trash2, CheckCircle, MapPin } from "lucide-react";

interface AddressItemProps {
  address: IAddress;
  onEdit: (address: IAddress) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

const AddressItem: React.FC<AddressItemProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <div
      className={`group w-full flex items-center justify-between p-4 rounded-xl border transition-all bg-white hover:shadow-md ${
        address.defaultAddress
          ? "border-green-500 bg-green-50/40"
          : "border-gray-200 hover:border-green-300"
      }`}
    >
      {/* -------------------------------------- */}
      {/* LEFT: INFO SECTION */}
      {/* -------------------------------------- */}
      <div className="flex-1 min-w-0 pr-4">
        {/* Row 1: Name | Phone | Default Label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-gray-800 text-base flex items-center gap-2 whitespace-nowrap">
            <User size={16} className="text-gray-500" />
            {address.receiverName}
          </span>
          <span className="text-gray-300 text-sm">|</span>
          <span className="text-gray-600 text-sm font-medium flex items-center gap-1.5 whitespace-nowrap">
            <Phone size={14} className="text-gray-400" />
            {address.phone}
          </span>

          {/* Default Label (Inline) - Green Badge */}
          {address.defaultAddress && (
            <span className="ml-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
              <CheckCircle size={10} /> Mặc định
            </span>
          )}
        </div>

        {/* Row 2: Address (One line with truncate) */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
          <p className="truncate leading-relaxed">
            <span className="font-medium text-gray-700">{address.street}</span>
            <span className="mx-1.5 text-gray-300">/</span>
            {address.ward}, {address.district}, {address.province}
            {address.note && (
              <span className="ml-2 text-gray-500 italic bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                Note: {address.note}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* RIGHT: ACTIONS SECTION (Horizontal) */}
      {/* -------------------------------------- */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Set Default Button - YELLOW/ORANGE COLOR */}
        {!address.defaultAddress && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="hidden sm:block text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Đặt mặc định
          </button>
        )}

        {/* Icons Action */}
        <div className="flex items-center border-l border-gray-200 pl-3 gap-1">
          <button
            onClick={() => onEdit(address)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
            title="Chỉnh sửa"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressItem;
