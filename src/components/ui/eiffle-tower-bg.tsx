import React from "react";

const EiffelTowerBg: React.FC = () => {
  return (
    <svg
      viewBox="0 0 200 400"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <path d="M100 20L130 380H70L100 20Z" strokeWidth="2" />
      <path d="M85 100H115" strokeWidth="2" />
      <path d="M75 180H125" strokeWidth="2" />
      <path d="M60 280H140" strokeWidth="2" />

      {/* Intricate lattice work simplified */}
      <path d="M100 20L85 100" strokeWidth="1" />
      <path d="M100 20L115 100" strokeWidth="1" />

      <path d="M85 100L75 180" strokeWidth="1" />
      <path d="M115 100L125 180" strokeWidth="1" />
      <path d="M85 100L125 180" strokeWidth="1" />
      <path d="M115 100L75 180" strokeWidth="1" />

      <path d="M75 180L60 280" strokeWidth="1" />
      <path d="M125 180L140 280" strokeWidth="1" />
      <path d="M75 180L140 280" strokeWidth="1" />
      <path d="M125 180L60 280" strokeWidth="1" />

      {/* Base Arch */}
      <path
        d="M70 380C70 350 85 330 100 330C115 330 130 350 130 380"
        strokeWidth="2"
      />

      {/* Top Antenna */}
      <path d="M100 5V20" strokeWidth="2" />
    </svg>
  );
};

export default EiffelTowerBg;
