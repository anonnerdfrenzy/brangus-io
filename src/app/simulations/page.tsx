import Link from "next/link";

type App = {
  title: string;
  description: string;
  href: string;
  video?: string;
  image?: string;
  beta?: boolean;
};

const apps: App[] = [
  {
    title: "affirmr",
    description:
      "For when your partner's love language is words of affirmation — and you go quiet under stress. Describe the moment, get specific, genuine things to say.",
    href: "/affirmr",
    image: "/affirmr/preview.png",
    beta: true,
  },
  {
    title: "FST Explorer",
    description:
      "Draw a fractal seed and iterate it — every line segment gets replaced by a copy of your drawing. Create Koch curves, Lévy C curves, and your own fractal patterns.",
    href: "/simulations/fractal-seed.html",
    video: "/simulations/fst-preview.mp4",
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
          {apps.map((sim) => (
            <a
              key={sim.title}
              href={sim.href}
              className="block group border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-colors"
            >
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
