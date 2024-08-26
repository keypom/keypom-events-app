export interface Collectible {
  id: number;
  title: string;
  description: string;
  assetType: string;
  imageSrc: string;
  bgColor: string;
  isFound: boolean;
}

export const fetchCollectibles: () => Promise<Collectible[]> = async () => {
  const response = await fetch("https://example.com/collectibles");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchCollectibleById: (
  id: string,
) => Promise<Collectible> = async (id) => {
  const response = await fetch(`https://example.com/collectibles/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
