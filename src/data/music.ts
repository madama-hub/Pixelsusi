import modugno from "../../music/Domenico Modugno - Tu si na cosa grande pe me - (320 Kbps).mp3";
import murolo from "../../music/Roberto Murolo - Malafemmena - (320 Kbps).mp3";
import pavarotti from "../../music/Luciano Pavarotti_ 'O Sole Mio' - (320 Kbps).mp3";

// Play in order, then loop back to the first song.
export const soundtrack = [
  {
    src: modugno,
    artist: "Domenico Modugno",
    title: "Tu si na cosa grande pe me",
  },
  { src: murolo, artist: "Roberto Murolo", title: "Malafemmena" },
  { src: pavarotti, artist: "Luciano Pavarotti", title: "’O Sole Mio" },
];
