import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional
} from 'class-validator';

export class ProductDTO {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  constructor(data: any) {
    this.productName = data.productName;
    this.description = data.description;
    this.avatar = data.avatar;
    this.cost = data.cost;
    this.price = data.price;
    this.categoryId = data.categoryId;
  }
}
