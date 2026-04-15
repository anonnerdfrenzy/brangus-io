"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type ScreenId =
  | "welcome"
  | "situation"
  | "insecurity"
  | "loading"
  | "affirmations"
  | "done";

type Rating = "true" | "partly" | "false";

const romanNumerals: Record<ScreenId, string> = {
  welcome: "i.",
  situation: "ii.",
  insecurity: "iii.",
  loading: "iv.",
  affirmations: "iv.",
  done: "v.",
};

export default function AffirmrPage() {
  const [screen, setScreen] = useState<ScreenId>("welcome");
  const [situation, setSituation] = useState("");
  const [insecurity, setInsecurity] = useState("");
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const [error, setError] = useState<string | null>(null);

  const insecurityRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (screen === "insecurity") {
      const id = setTimeout(() => insecurityRef.current?.focus(), 500);
      return () => clearTimeout(id);
    }
  }, [screen]);

  async function requestAffirmations() {
    setError(null);
    setScreen("loading");
    try {
      const resp = await fetch("/api/affirmations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, insecurity }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `Something went wrong (${resp.status})`);
      }
      const data = await resp.json();
      setAffirmations(data.affirmations || []);
      setRatings({});
      setScreen("affirmations");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setScreen("insecurity");
    }
  }

  function restart() {
    setSituation("");
    setInsecurity("");
    setAffirmations([]);
    setRatings({});
    setError(null);
    setScreen("welcome");
  }

  const trueOnes = affirmations.filter((_, i) => ratings[i] === "true");
  const partlyOnes = affirmations.filter((_, i) => ratings[i] === "partly");
  const noOnes = affirmations.filter((_, i) => ratings[i] === "false");
  const unrated =
    affirmations.length - (trueOnes.length + partlyOnes.length + noOnes.length);
  const toShow = trueOnes.length
    ? trueOnes
    : partlyOnes.length
      ? partlyOnes
      : affirmations;

  return (
    <div className="affirmr-app">
      <header className="masthead">
        <span className="masthead__title">affirmr</span>
        <Link href="/simulations" className="masthead__home">
          &larr; brangus
        </Link>
        <span className="masthead__num">{romanNumerals[screen]}</span>
      </header>

      <main className="stage">
        {/* Welcome */}
        <section className={`screen${screen === "welcome" ? " active" : ""}`}>
          <span className="eyebrow">for when words are hard</span>
          <h1>
            Words of <em>affirmation,</em>
            <br />
            when your <em>mind</em>
            <br />
            goes blank.
          </h1>
          <p className="lede">
            Is your partner&apos;s love language words of affirmation — but they
            don&apos;t come easy to you? Do you go quiet when you&apos;re stressed,
            and can&apos;t think of what to say?
          </p>
          <p className="lede">
            Tell me what&apos;s going on and I&apos;ll help you find something
            specific and real — words that&apos;ll actually make them feel loved.
          </p>
          <span className="ornament">&#10070;</span>
          <div className="actions">
            <button className="affirmr-btn" onClick={() => setScreen("situation")}>
              <span>Begin</span>
              <span className="affirmr-btn__arrow">&rarr;</span>
            </button>
          </div>
        </section>

        {/* Situation */}
        <section className={`screen${screen === "situation" ? " active" : ""}`}>
          <span className="eyebrow">first, the setting</span>
          <h2>
            What&apos;s <em>going on</em>?
          </h2>
          <p className="lede">
            Paint the scene. What&apos;s happening between you two right now, or
            what they&apos;ve been dealing with?
          </p>
          <div className="field">
            <label className="field__label" htmlFor="situation-input">
              — the situation
            </label>
            <textarea
              id="situation-input"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g. they just submitted a grant application and have been working on it for weeks..."
              autoComplete="off"
            />
          </div>
          <div className="actions">
            <button
              className="affirmr-btn"
              disabled={situation.trim().length < 5}
              onClick={() => setScreen("insecurity")}
            >
              <span>Next</span>
              <span className="affirmr-btn__arrow">&rarr;</span>
            </button>
            <button
              className="affirmr-btn affirmr-btn--ghost"
              onClick={() => setScreen("welcome")}
            >
              &larr; back
            </button>
          </div>
        </section>

        {/* Insecurity */}
        <section className={`screen${screen === "insecurity" ? " active" : ""}`}>
          <span className="eyebrow">now, the tender part</span>
          <h2>
            What might they be <em>insecure</em> about — right now?
          </h2>
          <p className="lede">
            Your best guess. What&apos;s the worry underneath tonight? The thing
            they might not say out loud.
          </p>
          {error && <div className="affirmr-error">{error}</div>}
          <div className="field">
            <label className="field__label" htmlFor="insecurity-input">
              — the quiet worry
            </label>
            <textarea
              id="insecurity-input"
              ref={insecurityRef}
              value={insecurity}
              onChange={(e) => setInsecurity(e.target.value)}
              placeholder="e.g. that their work doesn't matter, or that they're falling behind peers..."
              autoComplete="off"
            />
          </div>
          <div className="actions">
            <button
              className="affirmr-btn"
              disabled={insecurity.trim().length < 5}
              onClick={requestAffirmations}
            >
              <span>Find the words</span>
              <span className="affirmr-btn__arrow">&rarr;</span>
            </button>
            <button
              className="affirmr-btn affirmr-btn--ghost"
              onClick={() => setScreen("situation")}
            >
              &larr; back
            </button>
          </div>
        </section>

        {/* Loading */}
        <section className={`screen${screen === "loading" ? " active" : ""}`}>
          <div className="loading">
            <span className="loading__ornament">&#10070;</span>
            <p className="loading__text">thinking of something true...</p>
          </div>
        </section>

        {/* Affirmations */}
        <section className={`screen${screen === "affirmations" ? " active" : ""}`}>
          <span className="eyebrow">some possibilities</span>
          <h2>
            Here are a <em>few things</em> you might say.
          </h2>
          <p className="lede">
            Tap whether each one feels true. That helps me understand what
            actually fits.
          </p>
          <div className="affirmations">
            {affirmations.map((text, i) => (
              <div className="affirmation" key={i}>
                <span className="affirmation__num">{i + 1}</span>
                <p className="affirmation__text">{text}</p>
                <div className="rate">
                  <span className="rate__label">is this true?</span>
                  {(["true", "partly", "false"] as const).map((value) => (
                    <button
                      key={value}
                      className={`rate__btn${ratings[i] === value ? " selected" : ""}`}
                      data-value={value}
                      onClick={() => setRatings({ ...ratings, [i]: value })}
                    >
                      {value === "true"
                        ? "yes"
                        : value === "partly"
                          ? "sort of"
                          : "not really"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="actions">
            <button className="affirmr-btn" onClick={() => setScreen("done")}>
              <span>Done</span>
              <span className="affirmr-btn__arrow">&rarr;</span>
            </button>
            <button
              className="affirmr-btn affirmr-btn--ghost"
              onClick={restart}
            >
              &#x21ba; start over
            </button>
          </div>
        </section>

        {/* Done */}
        <section className={`screen${screen === "done" ? " active" : ""}`}>
          <span className="eyebrow">carry these with you</span>
          <h2>
            The ones that <em>rang true</em>.
          </h2>
          <div>
            {toShow.slice(0, 3).map((text, i) => (
              <p className="truest-quote" key={i}>
                &ldquo;{text}&rdquo;
              </p>
            ))}
          </div>
          <div className="done-summary">
            <div className="done-summary__row">
              <span className="done-summary__label">rang true</span>
              <span className="done-summary__value">{trueOnes.length}</span>
            </div>
            <div className="done-summary__row">
              <span className="done-summary__label">close, but</span>
              <span className="done-summary__value">{partlyOnes.length}</span>
            </div>
            <div className="done-summary__row">
              <span className="done-summary__label">not quite</span>
              <span className="done-summary__value">{noOnes.length}</span>
            </div>
            {unrated > 0 && (
              <div className="done-summary__row">
                <span className="done-summary__label">unrated</span>
                <span className="done-summary__value">{unrated}</span>
              </div>
            )}
          </div>
          <p className="lede" style={{ fontStyle: "italic" }}>
            Say the true ones. Tweak the ones that were close. Trust that
            specificity is what makes it land.
          </p>
          <div className="actions">
            <button className="affirmr-btn" onClick={restart}>
              <span>Again, for another moment</span>
              <span className="affirmr-btn__arrow">&rarr;</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="affirmr-footer">with love &#10070;</footer>
    </div>
  );
}
