export type IPiece = {
  getBoardValue: () => symbol;
  clone: () => IPiece;
};
