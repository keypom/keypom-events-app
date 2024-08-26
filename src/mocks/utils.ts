/**
 * Utility functions for mocks
 */

const randomColors = [
  "#00EC97",
  "#FFA99F",
  "#4D3BC2",
  "#9797FF",
  "#E91409",
  "#62EBE4",
];

export const getRandomColor = () => { return randomColors[Math.floor(Math.random() * randomColors.length)] };

export const getRandomDate = () => {
  const now = new Date();
  const pastDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const randomMillis = Math.floor(Math.random() * pastDay);
  return new Date(now.getTime() - randomMillis);
}