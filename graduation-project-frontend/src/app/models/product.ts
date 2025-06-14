import { SafeUrl } from "@angular/platform-browser";
import { Category } from "./category";

export interface Product {
    id: number;
    avatar: string;
    productName: string;
    cost: number;
    price:number;
    startDate: string;
    description: string;
    category: Category;
    safeAvatar?: SafeUrl;
}
