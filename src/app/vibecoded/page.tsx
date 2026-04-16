import Link from "next/link";

type App = {
  title: string;
  description: string;
  href: string;
  video?: string;
  image?: string;
  beta?: boolean;
  badges?: string[];
  download?: { dmgUrl: string; releaseUrl: string };
};

const apps: App[] = [
  {
    title: "FST Explorer",
    description:
      "Draw a fractal seed and iterate it; every line segment gets replaced by a copy of your drawing. Create Koch curves, Lévy C curves, and your own fractal patterns.",
    href: "/simulations/fractal-seed.html",
    video: "/simulations/fst-preview.mp4",
  },
  {
    title: "affirmr",
    description:
      "For when your partner's love language is words of affirmation, and you go quiet under stress. Describe the moment, get specific, genuine things to say.",
    href: "/affirmr",
    image: "/affirmr/preview.png",
    beta: true,
  },
  {
    title: "Todor",
    description:
      "A todo list manager for ADHD brains. Mac only and open source (MIT). Everything is keyboard-driven (Cmd+K shows every command). Built-in Pomodoro cycles. The todo you're supposed to be working on stays pinned to your menu bar, even when you tab away to anything else, so you can glance up and remember what you're doing. Includes a one-click setup so Claude Code can read, add, edit, and set due dates on your todos for you.",
    href: "https://github.com/anonnerdfrenzy/todor/releases/latest",
    image: "/todor/preview.png",
    badges: ["mac only", "open source"],
    download: {
      dmgUrl: "https://github.com/anonnerdfrenzy/todor/releases/latest/download/Todor.dmg",
      releaseUrl: "https://github.com/anonnerdfrenzy/todor/releases/latest",
    },
  },
];

export default function SimulationsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
            &larr; <img src="/raccoon.svg" alt="" className="w-4 h-4" />brangus.io
          </Link>
          <span className="font-mono text-xs text-white/40">vibecoded apps</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Vibecoded Apps</h1>
        <p className="font-mono text-sm text-white/40 mb-12">Small tools, interactive toys, explorable explanations</p>

        <div className="space-y-6">
          {apps.map((sim) => {
            const media = (
              <>
                {sim.video && (
                  <video
                    src={sim.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full aspect-video object-cover"
                  />
                )}
                {!sim.video && sim.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sim.image}
                    alt=""
                    className="w-full aspect-video object-cover object-top"
                  />
                )}
              </>
            );

            const heading = (
              <h3 className="text-xl font-bold mb-2 transition-colors flex items-center gap-2 flex-wrap">
                {sim.title}
                {sim.beta && (
                  <span className="text-[10px] uppercase tracking-widest font-mono font-normal text-white/40 border border-white/20 rounded-full px-2 py-0.5">
                    beta
                  </span>
                )}
                {(sim.badges ?? []).map((b) => (
                  <span
                    key={b}
                    className="text-[10px] uppercase tracking-widest font-mono font-normal text-white/40 border border-white/20 rounded-full px-2 py-0.5"
                  >
                    {b}
                  </span>
                ))}
              </h3>
            );

            if (sim.download) {
              return (
                <div
                  key={sim.title}
                  className="block border border-white/10 rounded-lg overflow-hidden"
                >
                  {media}
                  <div className="p-6">
                    {heading}
                    <p className="text-white/50 font-mono text-sm leading-relaxed">{sim.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={sim.download.dmgUrl}
                        download
                        className="inline-block font-mono text-xs px-4 py-2 rounded border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
                      >
                        Download .dmg
                      </a>
                      <a
                        href={sim.download.releaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-mono text-xs px-4 py-2 rounded border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                      >
                        View release on GitHub &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={sim.title}
                href={sim.href}
                {...(sim.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="block group border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-colors"
              >
                {media}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-white/80 transition-colors flex items-center gap-2">
                    {sim.title}
                    {sim.beta && (
                      <span className="text-[10px] uppercase tracking-widest font-mono font-normal text-white/40 border border-white/20 rounded-full px-2 py-0.5">
                        beta
                      </span>
                    )}
                  </h3>
                  <p className="text-white/50 font-mono text-sm leading-relaxed">{sim.description}</p>
                  <span className="inline-block mt-4 font-mono text-xs text-white/30 group-hover:text-white/50 transition-colors">
                    Launch &rarr;
                  </span>
                </div>
              </a>
            );
          })}
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
