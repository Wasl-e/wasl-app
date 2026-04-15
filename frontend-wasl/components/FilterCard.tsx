import React from "react";

interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function FilterCard({ label, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all rounded-[10px] px-[18px] py-[14px] border ${
        active
          ? "border-[#C8A84E] bg-[#13110A]"
          : "bg-[#111] border-[#1A1A1A] hover:border-[#C8A84E]"
      }`}
    >
      {label}
    </div>
  );
}