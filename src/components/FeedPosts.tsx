"use client";

import { PostCard } from "@/components/PostCard";
import { useFeed } from "@/components/FeedProvider";

export function FeedPosts() {
  const { posts } = useFeed();

  return (
    <div className="flex flex-col gap-[16px]">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
