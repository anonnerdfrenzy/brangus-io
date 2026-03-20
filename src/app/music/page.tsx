import Link from "next/link";

const tracks = [
  {
    title: "E-Girl Aella (Single)",
    file: "/music/e-girl-aella.mp3",
    image: "/music/e-girl-aella.jpg",
    spotify: "https://open.spotify.com/track/65FAKqseKAYOFOdDWfXJRV",
    soundcloud: "https://soundcloud.com/brangusbrangus/e-girl-aella-single",
  },
  {
    title: "Heart Meal",
    file: "/music/heart-meal.mp3",
    image: "/music/heart-meal.jpg",
    spotify: "https://open.spotify.com/track/0zHU8TFfJbheAHvR7OqtLo",
    soundcloud: "https://soundcloud.com/brangusbrangus/heart-meal",
  },
  {
    title: "Storm Warnings (Demo)",
    file: "/music/storm-warnings.mp3",
    image: "/music/storm-warnings.png",
    spotify: undefined as string | undefined,
    soundcloud: "https://soundcloud.com/brangusbrangus/storm-warnings-demo",
  },
];

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
            &larr; <img src="/raccoon.svg" alt="" className="w-4 h-4" />brangus.io
          </Link>
          <span className="font-mono text-xs text-white/40">music</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">Music</h1>
          <a
            href="https://soundcloud.com/brangusbrangus"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-white/60 hover:text-white underline underline-offset-4 transition-colors"
          >
            SoundCloud
          </a>
        </div>
        <p className="font-mono text-sm text-white/40 mb-12">
          from{" "}
          <a
            href="https://soundcloud.com/brangusbrangus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white underline underline-offset-4 transition-colors"
          >
            soundcloud.com/brangusbrangus
          </a>
        </p>

        <div className="space-y-10">
          {tracks.map((track) => (
            <div key={track.file} className="border-l border-white/20 pl-6">
              <div className="flex gap-5 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={track.image} alt={track.title} className="w-48 h-48 object-cover rounded flex-shrink-0" />
                <div className="flex flex-col justify-center min-w-0">
                  <h2 className="text-lg font-bold">{track.title}</h2>
                </div>
              </div>
              <audio controls preload="metadata" className="w-full mb-3" style={{ filter: "invert(1)" }}>
                <source src={track.file} type="audio/mpeg" />
              </audio>
              <div className="flex gap-4">
                {track.spotify && (
                  <a
                    href={track.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-white/40 hover:text-white transition-colors"
                  >
                    Spotify
                  </a>
                )}
                <a
                  href={track.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-white/40 hover:text-white transition-colors"
                >
                  SoundCloud
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-3xl mx-auto flex justify-between">
          <span className="font-mono text-xs text-white/30 flex items-center gap-1.5"><img src="/raccoon.svg" alt="" className="w-4 h-4" />brangus.io</span>
          <span className="font-mono text-xs text-white/30">2026</span>
        </div>
      </footer>
    </div>
  );
}
