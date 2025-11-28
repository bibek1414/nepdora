import React from "react";
import { Play } from "lucide-react";
import {
  extractVideoInfo,
  getVideoThumbnail,
  getVideoEmbedUrl,
} from "@/lib/video-utils";
import { Video } from "@/types/owner-site/admin/videos";
import { VideoEmbed } from "./video-embed";
import { DIMENSIONS, PLATFORM_CONFIG } from "./video-config";

interface VideoCardProps {
  video: Video;
  isPlaying: boolean;
  onPlay: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isPlaying,
  onPlay,
}) => {
  const { platform, id } = extractVideoInfo(video.url);
  if (!id) return null;

  const thumbnail = getVideoThumbnail(platform, id);
  const embedUrl = getVideoEmbedUrl(platform, id, video.url);
  const platformInfo = PLATFORM_CONFIG[platform];
  const PlatformIcon = platformInfo.icon;
  const showEmbedDirectly = ["tiktok", "instagram", "facebook"].includes(
    platform
  );

  return (
    <div className="group flex-shrink-0">
      <div
        className="overflow-hidden rounded-3xl bg-white p-3 transition-all duration-300"
        style={{ width: DIMENSIONS.CARD.WIDTH }}
      >
        <div
          className="relative overflow-hidden rounded-2xl bg-black"
          style={{
            width: DIMENSIONS.THUMBNAIL.WIDTH,
            height: DIMENSIONS.THUMBNAIL.HEIGHT,
          }}
        >
          {showEmbedDirectly || (isPlaying && embedUrl) ? (
            <VideoEmbed
              platform={platform}
              id={id}
              embedUrl={embedUrl}
              title={video.title || "Video"}
            />
          ) : (
            <VideoThumbnail
              video={video}
              thumbnail={thumbnail}
              platformInfo={platformInfo}
              PlatformIcon={PlatformIcon}
              onPlay={onPlay}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface VideoThumbnailProps {
  video: Video;
  thumbnail: string | null;
  platformInfo: (typeof PLATFORM_CONFIG)[keyof typeof PLATFORM_CONFIG];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PlatformIcon: React.ComponentType<any>;
  onPlay: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  video,
  thumbnail,
  platformInfo,
  PlatformIcon,
  onPlay,
}) => {
  return (
    <>
      {thumbnail ? (
        <div className="relative h-full w-full">
          <img
            src={thumbnail}
            alt={video.title || "Video thumbnail"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <div
              className={`flex items-center gap-1.5 rounded-full ${platformInfo.color} px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm`}
            >
              <PlatformIcon className="h-3.5 w-3.5" />
              <span>{platformInfo.name}</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative h-full w-full bg-gradient-to-br ${platformInfo.gradient}`}
        >
          <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
            <div
              className={`mb-4 rounded-full ${platformInfo.color} p-6 shadow-xl`}
            >
              <PlatformIcon className="h-10 w-10 text-white" />
            </div>
            <span className="mb-3 text-xl font-bold text-white">
              {platformInfo.name}
            </span>
            {video.title && (
              <span className="mb-3 line-clamp-2 text-sm font-medium text-gray-200">
                {video.title}
              </span>
            )}
            <span className="text-xs text-gray-300">Tap to play</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <button
        onClick={onPlay}
        className="absolute inset-0 flex items-center justify-center transition-all duration-300 hover:scale-105"
        aria-label="Play video"
      >
        <div className="rounded-full bg-white/25 p-5 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/35">
          <Play
            className="h-10 w-10 text-white drop-shadow-lg"
            fill="currentColor"
          />
        </div>
      </button>

      <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
        {thumbnail && (
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-black/30 p-1 backdrop-blur-sm">
              <PlatformIcon className={`h-4 w-4 ${platformInfo.textColor}`} />
            </div>
            <span
              className={`text-xs font-semibold ${platformInfo.textColor} drop-shadow-md`}
            >
              {platformInfo.name}
            </span>
          </div>
        )}
        {video.title && (
          <h3 className="mb-1 line-clamp-2 text-sm font-bold text-white drop-shadow-md">
            {video.title}
          </h3>
        )}
        {video.description && (
          <p className="line-clamp-2 text-xs text-gray-200 drop-shadow-sm">
            {video.description}
          </p>
        )}
      </div>
    </>
  );
};
