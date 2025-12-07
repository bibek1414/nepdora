"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";

const SeoAnimation = () => {
  const [results, setResults] = useState([
    {
      id: "competitor1",
      title: "Top Pashmina Store",
      url: "competitor-a.com",
      mySite: false,
    },
    {
      id: "competitor2",
      title: "Nepal Wool House",
      url: "woolhouse-nepal.com",
      mySite: false,
    },
    {
      id: "mysite",
      title: "Himalayan Authentic Pashmina",
      url: "himalayan-shop.com",
      mySite: true,
    },
    {
      id: "competitor3",
      title: "Thamel Souvenirs",
      url: "thamel-gifts.net",
      mySite: false,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Sort so mySite goes to top
      setResults(prev => {
        const newArr = [...prev];
        // Simple shuffle logic to "animate" sorting or just force sort
        const mySiteIdx = newArr.findIndex(x => x.mySite);
        if (mySiteIdx > 0) {
          // Move up one spot
          [newArr[mySiteIdx], newArr[mySiteIdx - 1]] = [
            newArr[mySiteIdx - 1],
            newArr[mySiteIdx],
          ];
          return newArr;
        } else {
          // If already top, move to bottom to restart loop animation eventually?
          // Or keep it there. Let's restart to loop animation for effect
          const item = newArr.shift();
          if (item) newArr.push(item);
          return newArr;
        }
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-muted/30 relative flex h-full w-full flex-col overflow-hidden p-6">
      {/* Fake Google Search Bar */}
      <div className="bg-background border-border mx-auto mb-6 flex w-full max-w-sm items-center gap-3 rounded-full border px-4 py-3 shadow-sm">
        <Search size={16} className="text-muted-foreground" />
        <div className="text-muted-foreground typing-effect text-sm">
          best pashmina kathmandu
        </div>
      </div>

      <div className="mx-auto w-full max-w-sm space-y-3">
        <AnimatePresence>
          {results.map(res => (
            <motion.div
              layout
              key={res.id}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex flex-col gap-1 rounded-lg border p-4 shadow-sm ${res.mySite ? "bg-primary/5 border-primary/20 z-10" : "bg-background border-border"}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${res.mySite ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {res.mySite ? "N" : res.title.charAt(0)}
                </div>
                <span className="text-muted-foreground text-xs">{res.url}</span>
              </div>
              <div
                className={`text-sm font-medium ${res.mySite ? "text-primary" : "text-blue-600 underline"}`}
              >
                {res.title}
              </div>
              {res.mySite && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary mt-1 flex items-center gap-1 text-[10px] font-bold"
                >
                  <TrendingUp size={10} /> SEO Optimized
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SeoAnimation;
