import React from "react";
import "./App.css";
import Square from "./Square";
import useLocalStorage from "./useLocalStorage";

type Favourites = {
  key: string;
  name?: string;
  combinations: [string[]];
};

function App() {
  const [color1, setColor1] = useLocalStorage<string>("color1", "#000000");
  const [color2, setColor2] = useLocalStorage<string>("color2", "#000000");
  const [color3, setColor3] = useLocalStorage<string>("color3", "#000000");
  const [color4, setColor4] = useLocalStorage<string>("color4", "#000000");
  const [favourites, setFavourites] = useLocalStorage<Favourites[]>(
    "favourites",
    []
  );

  console.log("color1", color1);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const colors = params.get("colors")?.replace(",", "#").split("#");
    if (
      colors?.length === 4 &&
      colors[0] !== color1 &&
      colors[1] !== color2 &&
      colors[2] !== color3 &&
      color4 !== colors[3]
    ) {
      setColor1(colors[0]);
      setColor2(colors[1]);
      setColor3(colors[2]);
      setColor4(colors[3]);
    }
  }, [
    color1,
    color2,
    color3,
    color4,
    setColor1,
    setColor2,
    setColor3,
    setColor4,
  ]);

  const permutators = perm([color1, color2, color3, color4]).filter(
    (p) => p.length === 4
  );

  return (
    <div className="App">
      <h1>Homage to a Square Generator</h1>
      <div className="inputs">
        <input
          type="color"
          value={color1}
          onChange={(e) => setColor1(e.target.value)}
        />
        <input
          type="color"
          value={color2}
          onChange={(e) => setColor2(e.target.value)}
        />
        <input
          type="color"
          value={color3}
          onChange={(e) => setColor3(e.target.value)}
        />
        <input
          type="color"
          value={color4}
          onChange={(e) => setColor4(e.target.value)}
        />{" "}
        <button
          onClick={() => {
            const colorsString =
              `${color1},${color2},${color3},${color4}`.replaceAll("#", "");

            if ("URLSearchParams" in window) {
              var searchParams = new URLSearchParams(window.location.search);
              searchParams.set("colors", colorsString);
              window.location.search = "?" + searchParams.toString();

              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          Copy URL
        </button>
      </div>

      <br />

      <div className="squares">
        {permutators.map((p) => {
          return (
            <Square
              isFavourite={false}
              onClick={(colors) => {
                var key = [...colors].sort().join("");
                var newFavourites: Favourites[] = JSON.parse(
                  JSON.stringify(favourites)
                );
                var existingFavourite = newFavourites.find(
                  (f) => f.key === key
                );

                if (!existingFavourite) {
                  newFavourites.push({ key, combinations: [colors] });
                } else {
                  const existingCombination =
                    existingFavourite.combinations.find(
                      (c) => c.join("") === colors.join("")
                    );
                  console.log(
                    "existingCombination",
                    existingCombination?.join(""),
                    colors.join("")
                  );
                  if (!existingCombination) {
                    existingFavourite.combinations.push(colors);
                  }
                }

                setFavourites(newFavourites);
              }}
              colors={p}
              key={p.join("")}
            />
          );
        })}
      </div>

      <h2>Favourites</h2>

      {favourites.map((f) => {
        return (
          <>
            <br />
            <input
              type="text"
              value={f.name}
              onChange={(e) => {
                var newFavourites: Favourites[] = JSON.parse(
                  JSON.stringify(favourites)
                );

                var existingFavourite = newFavourites.find(
                  (favourite) => favourite.key === f.key
                );

                existingFavourite!.name = e.target.value;
                setFavourites(newFavourites);
              }}
            />
            <button
              onClick={() => {
                const colors = f.combinations[0];

                setColor1(colors[0]);
                setColor2(colors[1]);
                setColor3(colors[2]);
                setColor4(colors[3]);
                const colorsString =
                  `${color1},${color2},${color3},${color4}`.replaceAll("#", "");

                var searchParams = new URLSearchParams(window.location.search);
                searchParams.delete("colors");
                searchParams.set("colors", colorsString);

                window.location.search = "?" + searchParams.toString();
              }}
            >
              Load colours
            </button>
            <br />
            <br />
            <div className="squares">
              {f.combinations.map((colors) => (
                <Square
                  isFavourite
                  colors={colors}
                  key={colors.join("")}
                  onClick={(colors) => {
                    // var newFavourites: Favourites[] = JSON.parse(
                    //   JSON.stringify(favourites)
                    // );
                    // const updatedFavourites = newFavourites.map((favourite) =>
                    //   f.key !== favourite.key
                    //     ? favourite
                    //     : {
                    //         ...favourite,
                    //         combinations: favourite.combinations.filter(
                    //           (c) => c.join("") !== colors.join("")
                    //         ),
                    //       }
                    // );
                    // setFavourites(updatedFavourites);
                  }}
                />
              ))}
            </div>
            <br></br>
            <hr />
          </>
        );
      })}
    </div>
  );
}

function perm(xs: string[]) {
  let ret: string[][] = [[]];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if (!rest.length) {
      ret.push([xs[i]]);
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]));
      }
    }
  }
  return ret;
}

export default App;
