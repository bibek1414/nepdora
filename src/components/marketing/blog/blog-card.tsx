import { BlogPost } from "@/types/super-admin/blog";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogCard({ post, className = "" }: BlogCardProps) {
  const formattedDate = new Date(post.created_at);
  const formattedDateString = format(formattedDate, "dd MMM yyyy");

  const authorName =
    post.author?.first_name && post.author?.last_name
      ? `${post.author.first_name} ${post.author.last_name}`
      : post.author?.username || "Team Nepdora";
  const authorAvatar = "https://avatars.githubusercontent.com/u/57863199?v=4";

  return (
    <div className={`group flex h-full flex-col ${className}`}>
      {/* Post Image Section - Separate */}
      <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Link href={`/blog/${post.slug}`}>
          <Image unoptimized
            src={post.thumbnail_image || "/fallback/image-not-found.png"}
            alt={post.thumbnail_image_alt_description || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Post Content Section - Separate */}
      <div className="flex grow flex-col">
        {/* Date and Reading Time */}
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
          <span>{formattedDateString}</span>
          <span>•</span>
          <span>{post.time_to_read || "7"} min</span>
        </div>

        {/* Title */}
        <h3 className="text-md mb-4 line-clamp-2 cursor-pointer font-semibold text-black transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Author Footer */}
        <div className="mt-auto flex items-center gap-3">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image unoptimized
              src={authorAvatar}
              alt={authorName}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-gray-600">{authorName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
