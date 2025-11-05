import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  iconColor?: string; // tùy chọn
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </p>
      </div>
      <div className={`p-3 rounded-full ${iconColor || ''}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
