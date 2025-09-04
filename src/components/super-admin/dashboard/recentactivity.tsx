"use client";

interface Activity {
  message: string;
  time: string;
}

const activities: Activity[] = [
  { message: "New domain registered", time: "2h ago" },
  { message: "Store #123 created", time: "5h ago" },
  { message: "User John Doe joined", time: "1d ago" },
];

export default function RecentActivity() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Recent Activity
      </h2>
      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-none"
          >
            <span className="text-gray-600">{activity.message}</span>
            <span className="text-sm text-gray-400">{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
