import Image from "next/image";
import type { CSSProperties } from "react";

const cards = [
  {
    title: "Save anything",
    description: "Videos, repos and documentation, saved in one click.",
    image: "/cube-save.png",
    accent: "#8b5cf6",
    user: "Paste a link: YouTube, repo, docs",
    app: "Saved to Rust Learning ✓",
  },
  {
    title: "Organize into collections",
    description: "Keep everything for a project or topic in one place.",
    image: "/cube-organize.png",
    accent: "#10b981",
    user: "Group these into a learning path",
    app: "12 resources sorted into 3 collections ✓",
  },
  {
    title: "Find it instantly",
    description: "Search and star what matters so it's always close.",
    image: "/cube-find.png",
    accent: "#f59e0b",
    user: "That caching video from last month?",
    app: "Found it, with your notes attached ✓",
  },
];

const bubble =
  "absolute left-4 max-w-[82%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-snug " +
  "opacity-0 translate-y-3 transition duration-300 " +
  "group-hover:opacity-100 group-hover:translate-y-0 " +
  "[@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0";

export default function FeatureCards() {
  return (
    <div className="mx-auto mt-10  max-w-275 flex flex-col items-center justify-center space-y-6 md:mt-20 md:max-w-7xl md:flex-row md:space-x-6 md:space-y-0">
      {cards.map((c) => (
        <div
          key={c.title}
          style={{ "--accent": c.accent } as CSSProperties}
          className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white"
        >
          <div className="relative h-80 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--accent)_38%,#fff)_0%,#fff_72%)]">
            {/* wrapper floats, image scales on hover (kept separate so transforms don't clash) */}
            <div className="absolute inset-0 flex items-center justify-center pb-16 animate-[float_5s_ease-in-out_infinite] motion-reduce:animate-none">
              <Image
                src={c.image}
                alt=""
                width={500}
                height={500}
                priority
                className="h-auto w-[62%] transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className={`${bubble} bottom-15.5 bg-white text-neutral-900 shadow-lg`}>
              {c.user}
            </div>
            <div className={`${bubble} bottom-3.5 bg-accent text-white delay-150`}>
              {c.app}
            </div>
          </div>

          <div className="px-6 pb-6 pt-1">
            <h3 className="mb-1.5 mt-3.5 text-xl font-semibold">{c.title}</h3>
            <p className="text-[15px] leading-relaxed text-neutral-500">{c.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
