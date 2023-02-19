const FULL_HEX_LENGTH = 6;
const SHORT_HEX_LENGTH = 3;
const DIGIT_LENGTH = FULL_HEX_LENGTH / SHORT_HEX_LENGTH;

export function colorHex2regex(colorHex: string): RegExp {
  const matchResult = colorHex.match(/^#([0-9a-f]+)$/i);

  if (
    matchResult === null ||
    (matchResult[1].length !== SHORT_HEX_LENGTH && matchResult[1].length !== FULL_HEX_LENGTH)
  ) {
    return new RegExp(`(?:${colorHex})`);
  }

  const capturedHex = matchResult[1];
  const isShortHex = capturedHex.length === SHORT_HEX_LENGTH;

  const [redHex, greenHex, blueHex] = isShortHex
    ? capturedHex.split('').map((digit) => digit.repeat(2))
    : capturedHex
        .split('')
        .map((_, index) =>
          index % DIGIT_LENGTH === 0 ? capturedHex.slice(index, index + DIGIT_LENGTH) : '',
        )
        .filter(Boolean);
  const fullHex = isShortHex ? `#${redHex}${greenHex}${blueHex}` : colorHex;

  const candidates = [
    isShortHex ? colorHex : null,
    fullHex,
    `rgb\\(${Number.parseInt(redHex, 16)}, ?${Number.parseInt(greenHex, 16)}, ?${Number.parseInt(
      blueHex,
      16,
    )}\\)`,
  ].filter(Boolean);

  return new RegExp(`(?:${candidates.join('|')})`);
}
