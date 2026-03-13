export type RawProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
};

export type RawProductsResponse = {
  products: RawProduct[];
  total: number;
  skip: number;
  limit: number;
};

export type RawCategory =
  | string
  | {
      slug: string;
      name?: string;
      url?: string;
    };

export type RawCategoriesResponse = RawCategory[];
