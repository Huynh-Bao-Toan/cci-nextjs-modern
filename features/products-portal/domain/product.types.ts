export type ProductId = number

export type Product = {
  id: ProductId
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnailUrl: string
  imageUrls: string[]
  tags: string[]
}

