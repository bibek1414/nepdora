import React from "react";

interface AlternativeContextProps {
  platformName: string;
  context: string;
  recommendation: string;
}

export const AlternativeContext: React.FC<AlternativeContextProps> = ({
  platformName,
  context,
  recommendation,
}) => {
  return (
    <section className="bg-white py-14 border-b border-slate-100">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          What is {platformName}?
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-4">
          {context}
        </p>
        <p className="text-slate-600 text-lg leading-relaxed">
          {recommendation}
        </p>
      </div>
    </section>
  );
};
