import React from "react";

type Props = {
  colors: string[];
  onClick?: (colors: string[]) => void;
  isFavourite: boolean;
};

const Square = ({ colors, onClick, isFavourite }: Props) => {
  const [isMouseOver, setIsMouseOver] = React.useState(false);
  return (
    <div
      className="square square4"
      style={{ background: colors[0] }}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
    >
      <div className="square square3" style={{ background: colors[1] }}>
        <div className="square square2" style={{ background: colors[2] }}>
          <div
            className="square square1"
            style={{ background: colors[3] }}
          ></div>
        </div>
      </div>
      {
        <div className={"square-mouseover " + (isMouseOver ? " active" : "")}>
          <button onClick={() => onClick && onClick(colors)}>
            {isFavourite ? "Remove from favourites" : "Add to favourites"}
          </button>
        </div>
      }
    </div>
  );
};

export default Square;
