"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  min?: number;
  onChange: (newQuantity: number) => void;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  max,
  min = 1,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max && !disabled) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="inline-flex items-center border border-[#EADBCE] rounded-lg bg-white overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min || disabled}
        className="p-2.5 text-stone-600 hover:bg-[#F3ECE2] hover:text-[#2D231E] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-12 text-center text-sm font-semibold text-[#2D231E]">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max || disabled}
        className="p-2.5 text-stone-600 hover:bg-[#F3ECE2] hover:text-[#2D231E] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
