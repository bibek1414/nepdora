import React, { useState, useRef } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import {
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
} from "@/types/owner-site/components/youtube";
import { YouTubeVideo } from "@/types/owner-site/admin/youtube";

interface YouTubeCard2Props {
  videos: YouTubeVideo[];
}

export const YouTubeCard2: React.FC<YouTubeCard2Props> = ({ videos }) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {videos.length > 1 && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </>
      )}

      {/* Video Carousel */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map(video => {
          const videoId = extractYouTubeVideoId(video.url);
          if (!videoId) return null;

          const isPlaying = playingVideo === videoId;

          return (
            <div key={video.id} className="group flex-shrink-0">
              <div className="w-80 overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="relative aspect-video">
                  {isPlaying ? (
                    <iframe
                      src={getYouTubeEmbedUrl(videoId, true)}
                      title={video.title || "YouTube video"}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={getYouTubeThumbnail(videoId, "high")}
                        alt={video.title || "YouTube video thumbnail"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <button
                        onClick={() => handlePlayVideo(videoId)}
                        className="absolute inset-0 flex items-center justify-center transition-transform hover:scale-110"
                        aria-label="Play video"
                      >
                        <div className="rounded-full bg-red-600 p-3 shadow-lg transition-all hover:scale-110 hover:bg-red-700">
                          <Play
                            className="h-6 w-6 text-white"
                            fill="currentColor"
                          />
                        </div>
                      </button>
                    </>
                  )}
                </div>

                {(video.title || video.description) && (
                  <div className="p-4">
                    {video.title && (
                      <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900">
                        {video.title}
                      </h3>
                    )}
                    {video.description && (
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {video.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
