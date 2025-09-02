"use client";
import React from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  bgColor: string;
  trendColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  bgColor,
  trendColor,
}) => {
  const isPositive = change > 0;

  return (
    <div className={`${bgColor} relative overflow-hidden rounded-2xl p-6`}>
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid h-full grid-cols-8 gap-1 p-4">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-current"></div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header with icon and trend */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon on the left */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <Image
                src={icon}
                alt={`${title} icon`}
                width={24}
                height={24}
                className="h-15 w-10 object-contain"
              />
            </div>
            <div className="text-sm font-medium text-black/70">{title}</div>
          </div>

          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Value */}
        <div className="mb-4 text-3xl font-bold text-black">{value}</div>

        {/* Simple trend line */}
        <div className="flex h-8 items-end gap-1">
          {Array.from({ length: 12 }).map((_, i) => {
            const height = Math.random() * 100;
            return (
              <div
                key={i}
                className={`${trendColor} rounded-sm`}
                style={{
                  height: `${Math.max(height, 20)}%`,
                  width: "6px",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
