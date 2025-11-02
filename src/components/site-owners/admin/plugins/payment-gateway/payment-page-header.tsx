import React from "react";

interface Props {
  title: string;
}

export default function PaymentPageHeader({ title }: Props) {
  return (
    <div className="mb-3">
      <h1 className="px-2 text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
    </div>
  );
}
