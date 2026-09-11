import Link from "next/link";
import { badgeByType, type Post } from "@/data/feed";

export function PostCard({ post }: { post: Post }) {
  const badge = badgeByType[post.type];
  const authorName =
    post.author.kind === "child" ? post.author.name : "Anuncio general";

  return (
    <article className="bg-[#FFFDF9] border border-[#ECE0D0] rounded-[20px] px-[22px] py-[20px] shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <header className="flex items-center gap-[12px] mb-[14px]">
        {post.author.kind === "child" ? (
          <div
            className="w-[44px] h-[44px] rounded-full font-display font-semibold text-[17px] flex items-center justify-center shrink-0"
            style={{
              backgroundColor: post.author.avatarBg,
              color: post.author.avatarColor,
            }}
          >
            {post.author.initial}
          </div>
        ) : (
          <div className="w-[44px] h-[44px] rounded-full bg-[#CCD8F4] text-[#4E72C8] flex items-center justify-center shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <div className="font-display font-semibold text-[16.5px] text-[#3F362E]">
            {authorName}
          </div>
          <div className="text-[12.5px] text-[#A89A8B]">
            {post.time} · publicado por vos
          </div>
        </div>
        <div
          className="flex items-center gap-[7px] px-[12px] py-[6px] rounded-full"
          style={{ backgroundColor: badge.bg }}
        >
          <span
            className="w-[8px] h-[8px] rounded-full"
            style={{ backgroundColor: badge.color }}
          />
          <span
            className="text-[12px] font-extrabold tracking-[.5px]"
            style={{ color: badge.color }}
          >
            {badge.label}
          </span>
        </div>
      </header>

      <div className="text-[12.5px] text-[#A89A8B] mb-[10px]">
        Para: {post.recipient}
      </div>
      <p className="text-[15.5px] leading-[1.55] text-[#4A4038]">{post.body}</p>

      {post.photo && (
        <Link
          href="#"
          className="flex flex-col items-center justify-center gap-[8px] mt-[14px] border-[1.5px] border-dashed border-[#DBCDBA] rounded-[16px] bg-[#F4ECE1] h-[200px] text-[#B0A290]"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
          </svg>
          <span className="text-[13.5px]">{post.photo.label}</span>
        </Link>
      )}

      <footer className="flex items-center gap-[18px] mt-[16px] pt-[14px] border-t border-[#F0E6D8]">
        <span className="flex items-center gap-[7px] text-[#E0654A] font-bold text-[14px]">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="#E0654A"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          {post.likes}
        </span>
        <Link
          href="#"
          className="flex items-center gap-[7px] text-[#94887B] font-bold text-[14px]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
          </svg>
          {post.comments}
        </Link>
        <span className="flex-1" />
        <Link href="#" className="text-[#C5503A] font-extrabold text-[14px]">
          Editar
        </Link>
      </footer>
    </article>
  );
}
