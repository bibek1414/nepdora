import React from "react";
import { DIMENSIONS } from "./video-config";

interface VideoEmbedProps {
  platform: string;
  id: string;
  embedUrl: string | null;
  title: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  platform,
  id,
  embedUrl,
  title,
}) => {
  if (!embedUrl) return null;

  const baseProps = {
    src: embedUrl,
    title,
    className: "h-full w-full",
    style: {
      width: `${DIMENSIONS.EMBED.WIDTH}px`,
      height: `${DIMENSIONS.EMBED.HEIGHT}px`,
    },
    allowFullScreen: true,
  };

  switch (platform) {
    case "youtube":
      return (
        <iframe
          {...baseProps}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      );

    case "tiktok":
      return (
        <div
          className="flex h-full w-full items-center justify-center bg-black"
          style={{
            width: DIMENSIONS.EMBED.WIDTH,
            height: DIMENSIONS.EMBED.HEIGHT,
          }}
        >
          <blockquote
            className="tiktok-embed"
            cite={embedUrl}
            data-video-id={id}
            style={{
              maxWidth: "100%",
              minWidth: "100%",
              width: "100%",
              height: "100%",
              margin: 0,
            }}
          >
            <section></section>
          </blockquote>
        </div>
      );

    case "instagram":
      return (
        <iframe
          {...baseProps}
          style={{ ...baseProps.style, border: "none" }}
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
        />
      );

    case "facebook":
      return (
        <iframe
          {...baseProps}
          style={{ ...baseProps.style, border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />
      );

    default:
      return null;
  }
};
