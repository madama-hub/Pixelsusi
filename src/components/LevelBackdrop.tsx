import { assets } from "../data/config";
import { environments } from "../data/journey";
import type { CityId } from "../data/journey";

// The surrounding page shares the current scene's colors. The playable
// wallpaper stays sharp and uncut; only these decorative copies are blurred.
export function LevelBackdrop({ city }: { city: CityId }) {
  return (
    <div className="level-backdrop" aria-hidden="true" data-city={city}>
      {(Object.keys(environments) as CityId[]).map((id) => (
        <img
          key={id}
          src={assets[id]}
          alt=""
          draggable="false"
          className={id === city ? "is-active" : ""}
        />
      ))}
    </div>
  );
}
