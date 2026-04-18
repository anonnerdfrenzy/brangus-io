import Link from "next/link";

type Talk = {
  show: string;
  title: string;
  summary: string;
  href: string;
  image: string;
};

const talks: Talk[] = [
  {
    show: "Mutual Understanding",
    title: "Robin Hanson & Ronny Fernandez on AI (hosted by Divia Eden)",
    summary:
      "Robin argues that AI progress is continuous with the broader arc of civilizational progress. Ronny pushes on what that means for timelines and what we should actually expect.",
    href: "https://www.youtube.com/watch?v=G-fBdPnwFrI",
    image: "/talking/youtube-hanson.jpg",
  },
  {
    show: "ClearerThinking.org Podcast",
    title: "Moral Discourse and the Value of Philosophy",
    summary:
      "With Spencer Greenberg: normative hedonism, whether we can care about things beyond conscious experience, what's broken about moral discourse, and whether philosophy ever actually makes progress.",
    href: "https://podcast.clearerthinking.org/episode/032/ronny-fernandez-moral-discourse-and-the-value-of-philosophy/",
    image: "/talking/clearer-thinking.png",
  },
  {
    show: "SlutStack Podcast",
    title: "Ep 28: Scary Man",
    summary:
      "Wide-ranging conversation on dating, long-term relationships, polyamory discourse, and what it takes to be an extraordinary lover.",
    href: "https://substack.com/home/post/p-194458472",
    image: "/talking/slutstack.jpg",
  },
];

export default function TalkingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
            &larr; <img src="/raccoon.svg" alt="" className="w-4 h-4" />brangus.io
          </Link>
          <span className="font-mono text-xs text-white/40">talking</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Talking</h1>
        <p className="font-mono text-sm text-white/40 mb-12">Podcasts and conversations I&apos;ve shown up on</p>

        <div className="space-y-6">
          {talks.map((t) => (
            <a
              key={t.href}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image}
                alt=""
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
                  {t.show}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white/80 transition-colors">
                  {t.title}
                </h3>
                <p className="text-white/50 font-mono text-sm leading-relaxed">{t.summary}</p>
                <span className="inline-block mt-4 font-mono text-xs text-white/30 group-hover:text-white/50 transition-colors">
                  Listen &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-3xl mx-auto flex justify-between">
          <span className="font-mono text-xs text-white/30 flex items-center gap-1.5">
            <img src="/raccoon.svg" alt="" className="w-4 h-4" />brangus.io
          </span>
          <span className="font-mono text-xs text-white/30">2026</span>
        </div>
      </footer>
    </div>
  );
}
