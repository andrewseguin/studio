export const LETTER_LEVELS = [
  { level: 1, name: "Level 1", description: "Letters: s, a, t, p, i, n", letters: ["s", "a", "t", "p", "i", "n"], color: "#A7D8A7" },
  { level: 2, name: "Level 2", description: "Letters: c, o, d, m, k", letters: ["c", "o", "d", "m", "k"], color: "#A7C7E7" },
  { level: 3, name: "Level 3", description: "Letters: e, r, g, b, h", letters: ["e", "r", "g", "b", "h"], color: "#FDFD96" },
  { level: 4, name: "Level 4", description: "Letters: w, j, l, u, f", letters: ["w", "j", "l", "u", "f"], color: "#FFB3B3" },
  { level: 5, name: "Level 5", description: "Letters: y, v, x, q, z", letters: ["y", "v", "x", "q", "z"], color: "#C3B1E1" },
];

export const ALL_LETTERS = LETTER_LEVELS.flatMap(level => level.letters).sort();

export const DEFAULT_LETTERS = LETTER_LEVELS[0].letters;

export const getLetterData = (letter: string) => {
  return LETTER_LEVELS.find(level => level.letters.includes(letter));
}
