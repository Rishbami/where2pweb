import type { AccessibilityFeature } from "@/lib/toilets";

const tagLabels: Record<AccessibilityFeature, string> = {
  wheelchair: "Wheelchair",
  "baby-changing": "Baby changing",
  "gender-neutral": "Gender neutral",
};

export function Tag({ feature }: { feature: AccessibilityFeature }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
      {tagLabels[feature]}
    </span>
  );
}
