import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { extractVideoInfo } from "@/lib/video-utils";
import { Video } from "@/types/owner-site/admin/videos";
import { VideoCard } from "./videos-card";
import { DIMENSIONS } from "./video-config";

interface VideosCard1Props {
  videos: Video[];
}

export const VideosCard1: React.FC<VideosCard1Props> = ({ videos }) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  const scroll = (direction: "left" | "right") => {
    const scrollAmount =
      direction === "left" ? -DIMENSIONS.CARD.WIDTH : DIMENSIONS.CARD.WIDTH;
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const hasTikTokVideo = videos.some(video => {
      const { platform } = extractVideoInfo(video.url);
      return platform === "tiktok";
    });

    if (hasTikTokVideo) {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [videos]);

  return (
    <div className="relative py-8">
      {videos.length > 1 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/95 p-3 transition-all hover:scale-110 hover:bg-white"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/95 p-3 transition-all hover:scale-110 hover:bg-white"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto px-4 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map(video => {
          const { platform, id } = extractVideoInfo(video.url);
          const uniqueId = `${platform}-${id}`;
          const isPlaying = playingVideo === uniqueId;

          return (
            <VideoCard
              key={video.id}
              video={video}
              isPlaying={isPlaying}
              onPlay={() => handlePlayVideo(uniqueId)}
            />
          );
        })}
      </div>
    </div>
  );
};
