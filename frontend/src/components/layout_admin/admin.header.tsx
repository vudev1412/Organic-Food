import React from "react";
import { Bell, ChevronDown } from "lucide-react";

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-end h-16 px-6">
        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-800 relative">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              className="w-9 h-9 rounded-full object-cover"
              src="https://placehold.co/100x100/E2E8F0/4A5568?text=A"
              alt="Admin Avatar"
            />
            <span className="hidden md:block font-medium text-gray-700">
              Admin
            </span>
            <ChevronDown size={18} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
