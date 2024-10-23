export type Arguments = {
  search: string;
  pages?: number;
};

export type Recipe = {
  name?: string | null;
  url: string | null;
  numberReviews: number;
};
