export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format price as currency (e.g., 649,-)
export const formatCurrency = (priceInOre: number): string => {
  const kroner = Math.floor(priceInOre / 100);
  return `${kroner.toLocaleString("nb-NO")},-`;
};
