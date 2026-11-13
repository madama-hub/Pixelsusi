export type CityId = "napoli" | "casal" | "marina" | "caserta" | "salerno";
export type StageId = "napoli" | "casal" | "caserta" | "salerno" | "marina-finale";
export type Platform = { x: number; y: number };

// Positions are percentages of the uncut original wallpaper. The first point is
// the starting terrace; each following point is one answer and one landing.
export const environments: Record<
  CityId,
  { name: string; platforms: Platform[] }
> = {
  napoli: {
    name: "Napoli",
    platforms: [
      { x: 26, y: 73 },
      { x: 47.5, y: 61 },
      { x: 66, y: 49 },
      { x: 79.5, y: 40 },
      { x: 91, y: 31 },
    ],
  },
  casal: {
    name: "Casal di Principe",
    platforms: [
      { x: 26, y: 76 },
      { x: 58, y: 93 },
      { x: 51, y: 45 },
      { x: 63.5, y: 37 },
      { x: 72, y: 29.5 },
      { x: 79.8, y: 23 },
      { x: 91, y: 22 },
    ],
  },
  marina: {
    name: "Marina di Camerota",
    platforms: [
      { x: 22, y: 73 },
      { x: 39, y: 64 },
      { x: 60, y: 41 },
      { x: 68.5, y: 34 },
      { x: 76.5, y: 29 },
      { x: 82, y: 23 },
      { x: 91.5, y: 21 },
    ],
  },
  caserta: {
    name: "Caserta",
    platforms: [
      { x: 25, y: 79 },
      { x: 55, y: 63 },
      { x: 67, y: 55 },
      { x: 80, y: 47 },
      { x: 87.5, y: 36 },
      { x: 97, y: 30 },
    ],
  },
  salerno: {
    name: "Salerno",
    platforms: [
      { x: 35, y: 89 },
      { x: 52, y: 50 },
      { x: 60, y: 41 },
      { x: 67, y: 35 },
      { x: 73, y: 30 },
      { x: 83, y: 27 },
    ],
  },
};

// Marina di Camerota is the final destination.
export const stages: { id: StageId; city: CityId }[] = [
  { id: "napoli", city: "napoli" },
  { id: "casal", city: "casal" },
  { id: "caserta", city: "caserta" },
  { id: "salerno", city: "salerno" },
  { id: "marina-finale", city: "marina" },
];
