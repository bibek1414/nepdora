import React, { useState } from "react";
import { Play } from "lucide-react";
import {
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
} from "@/types/owner-site/components/youtube";
import { YouTubeVideo } from "@/types/owner-site/admin/youtube";
interface YouTubeCard1Props {
  videos: YouTubeVideo[];
}

export const YouTubeCard1: React.FC<YouTubeCard1Props> = ({ videos }) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map(video => {
        const videoId = extractYouTubeVideoId(video.url);
        if (!videoId) return null;

        const isPlaying = playingVideo === videoId;

        return (
          <div
            key={video.id}
            className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
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
                  <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
                  <button
                    onClick={() => handlePlayVideo(videoId)}
                    className="absolute inset-0 flex items-center justify-center transition-transform hover:scale-110"
                    aria-label="Play video"
                  >
                    <div className="rounded-full bg-red-600 p-4 shadow-lg transition-colors hover:bg-red-700">
                      <Play
                        className="h-8 w-8 text-white"
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
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                    {video.title}
                  </h3>
                )}
                {video.description && (
                  <p className="line-clamp-3 text-sm text-gray-600">
                    {video.description}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
