import Link from "next/link";
import PhysarumBackground from "./components/PhysarumBackground";

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Hero: slime mold section */}
      <section className="relative h-screen">
        <PhysarumBackground />
        {/* Bottom fade to signal scroll */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/40 animate-bounce" />
        </div>
      </section>

      {/* Content below */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <div className="space-y-16">
            <Link href="/blog" className="block group border-l border-white/20 pl-6 hover:border-white/60 transition-colors">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-white/80 transition-colors">Writing</h3>
              <p className="text-white/50 font-mono text-sm">Blog posts from ratorthodox.substack.com</p>
            </Link>

            <a
              href="https://x.com/ratorthodox"
              target="_blank"
              rel="noopener noreferrer"
              className="block group border-l border-white/20 pl-6 hover:border-white/60 transition-colors"
            >
              <h3 className="text-2xl font-bold mb-2 group-hover:text-white/80 transition-colors">Microwriting</h3>
              <p className="text-white/50 font-mono text-sm">@ratorthodox on X</p>
            </a>
          </div>
        </div>

        <footer className="border-t border-white/10 py-8 px-6">
          <div className="max-w-3xl mx-auto flex justify-between">
            <span className="font-mono text-xs text-white/30 flex items-center gap-1.5"><img src="/raccoon.svg" alt="" className="w-4 h-4" />brangus.io</span>
            <span className="font-mono text-xs text-white/30">2026</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
