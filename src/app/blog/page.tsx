import Parser from "rss-parser";
import Link from "next/link";

type Post = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  creator: string;
};

async function getPosts(): Promise<Post[]> {
  const parser = new Parser();
  const feed = await parser.parseURL("https://ratorthodox.substack.com/feed");
  return (feed.items ?? []).map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    pubDate: item.pubDate ?? "",
    contentSnippet: item.contentSnippet?.slice(0, 200) ?? "",
    creator: item.creator ?? "",
  }));
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-white/40 hover:text-white transition-colors">
            &larr; brangus.io
          </Link>
          <span className="font-mono text-xs text-white/40">blog</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Writing</h1>
        <p className="font-mono text-sm text-white/40 mb-16">
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

        <div className="space-y-12">
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
                className="block group border-l border-white/20 pl-6 hover:border-white/60 transition-colors"
              >
                <time className="font-mono text-xs text-white/30 block mb-2">
                  {dateStr}
                </time>
                <h2 className="text-xl font-bold mb-2 group-hover:text-white/80 transition-colors">
                  {post.title}
                </h2>
                <p className="font-mono text-sm text-white/40 leading-relaxed">
                  {post.contentSnippet}...
                </p>
              </a>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-3xl mx-auto flex justify-between">
          <span className="font-mono text-xs text-white/30">brangus.io</span>
          <span className="font-mono text-xs text-white/30">2026</span>
        </div>
      </footer>
    </div>
  );
}
