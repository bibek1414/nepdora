"use client";

import { IconType } from "react-icons";

interface StatsCardProps {
  name: string;
  value: string | number;
  icon: IconType;
  color: string;
}

export default function StatsCard({
  name,
  value,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
      <div className="flex items-center">
        <div className={`rounded-full p-3 text-white ${color} mr-4`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{name}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
