"use client";
import React from "react";
import Range from "rc-slider";
import "rc-slider/assets/index.css";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

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
}

const priceSteps = [0, 5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000];

export default function PriceRangeSlider({
  value,
  onChange,
  min,
  max,
  step = 1000,
}: PriceRangeSliderProps) {
  const { data: themeResponse } = useThemeQuery();

  // ✅ Get theme with fallback
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

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
    backgroundColor: theme.colors.primaryForeground,
    borderColor: theme.colors.primary,
    borderWidth: 3,
    height: 20,
    width: 20,
    marginTop: -8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    cursor: "pointer",
    zIndex: 2,
  };

  return (
    <div className="w-full" style={{ fontFamily: theme.fonts.body }}>
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
            {
              backgroundColor: theme.colors.primary,
              height: 4,
              borderRadius: 2,
            },
          ]}
          handleStyle={[commonHandleStyle, commonHandleStyle]}
          railStyle={{
            backgroundColor: theme.colors.secondaryForeground,
            height: 4,
            borderRadius: 2,
          }}
          dotStyle={{ display: "none" }}
        />

        <div
          className="mt-2 flex justify-between text-xs"
          style={{ color: theme.colors.text }}
        >
          <span>Rs. {value.min.toLocaleString("en-IN")}</span>
          <span>Rs. {value.max.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {["min", "max"].map((type, idx) => (
          <React.Fragment key={type}>
            {idx === 1 && (
              <span
                className="text-sm whitespace-nowrap"
                style={{ color: theme.colors.text }}
              >
                to
              </span>
            )}
            <select
              value={type === "min" ? value.min : value.max}
              onChange={handleInputChange(type as "min" | "max")}
              className="price-select focus:border-primary w-full cursor-pointer rounded-md border border-gray-300 bg-white p-2 text-xs transition-colors outline-none focus:ring-2"
            >
              {generateOptions(type === "min").map(step => (
                <option key={`${type}-${step}`} value={step}>
                  Rs. {step.toLocaleString("en-IN")}
                  {step === max ? "+" : ""}
                </option>
              ))}
            </select>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
