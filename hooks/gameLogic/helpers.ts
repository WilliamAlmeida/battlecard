/**
 * Gera um ID único para cartas e logs
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 */
export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
