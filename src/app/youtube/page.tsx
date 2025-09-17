"use client";
import React from "react";
import { useYouTubeVideos } from "@/hooks/owner-site/admin/use-youtube";

const getEmbedUrl = (url: string) => {
  const videoId = url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${videoId}`;
};

const YouTubeGrid: React.FC = () => {
  const { data: videos, isLoading, error } = useYouTubeVideos();

  if (isLoading) return <p>Loading videos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {videos?.map(video => (
        <div
          key={video.id}
          className="aspect-video w-full overflow-hidden rounded-2xl shadow-md"
        >
          <iframe
            src={getEmbedUrl(video.url)}
            title={`YouTube video ${video.id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          ></iframe>
        </div>
      ))}
    </div>
  );
};

export default YouTubeGrid;
