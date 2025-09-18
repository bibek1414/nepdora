"use client";
import React from "react";
import Range from "rc-slider";
import "rc-slider/assets/index.css";

interface PriceRange {
  min: number;
  max: number;
}

interface PriceRangeSliderProps {
  value: PriceRange;
  onChange: (value: PriceRange) => void;
  min: number;
  max: number;
  step?: number;
  primaryColor?: string;
}

const priceSteps = [0, 5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000];

export default function PriceRangeSlider({
  value,
  onChange,
  min,
  max,
  step = 1000,
  primaryColor = "#EA7D6A",
}: PriceRangeSliderProps) {
  const handleSliderChange = (newValues: number | number[]) => {
    if (Array.isArray(newValues) && newValues.length === 2) {
      onChange({ min: newValues[0], max: newValues[1] });
    }
  };

  const handleInputChange =
    (type: "min" | "max") => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = Number(e.target.value);
      const isValid =
        type === "min" ? newValue < value.max : newValue > value.min;
      if (isValid) onChange({ ...value, [type]: newValue });
    };

  const generateOptions = (isMin: boolean) => {
    const options = priceSteps.filter(step =>
      isMin ? step < value.max : step > value.min
    );
    const currentValue = isMin ? value.min : value.max;

    if (!priceSteps.includes(currentValue)) options.push(currentValue);
    if (!isMin && !priceSteps.includes(max) && max > value.min)
      options.push(max);

    return options.sort((a, b) => a - b);
  };

  const commonHandleStyle = {
    backgroundColor: "white",
    borderColor: primaryColor,
    borderWidth: 3,
    height: 20,
    width: 20,
    marginTop: -8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    cursor: "pointer",
    zIndex: 2,
  };

  return (
    <div className="w-full">
      <div className="relative mb-6 px-1">
        <Range
          min={min}
          max={max}
          step={step}
          value={[value.min, value.max]}
          onChange={handleSliderChange}
          allowCross={false}
          range
          className="custom-range-slider"
          trackStyle={[
            { backgroundColor: primaryColor, height: 4, borderRadius: 2 },
          ]}
          handleStyle={[commonHandleStyle, commonHandleStyle]}
          railStyle={{ backgroundColor: "#E5E7EB", height: 4, borderRadius: 2 }}
          dotStyle={{ display: "none" }}
        />

        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>₹{value.min.toLocaleString()}</span>
          <span>₹{value.max.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {["min", "max"].map((type, idx) => (
          <React.Fragment key={type}>
            {idx === 1 && (
              <span className="text-sm whitespace-nowrap text-gray-500">
                to
              </span>
            )}
            <select
              value={type === "min" ? value.min : value.max}
              onChange={handleInputChange(type as "min" | "max")}
              className="price-select focus:border-primary w-full cursor-pointer rounded-md border border-gray-300 bg-white p-2 text-sm transition-colors outline-none focus:ring-2"
            >
              {generateOptions(type === "min").map(step => (
                <option key={`${type}-${step}`} value={step}>
                  ₹{step.toLocaleString()}
                  {step === max ? "+" : ""}
                </option>
              ))}
            </select>
          </React.Fragment>
        ))}
      </div>

      <style jsx>{`
        .custom-range-slider {
          touch-action: none;
        }

        .custom-range-slider .rc-slider-handle {
          cursor: grab !important;
          touch-action: none;
        }

        .custom-range-slider .rc-slider-handle:active {
          cursor: grabbing !important;
        }

        .custom-range-slider .rc-slider-handle:hover {
          border-color: ${primaryColor} !important;
          box-shadow: 0 4px 12px ${primaryColor}4D !important;
        }

        .custom-range-slider .rc-slider-track,
        .custom-range-slider .rc-slider-rail {
          cursor: pointer;
        }

        .price-select:hover {
          border-color: ${primaryColor} !important;
          box-shadow: 0 0 0 1px ${primaryColor} !important;
        }

        .price-select:focus {
          ring-color: ${primaryColor} !important;
          border-color: ${primaryColor} !important;
        }
      `}</style>
    </div>
  );
}
