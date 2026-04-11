// Left-side branding panel shown on md+ screens.
// Text colours are intentionally ghost-dim — watermark aesthetic from the mockup.

const HERO_STATS = [
  { value: "247", label: "Locations" },
  { value: "180+", label: "Movies" },
  { value: "60yr", label: "History" },
] as const;

const FILMING_LOCATIONS = [
  "City Hall",
  "Alcatraz",
  "Golden Gate",
  "Chinatown",
  "Mission",
  "Nob Hill",
  "Russian Hill",
  "Fisherman's Wharf",
  "SOMA",
  "North Beach",
] as const;

export default function AuthHeroPanel() {
  return (
    <div className="hidden md:flex flex-1 flex-col justify-between bg-bg-page p-6 border-r border-border-strong overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
        <span className="text-text-primary text-sm font-medium">SF Movies</span>
      </div>

      {/* Hero block */}
      <div className="flex flex-col gap-4">
        {/* Ghost watermark title */}
        <h1
          className="font-medium leading-none select-none"
          style={{ 
            fontSize: "clamp(48px, 6vw, 72px)", 
            letterSpacing: "-2px",
            color: "var(--color-border-default)"
          }}
        >
          San
          <br />
          Francisco
          <br />
          Films
        </h1>

        <p className="text-xs text-text-ghost">
          Explore 247 filming locations
          <br />
          across the city
        </p>

        {/* Stats row */}
        <div className="flex gap-2 mt-1">
          {HERO_STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-bg-surface border border-border-default rounded-[6px] px-2.5 py-1.5 flex flex-col gap-0.5"
            >
              <span className="text-base font-medium text-accent">{value}</span>
              <span className="text-[9px] text-text-muted uppercase tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Location tags */}
        <div className="flex flex-wrap gap-1">
          {FILMING_LOCATIONS.map((location) => (
            <span
              key={location}
              className="text-[9px] px-2 py-0.5 rounded-[4px] bg-bg-surface border border-border-default text-text-muted"
            >
              {location}
            </span>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div />
    </div>
  );
}
