/**
 * Utility functions for mocks
 */

export const getRandomDate = () => {
  const now = new Date();
  const pastDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const randomMillis = Math.floor(Math.random() * pastDay);
  return new Date(now.getTime() - randomMillis);
};
