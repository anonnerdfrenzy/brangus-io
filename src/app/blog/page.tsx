import Parser from "rss-parser";
import Link from "next/link";

type Post = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  image: string;
  likes: number;
};

// Popularity order from Substack archive sorted by top
const POPULARITY_ORDER: Record<string, number> = {
  "brangus's 10 rules for sleeping with women": 1,
  "i had sex with my brother's wife when i was thirteen": 2,
  "how to vape on planes without getting caught": 3,
  "i stopped going to school in fifth grade and i don't regret it": 4,
  "predeployment interview excerpt — jan 12, 2029": 5,
  "is buying dinner for women defecting against other men?": 6,
  "ask \"why do you believe that?\" not \"do you have any evidence?\"": 7,
  "brangus's advice for making the most out of inkhaven 2": 8,
  "i regret to inform you that exist takes two inputs": 9,
  "you would probably punish hitler even if nobody would find out if you didn't": 10,
  "\"burden of proof\" is a weird concept": 11,
  "an apology on behalf of fools for the detail oriented": 12,
};

const LIKES: Record<string, number> = {
  "brangus's 10 rules for sleeping with women": 538,
  "i had sex with my brother's wife when i was thirteen": 333,
  "how to vape on planes without getting caught": 134,
  "i stopped going to school in fifth grade and i don't regret it": 52,
  "predeployment interview excerpt — jan 12, 2029": 48,
  "is buying dinner for women defecting against other men?": 29,
  "ask \"why do you believe that?\" not \"do you have any evidence?\"": 24,
  "brangus's advice for making the most out of inkhaven 2": 18,
  "i regret to inform you that exist takes two inputs": 13,
  "an apology on behalf of fools for the detail oriented": 14,
  "you would probably punish hitler even if nobody would find out if you didn't": 9,
  "\"burden of proof\" is a weird concept": 8,
  "insight into injunction-like cognitive tech often undermines the tech, but you should use it anyway": 7,
};

async function getPosts(): Promise<Post[]> {
  const parser = new Parser({
    customFields: {
      item: [["enclosure", "enclosure", { keepArray: false }]],
    },
  });
  const feed = await parser.parseURL("https://ratorthodox.substack.com/feed");

  const posts = (feed.items ?? []).map((item) => {
    const title = item.title ?? "";
    const key = title.toLowerCase().trim();
    return {
      title,
      link: item.link ?? "",
      pubDate: item.pubDate ?? "",
      contentSnippet: item.contentSnippet?.slice(0, 150) ?? "",
      image: (item.enclosure as { url?: string })?.url ?? "",
      likes: LIKES[key] || 0,
    };
  });

  // Sort by popularity order, unknown posts go to end
  posts.sort((a, b) => {
    const oa = POPULARITY_ORDER[a.title.toLowerCase().trim()] ?? 999;
    const ob = POPULARITY_ORDER[b.title.toLowerCase().trim()] ?? 999;
    return oa - ob;
  });

  return posts;
}

export const revalidate = 3600; // revalidate every hour

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-white/40 hover:text-white transition-colors">
            &larr; brangus.io
          </Link>
          <span className="font-mono text-xs text-white/40">blog</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">Writing</h1>
          <a
            href="https://ratorthodox.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-white/60 hover:text-white underline underline-offset-4 transition-colors"
          >
            Subscribe
          </a>
        </div>
        <p className="font-mono text-sm text-white/40 mb-12">
          from{" "}
          <a
            href="https://ratorthodox.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white underline underline-offset-4 transition-colors"
          >
            ratorthodox.substack.com
          </a>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => {
            const date = new Date(post.pubDate);
            const dateStr = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-white/10 hover:border-white/30 transition-colors"
              >
                {post.image && (
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-40 object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <time className="font-mono text-[10px] text-white/30">
                      {dateStr}
                    </time>
                    {post.likes > 0 && (
                      <span className="font-mono text-[10px] text-white/30">
                        ♥ {post.likes}
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-bold leading-tight group-hover:text-white/80 transition-colors">
                    {post.title}
                  </h2>
                  <p className="font-mono text-[11px] text-white/30 leading-relaxed mt-2 line-clamp-3">
                    {post.contentSnippet}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-5xl mx-auto flex justify-between">
          <span className="font-mono text-xs text-white/30">brangus.io</span>
          <span className="font-mono text-xs text-white/30">2026</span>
        </div>
      </footer>
    </div>
  );
}
