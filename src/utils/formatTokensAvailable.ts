export const formatTokensAvailable = (tokens: string) => {
  const [integerPart, decimalPart] = tokens.split(".");
  if (!decimalPart) {
    return tokens;
  }
  if (decimalPart.length <= 2) {
    return tokens;
  }
  if (decimalPart.slice(2).replace(/0+$/, "").length > 0) {
    return `${integerPart}.${decimalPart}`;
  }
  return `${integerPart}.${decimalPart.slice(0, 2)}`;
};
