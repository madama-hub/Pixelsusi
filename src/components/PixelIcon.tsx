export type IconName =
  | "heart"
  | "star"
  | "arrow"
  | "sound"
  | "mute"
  | "replay"
  | "check"
  | "spark"
  | "flag";
const paths: Record<IconName, string> = {
  heart: "M2 2h4v2h4V2h4v2h2v6h-2v2h-2v2h-2v2H6v-2H4v-2H2v-2H0V4h2z",
  star: "M6 0h4v5h5v4h-3v5H8v-3H4v3H1V9h3V5h2z",
  arrow: "M8 2h3v3h3v3h2v2h-2v3h-3v3H8v-3h3v-3H0V7h11V5H8z",
  sound:
    "M0 6h3V4h2V2h3v12H5v-2H3v-2H0zM10 5h2v6h-2zM13 2h2v3h1v6h-1v3h-2v-3h1V5h-1z",
  mute: "M0 6h3V4h2V2h3v12H5v-2H3v-2H0zM10 5h2v2h2V5h2v2h-2v2h2v2h-2V9h-2v2h-2V9h2V7h-2z",
  replay:
    "M4 1h8v2h2v2h2v7h-2v2h-2v2H4v-2H2v-3h3v2h6v-2h2V6h-2V4H5v2h3v3H0V1h3v3h1z",
  check: "M1 7h3v3h3V7h3V4h3V1h3v5h-3v3h-3v3H7v3H4v-3H1z",
  spark: "M7 0h2v5h2v2h5v2h-5v2H9v5H7v-5H5V9H0V7h5V5h2z",
  flag: "M2 0h2v16H2zM5 1h9v7H5z",
};
export function PixelIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={`pixel-icon ${className}`}
      viewBox="0 0 16 16"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path fill="currentColor" d={paths[name]} />
    </svg>
  );
}
