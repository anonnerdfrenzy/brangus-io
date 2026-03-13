import PhysarumBackground from "./components/PhysarumBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <PhysarumBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <h1
          className="text-7xl sm:text-8xl md:text-9xl italic font-black tracking-wide text-white"
          style={{
            fontFamily: "var(--font-playfair)",
            textShadow:
              "0 0 20px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.15), 0 0 100px rgba(255,255,255,0.08)",
          }}
        >
          BRANGUS
        </h1>
      </div>
    </div>
  );
}
