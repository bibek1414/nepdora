"use client";

import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";

interface BlogShareButtonsProps {
  url: string;
  title: string;
}

export const BlogShareButtons = ({ url, title }: BlogShareButtonsProps) => {
  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      <span className="text-sm text-gray-500">Share this blog:</span>
      <FacebookShareButton url={url} quote={title} hashtag={"#nepdora"}>
        <FacebookIcon size={27} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title} hashtags={["nepdora"]}>
        <TwitterIcon size={27} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title} summary={title}>
        <LinkedinIcon size={27} round />
      </LinkedinShareButton>
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={27} round />
      </WhatsappShareButton>
      <RedditShareButton url={url} title={title}>
        <RedditIcon size={27} round />
      </RedditShareButton>
      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={27} round />
      </TelegramShareButton>
    </div>
  );
};
