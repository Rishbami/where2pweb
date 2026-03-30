import type { ToiletSearchResult } from "@/lib/filter-toilets";

export function MapPreview({
  toilets,
  activeToiletId,
}: {
  toilets: ToiletSearchResult[];
  activeToiletId?: string;
}) {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:28px_28px] bg-slate-50 p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.04),transparent_42%)]" />

      {toilets.slice(0, 5).map((toilet, index) => {
        const positions = [
          "left-[18%] top-[24%]",
          "left-[46%] top-[42%]",
          "left-[28%] top-[66%]",
          "left-[70%] top-[52%]",
          "left-[58%] top-[20%]",
        ];

        const isActive = toilet.id === activeToiletId;

        return (
          <div
            key={toilet.id}
            className={`absolute ${positions[index]} flex h-10 w-10 items-center justify-center rounded-full border text-sm shadow-sm ${
              isActive
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-white bg-white text-slate-950"
            }`}
          >
            •
          </div>
        );
      })}

      <div className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-sm text-slate-600 shadow-sm">
        Map preview placeholder
      </div>
    </div>
  );
}
