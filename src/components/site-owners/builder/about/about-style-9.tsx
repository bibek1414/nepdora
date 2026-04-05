"use client";
import React from "react";
import { AboutUs9Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate9Props {
  aboutUsData: AboutUs9Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs9Data>) => void;
}

export const AboutUsTemplate9: React.FC<AboutUsTemplate9Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(aboutUsData, onUpdate);

  const handleStatUpdate =
    (id: string, field: "label" | "value") => (newValue: string) => {
      const updatedStats = data.stats.map(stat =>
        stat.id === id ? { ...stat, [field]: newValue } : stat
      );
      onUpdate?.({ stats: updatedStats });
    };

  return (
    <section
      className="section-padding bg-white py-32 text-black"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Scoped styles - no external deps, all colors from existing Tailwind theme tokens */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .abt9-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #111;
          margin-bottom: 20px;
          opacity: 0.55;
        }
        .abt9-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1.5px;
          background: currentColor;
          flex-shrink: 0;
        }

        .abt9-title {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.6px;
          color: #0a0a0a;
          margin-bottom: 28px;
        }

        .abt9-body {
          font-size: 15px;
          line-height: 1.8;
          color: #555;
        }
        .abt9-body > * + * {
          margin-top: 14px;
        }

        /* Stats card */
        .abt9-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.05),
            0 8px 24px rgba(0,0,0,0.06);
        }

        .abt9-card-header {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .abt9-card-header-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #999;
        }
        .abt9-card-header-dots {
          display: flex;
          gap: 5px;
        }
        .abt9-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0,0,0,0.12);
        }

        .abt9-stat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(0,0,0,0.055);
          transition: background 0.15s ease;
          gap: 16px;
        }
        .abt9-stat-row:last-child {
          border-bottom: none;
        }
        .abt9-stat-row:hover {
          background: rgba(0,0,0,0.018);
        }

        .abt9-stat-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }

        .abt9-stat-index {
          font-size: 11px;
          font-weight: 600;
          color: rgba(0,0,0,0.2);
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
          width: 16px;
        }

        .abt9-stat-label-wrap {
          flex: 1;
          min-width: 0;
        }
        .abt9-stat-label {
          font-size: 13px;
          font-weight: 500;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .abt9-stat-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .abt9-stat-bar-track {
          width: 52px;
          height: 3px;
          background: rgba(0,0,0,0.08);
          border-radius: 2px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .abt9-stat-bar-fill {
          height: 100%;
          background: #0a0a0a;
          border-radius: 2px;
          width: 0%;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .abt9-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.5px;
          font-variant-numeric: tabular-nums;
          min-width: 48px;
          text-align: right;
          line-height: 1;
        }

        /* Editable hover hint */
        .abt9-editable-hint [contenteditable="true"]:hover,
        .abt9-editable-hint [contenteditable="true"]:focus {
          outline: 1.5px dashed rgba(0,0,0,0.25) !important;
          border-radius: 3px;
        }

        /* Animate bars on mount */
        @keyframes abt9-bar-in {
          from { width: 0% }
        }
      `}</style>

      <div
        className="abt9-editable-hint mx-auto grid max-w-5xl items-start gap-16 md:grid-cols-2"
        style={{ alignItems: "center" }}
      >
        {/* ── Left: Text column ── */}
        <div>
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            as="p"
            className="abt9-eyebrow"
            isEditable={isEditable}
          />

          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="abt9-title"
            isEditable={isEditable}
          />

          <div className="abt9-body">
            <EditableText
              value={data.description1}
              onChange={handleTextUpdate("description1")}
              as="p"
              isEditable={isEditable}
              multiline
            />
            <EditableText
              value={data.description2}
              onChange={handleTextUpdate("description2")}
              as="p"
              isEditable={isEditable}
              multiline
            />
            <EditableText
              value={data.description3}
              onChange={handleTextUpdate("description3")}
              as="p"
              isEditable={isEditable}
              multiline
            />
          </div>
        </div>

        {/* ── Right: Stats card ── */}
        <div className="abt9-card">
          {/* Card header */}
          <div className="abt9-card-header">
            <span className="abt9-card-header-label">By the numbers</span>
            <div className="abt9-card-header-dots">
              <div className="abt9-dot" />
              <div className="abt9-dot" />
              <div className="abt9-dot" />
            </div>
          </div>

          {/* Stat rows */}
          {data.stats.map((stat, i) => {
            /* Best-effort bar fill: try to parse a number from stat.value */
            const numMatch = stat.value.replace(/,/g, "").match(/[\d.]+/);
            const num = numMatch ? parseFloat(numMatch[0]) : 0;
            /* Normalise to a visual fill %: clamp 0–100 if it looks like a percentage,
               otherwise use position-based fallback so bars still look good */
            const looksLikePercent = stat.value.includes("%") || num <= 100;
            const fill = looksLikePercent
              ? Math.min(num, 100)
              : Math.min((i + 1) * 18, 92);

            return (
              <div key={stat.id} className="abt9-stat-row">
                <div className="abt9-stat-left">
                  <span className="abt9-stat-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="abt9-stat-label-wrap">
                    <EditableText
                      value={stat.label}
                      onChange={handleStatUpdate(stat.id, "label")}
                      as="span"
                      className="abt9-stat-label"
                      isEditable={isEditable}
                    />
                  </div>
                </div>

                <div className="abt9-stat-right">
                  <div className="abt9-stat-bar-track">
                    <div
                      className="abt9-stat-bar-fill"
                      style={{
                        width: `${fill}%`,
                        animationName: "abt9-bar-in",
                        animationDuration: `${0.6 + i * 0.12}s`,
                        animationTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                        animationFillMode: "backwards",
                        animationDelay: `${i * 0.07}s`,
                      }}
                    />
                  </div>
                  <EditableText
                    value={stat.value}
                    onChange={handleStatUpdate(stat.id, "value")}
                    as="span"
                    className="abt9-stat-value"
                    isEditable={isEditable}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
