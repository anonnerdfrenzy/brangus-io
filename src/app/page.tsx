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
          <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-16 font-mono">
            Projects
          </h2>

          <div className="space-y-16">
            <div className="border-l border-white/20 pl-6">
              <h3 className="text-2xl font-bold mb-2">Signal / Noise</h3>
              <p className="text-white/50 font-mono text-sm">Data visualization experiments</p>
            </div>

            <div className="border-l border-white/20 pl-6">
              <h3 className="text-2xl font-bold mb-2">Chromatic</h3>
              <p className="text-white/50 font-mono text-sm">Interactive color theory playground</p>
            </div>

            <div className="border-l border-white/20 pl-6">
              <h3 className="text-2xl font-bold mb-2">Typeface Arena</h3>
              <p className="text-white/50 font-mono text-sm">Side-by-side font comparisons</p>
            </div>

            <div className="border-l border-white/20 pl-6">
              <h3 className="text-2xl font-bold mb-2">Pulse</h3>
              <p className="text-white/50 font-mono text-sm">Real-time audio visualizer</p>
            </div>
          </div>
        </div>

        <footer className="border-t border-white/10 py-8 px-6">
          <div className="max-w-3xl mx-auto flex justify-between">
            <span className="font-mono text-xs text-white/30">brangus.io</span>
            <span className="font-mono text-xs text-white/30">2026</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
