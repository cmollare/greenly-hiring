import { ApiProperty } from "@nestjs/swagger";

export class CreateCarbonEmissionFactorDto {
  @ApiProperty(
    {
      name: "name",
      type: "string",
      description: "The name of the product or service for which the carbon emission factor is being calculated",
      required: true,
      example: "beef"
    }
  )
  name: string;
  @ApiProperty(
    {
      name: "unit",
      type: "string",
      description: "The unit of the product or service for which the carbon emission factor is being calculated (e.g. kg, litre, etc.)",
      required: true,
      example: "kg"
    }
  )
  unit: string;

  @ApiProperty(
    {
      name: "emissionCO2eInKgPerUnit",
      type: "number",
      description: "The carbon emission factor for the product or service in kg per unit",
      required: true,
      example: 0.12
    }
  )
  emissionCO2eInKgPerUnit: number;

  @ApiProperty(
    {
      name: "source",
      type: "string",
      description: "The source of the data used to calculate the carbon emission factor for the product or service",
      required: true,
      example: "Agrybalise"
    }
  )
  source: string;
}
