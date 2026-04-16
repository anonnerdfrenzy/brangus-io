import Link from "next/link";
import type { Metadata } from "next";

const DMG_URL = "https://github.com/anonnerdfrenzy/todor/releases/latest/download/Todor.dmg";
const RELEASE_URL = "https://github.com/anonnerdfrenzy/todor/releases/latest";
const REPO_URL = "https://github.com/anonnerdfrenzy/todor";

export const metadata: Metadata = {
  title: "Todor",
  description:
    "A todo list manager for ADHD brains. Mac only and open source. Keyboard-driven, with built-in Pomodoro cycles and the current todo pinned to your menu bar.",
};

const features: { title: string; body: string }[] = [
  {
    title: "Always-visible focus",
    body:
      "The todo you're supposed to be working on stays pinned to your macOS menu bar alongside the Pomodoro countdown, so you can glance up from any app and remember what you're doing.",
  },
  {
    title: "Keyboard-first",
    body:
      "Cmd+K opens a command palette listing every action and its shortcut. Cmd+E to edit, Cmd+T to flag for today, Cmd+Shift+T for today-only view, Cmd+Shift+P to start a Pomodoro cycle.",
  },
  {
    title: "Built-in Pomodoros",
    body:
      "Configurable focus + break durations, auto-cycling, with the phase and time always visible in the menu bar. Notifications fire on every transition.",
  },
  {
    title: "Claude Code integration",
    body:
      "Help → Setup Claude Code copies a prompt that teaches Claude how to read, add, edit, and set due dates on your todos directly from any chat. Bundled CLI under the hood.",
  },
];

export default function TodorPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
            &larr; <img src="/raccoon.svg" alt="" className="w-4 h-4" />brangus.io
          </Link>
          <Link href="/vibecoded" className="font-mono text-xs text-white/40 hover:text-white transition-colors">
            vibecoded apps
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-10 flex items-start gap-6 flex-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/todor/icon.png"
            alt="Todor app icon"
            className="w-24 h-24 rounded-2xl shadow-lg shrink-0"
          />
          <div className="flex-1 min-w-[260px]">
            <h1 className="text-5xl font-bold mb-3 flex items-center gap-3 flex-wrap">
              Todor
              <span className="text-[10px] uppercase tracking-widest font-mono font-normal text-white/40 border border-white/20 rounded-full px-2 py-0.5">
                mac only
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono font-normal text-white/40 border border-white/20 rounded-full px-2 py-0.5">
                open source
              </span>
            </h1>
            <p className="text-white/60 font-mono text-sm leading-relaxed">
              A todo list manager for ADHD brains. Everything is keyboard-driven (Cmd+K shows every command). Built-in Pomodoro cycles. The todo you&rsquo;re supposed to be working on stays pinned to your menu bar so you can glance up and remember what you&rsquo;re doing. Includes a one-click setup so Claude Code can read, add, edit, and set due dates on your todos for you.
            </p>
          </div>
        </header>

        <div className="border border-white/10 rounded-lg overflow-hidden mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/todor/preview.png" alt="Todor app and menu bar showing the same task" className="w-full" />
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <a
            href={DMG_URL}
            download
            className="inline-block font-mono text-xs px-4 py-2 rounded border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
          >
            Download .dmg
          </a>
          <a
            href={RELEASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-mono text-xs px-4 py-2 rounded border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            View release on GitHub &rarr;
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-mono text-xs px-4 py-2 rounded border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            Source on GitHub &rarr;
          </a>
        </div>

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-6">First launch</h2>
          <p className="text-white/70 font-mono text-sm leading-relaxed">
            macOS will refuse to open the app because it&rsquo;s not signed by an Apple Developer account. Right-click Todor in Applications and pick <span className="text-white">Open</span>; you&rsquo;ll only have to do that once.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-6">What&rsquo;s inside</h2>
          <div className="space-y-6">
            {features.map((f) => (
              <div key={f.title} className="border-l border-white/20 pl-6">
                <h3 className="text-lg font-bold mb-1">{f.title}</h3>
                <p className="text-white/50 font-mono text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
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
