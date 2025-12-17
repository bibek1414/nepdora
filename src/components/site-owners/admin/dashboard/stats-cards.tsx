"use client";
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const InquiryIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <title>inquiry</title>
    <path
      d="M448 85.333V384H341.333v85.333L211.2 384H64V85.333zM405.333 128H106.667v213.333h117.275l74.725 49.003v-49.003h106.666zM256.935 286.4q10.25 0 16.938 6.75t6.687 17q0 10.125-6.687 16.875-6.689 6.75-16.938 6.75-10.5 0-17.125-6.75t-6.625-17.25q0-10 6.75-16.688t17-6.687m9.25-136q28.5 0 43.375 13.5 13.125 12.124 13.125 31.5 0 13.125-6.375 22.437-5.579 8.148-18.812 17.493l-3.938 2.695q-12.5 8.375-15.375 12.812-2.875 4.439-2.875 15.813v5.125h-36.875v-11q0-15.876 3.25-22.125 1.875-3.625 5-6.438l2.327-1.939q1.433-1.134 3.408-2.602l13.41-9.6q8.496-6.234 11.542-9.796 4.063-4.75 4.063-11.125 0-8-5.687-12.688-5.688-4.687-15.438-4.687-16 0-38.625 12.875L210.56 164.9q27.75-14.5 55.625-14.5"
      fillRule="evenodd"
    />
  </svg>
);

const AppointmentIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6Z"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 10H21"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 2V6"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 2V6"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AppointmentPendingIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 28 28"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M6.5 1C5.39543 1 4.5 1.89543 4.5 3V4C4.5 5.10457 5.39543 6 6.5 6C6.49244 7.33293 6.70057 8.9592 7.32744 10.3992C7.73965 11.346 8.59008 12.5774 9.98932 13.0034C10.0225 13.0284 9.96615 12.9757 10 13C8.42517 13.5 7.31142 14.6412 6.68214 15.7596C5.59109 17.6987 5.27103 20.0819 5.65721 22.1857C4.97378 22.5037 4.5 23.1965 4.5 24V25C4.5 26.1046 5.39543 27 6.5 27H21.5C22.6046 27 23.5 26.1046 23.5 25V24C23.5 23.1071 22.9149 22.3509 22.1072 22.0938C22.4676 20.0128 22.1411 17.6705 21.0659 15.7596C20.4224 14.616 19.3229 13.5985 18 13C19 12.5 20.0387 11.4069 20.5232 10.4528C21.2625 8.99716 21.5084 7.35122 21.4996 6C22.6042 6 23.5 5.10457 23.5 4V3C23.5 1.89543 22.6046 1 21.5 1H6.5ZM7.65878 22H20.0893C20.4487 20.2867 20.2 18.2992 19.3229 16.7404C18.4265 15.1472 16.8826 14 14.5631 14H13.1849C10.8654 14 9.32158 15.1472 8.42517 16.7404C7.54805 18.2992 7.29935 20.2867 7.65878 22ZM14.4918 12C15.6839 12 16.5643 11.7107 17.2234 11.285C17.8869 10.8564 18.3812 10.2536 18.74 9.54716C19.309 8.42699 19.5087 7.09828 19.4999 6H8.50014C8.49258 7.11659 8.66671 8.46495 9.16121 9.60085C9.47455 10.3206 9.89841 10.9142 10.4453 11.3264C10.9803 11.7296 11.6861 12 12.6499 12H14.4918ZM6.5 3H21.5V4H6.5V3ZM6.5 24H21.5V25H6.5V24Z"
      fill="#000000"
      fillRule="evenodd"
    />
  </svg>
);

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  bgColor: string;
  trendColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  bgColor,
  trendColor,
}) => {
  const isPositive = change > 0;

  return (
    <div className={`${bgColor} relative overflow-hidden rounded-2xl p-6`}>
      <div className="relative z-10">
        {/* Header with icon and trend */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon on the left */}
            <Icon className="h-10 w-10" />
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

interface StatsCardsProps {
  inquiriesCount?: number;
  appointmentsCount?: number;
  pendingAppointmentsCount?: number;
  isLoading?: boolean;
}

export function StatsCards({
  inquiriesCount,
  appointmentsCount,
  pendingAppointmentsCount,
  isLoading,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Inquiries",
      value: isLoading ? "..." : (inquiriesCount || 0).toString(),
      change: 12.5,
      icon: InquiryIcon,
      bgColor: "bg-blue-50",
      trendColor: "bg-blue-500",
    },
    {
      title: "Total Appointments",
      value: isLoading ? "..." : (appointmentsCount || 0).toString(),
      change: 8.2,
      icon: AppointmentIcon,
      bgColor: "bg-emerald-50",
      trendColor: "bg-emerald-500",
    },
    {
      title: "Appointments Left",
      value: isLoading ? "..." : (pendingAppointmentsCount || 0).toString(),
      change: -2.4,
      icon: AppointmentPendingIcon,
      bgColor: "bg-amber-50",
      trendColor: "bg-amber-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
