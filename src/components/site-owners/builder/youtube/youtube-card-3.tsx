import React, { useState } from "react";
import { Play, Clock } from "lucide-react";
import {
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
} from "@/types/owner-site/components/youtube";
import { YouTubeVideo } from "@/types/owner-site/admin/youtube";
interface YouTubeCard3Props {
  videos: YouTubeVideo[];
}

export const YouTubeCard3: React.FC<YouTubeCard3Props> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(
    videos.length > 0 ? videos[0] : null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  if (videos.length === 0 || !selectedVideo) {
    return <div className="text-center text-gray-500">No videos available</div>;
  }

  const selectedVideoId = extractYouTubeVideoId(selectedVideo.url);
  if (!selectedVideoId) return null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Main Video Player */}
      <div className="flex-1">
        <div className="overflow-hidden rounded-xl bg-black shadow-lg">
          <div className="relative aspect-video">
            {isPlaying ? (
              <iframe
                src={getYouTubeEmbedUrl(selectedVideoId, true)}
                title={selectedVideo.title || "YouTube video"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={getYouTubeThumbnail(selectedVideoId, "maxres")}
                  alt={selectedVideo.title || "YouTube video thumbnail"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <button
                  onClick={handlePlayVideo}
                  className="absolute inset-0 flex items-center justify-center transition-transform hover:scale-105"
                  aria-label="Play video"
                >
                  <div className="rounded-full bg-red-600 p-6 shadow-xl transition-all hover:scale-110 hover:bg-red-700">
                    <Play
                      className="h-10 w-10 text-white"
                      fill="currentColor"
                    />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Video Details */}
        <div className="mt-4">
          {selectedVideo.title && (
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              {selectedVideo.title}
            </h3>
          )}
          {selectedVideo.description && (
            <p className="leading-relaxed text-gray-600">
              {selectedVideo.description}
            </p>
          )}
        </div>
      </div>

      {/* Video Playlist */}
      <div className="w-full lg:w-80">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">
              Playlist ({videos.length} videos)
            </h4>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto">
            {videos.map((video, index) => {
              const videoId = extractYouTubeVideoId(video.url);
              if (!videoId) return null;

              const isSelected = selectedVideo.id === video.id;

              return (
                <button
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`flex w-full gap-3 rounded-lg p-3 text-left transition-all hover:bg-white hover:shadow-sm ${
                    isSelected
                      ? "bg-white shadow-sm ring-2 ring-blue-500"
                      : "bg-transparent"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={getYouTubeThumbnail(videoId, "default")}
                      alt={video.title || "Video thumbnail"}
                      className="h-16 w-24 rounded object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/60 p-1">
                        <Play
                          className="h-3 w-3 text-white"
                          fill="currentColor"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start gap-2">
                      <span className="text-xs font-medium text-gray-500">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        {video.title && (
                          <h5
                            className={`line-clamp-2 text-sm font-medium ${
                              isSelected ? "text-blue-600" : "text-gray-900"
                            }`}
                          >
                            {video.title}
                          </h5>
                        )}
                        {video.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
