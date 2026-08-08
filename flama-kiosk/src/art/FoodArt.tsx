import type { ArtSpec } from "../data/types";
import Burger from "./Burger";
import Fries from "./Fries";
import Drink from "./Drink";
import Nuggets from "./Nuggets";
import Sundae from "./Sundae";
import Pie from "./Pie";
import Wrap from "./Wrap";
import CheeseBites from "./CheeseBites";
import HashBrown from "./HashBrown";
import HotDrink from "./HotDrink";
import Pastry from "./Pastry";

interface FoodArtProps {
  art: ArtSpec;
  liquidColor?: string;
  lidColor?: string;
  className?: string;
}

export default function FoodArt({ art, liquidColor, lidColor, className }: FoodArtProps) {
  switch (art.kind) {
    case "burger":
      return (
        <Burger
          patty={art.patty}
          cheese={art.cheese}
          bacon={art.bacon}
          bunTop={art.bunTop}
          double={art.double}
          className={className}
        />
      );
    case "fries":
      return <Fries className={className} />;
    case "nuggets":
      return <Nuggets className={className} />;
    case "drink":
      return <Drink liquidColor={liquidColor} lidColor={lidColor} className={className} />;
    case "sundae":
      return <Sundae className={className} />;
    case "pie":
      return <Pie className={className} />;
    case "wrap":
      return <Wrap className={className} />;
    case "cheesebites":
      return <CheeseBites className={className} />;
    case "hashbrown":
      return <HashBrown className={className} />;
    case "hotdrink":
      return <HotDrink className={className} />;
    case "pastry":
      return <Pastry className={className} />;
    default:
      return null;
  }
}
