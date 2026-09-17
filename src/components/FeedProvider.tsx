"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { posts as initialPosts, type Post } from "@/data/feed";

type FeedContextValue = {
  posts: Post[];
  addPost: (post: Post) => void;
};

const FeedContext = createContext<FeedContextValue | null>(null);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  function addPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <FeedContext.Provider value={{ posts, addPost }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
}
