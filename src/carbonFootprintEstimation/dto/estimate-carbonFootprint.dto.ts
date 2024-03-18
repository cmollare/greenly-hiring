import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";

export class EstimateCarbonFootprintDto {
    @ApiProperty(
        {
            name: "products",
            type: "array",
            description: "The list of products and their quantities for which the carbon footprint is being estimated",
            required: true,
            example: [
                {
                    name: "beef",
                    unit: "kg",
                    quantity: 1
                }
            ]
        }
    )
    @IsArray({ message: "products must be an array" })
    @ArrayMinSize(1, { message: "products must not be empty" })
    @ValidateNested({ each: true })
    @Type(() => ProductQuantityDto)
    products: ProductQuantityDto[];

    @ApiProperty(
        {
            name: "source",
            type: "string",
            description: "The source of the data used to calculate the carbon footprint estimation",
            required: true,
            example: "Agrybalise"
        }
    )
    @IsString({ message: "source must be a string" })
    @IsNotEmpty({ message: "source must not be empty" })
    source: string;
}

export class ProductQuantityDto {
    @ApiProperty(
        {
            name: "name",
            type: "string",
            description: "The name of the product or service for which the carbon footprint is being estimated",
            required: true,
            example: "beef"
        }
    )
    @IsString({ message: "name must be a string" })
    @IsNotEmpty({ message: "name must not be empty" })
    name: string;

    @ApiProperty(
        {
            name: "unit",
            type: "string",
            description: "The unit of the product or service for which the carbon footprint is being estimated (e.g. kg, litre, etc.)",
            required: true,
            example: "kg"
        }
    )
    @IsString({ message: "unit must be a string" })
    @IsNotEmpty({ message: "unit must not be empty" })
    unit: string;

    @ApiProperty(
        {
            name: "quantity",
            type: "number",
            description: "The quantity of the product or service for which the carbon footprint is being estimated",
            required: true,
            example: 1
        }
    )
    @IsNumber({}, { message: "quantity must be a number" })
    @Min(0, { message: "quantity must be a positive number" })
    quantity: number;
}