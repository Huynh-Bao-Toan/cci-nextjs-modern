export type ProductId = number;

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnailUrl: string;
  imageUrls: string[];
  tags: string[];
};

