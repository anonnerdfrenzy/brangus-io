import Link from "next/link";

type Talk = {
  show: string;
  title: string;
  summary: string;
  href: string;
  image: string;
};

type Stream = {
  date: string;
  title: string;
  href: string;
};

const streams: Stream[] = [
  {
    date: "May 18",
    title: "Good mornin' folk. Let's try some shit.",
    href: "https://x.com/i/broadcasts/1rGmqoMpDMBGy",
  },
  {
    date: "May 17",
    title: "Branguphiles Of The World, Rise Up!",
    href: "https://x.com/i/broadcasts/1qJVmQqzDewGB",
  },
  {
    date: "May 16",
    title: "Good Morning again, Branguphiles",
    href: "https://x.com/i/broadcasts/1RJjpzZWbnaKw",
  },
  {
    date: "May 16",
    title: "Good Morning, Branguphiles",
    href: "https://x.com/i/broadcasts/1mGPaLknXkZJN",
  },
  {
    date: "May 15",
    title: "Singing a bit before heading off; working on a new song",
    href: "https://x.com/i/broadcasts/1NGaraNjBRnJj",
  },
  {
    date: "May 15",
    title: "Morning Roguelikes And Maybe Breakfast",
    href: "https://x.com/i/broadcasts/1MKgNgeovrXxL",
  },
  {
    date: "May 14",
    title: "Cyber Punk 2077, let's have brain sex",
    href: "https://x.com/i/broadcasts/1qJVmQBpjbYGB",
  },
  {
    date: "May 14",
    title: "Slay The Spire 2 w Brangus (until dinner)",
    href: "https://x.com/i/broadcasts/1AxRnakmQRkxl",
  },
  {
    date: "May 14",
    title: "sad brangus w guitar in his room (better audio quality)",
    href: "https://x.com/i/broadcasts/1yxBeMoZBzpJN",
  },
];

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
        <p className="font-mono text-sm text-white/40 mb-12">Podcasts, conversations, and live streams from @ratorthodox on X</p>

        <h2 className="text-2xl font-bold mb-6">Podcasts</h2>
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

        <h2 className="text-2xl font-bold mt-16 mb-2">Streams</h2>
        <p className="font-mono text-xs text-white/40 mb-6">
          Live on{" "}
          <a
            href="https://x.com/ratorthodox"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white underline underline-offset-4 transition-colors"
          >
            @ratorthodox
          </a>
          . Replays available on X for a few days after each broadcast.
        </p>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {streams.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline gap-4 py-3 group hover:text-white transition-colors"
              >
                <time className="font-mono text-xs text-white/30 shrink-0 w-16">{s.date}</time>
                <span className="text-sm text-white/70 group-hover:text-white transition-colors flex-1">
                  {s.title}
                </span>
                <span className="font-mono text-xs text-white/30 group-hover:text-white/60 transition-colors">
                  Watch &rarr;
                </span>
              </a>
            </li>
          ))}
        </ul>
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
