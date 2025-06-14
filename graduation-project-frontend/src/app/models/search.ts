import { Product } from "../models/product";

export interface Search {
  keyword: string;
  totalResults: number;
  products: Product[];
}