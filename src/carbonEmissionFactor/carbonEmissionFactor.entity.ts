import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("carbon_emission_factors")
export class CarbonEmissionFactor extends BaseEntity {
  @ApiProperty(
    {
      name: "id",
      type: "number",
      description: "The unique identifier of the carbon emission factor entry",
      required: true,
      example: 1
    }
  )
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty(
    {
      name: "name",
      type: "string",
      description: "The name of the product or service for which the carbon emission factor is being calculated (e.g. kg, litre, etc.)",
      required: true,
      example: "ham"
    }
  )
  @Column({
    nullable: false,
  })
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
  @Column({
    nullable: false,
  })
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
  @Column({
    type: "float",
    nullable: false,
  })
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
  @Column({
    nullable: false,
  })
  source: string;

  sanitize() {
    if (this.source === "") {
      throw new Error("Source cannot be empty");
    }
  }

  constructor(props: {
    name: string;
    unit: string;
    emissionCO2eInKgPerUnit: number;
    source: string;
  }) {
    super();

    this.name = props?.name;
    this.unit = props?.unit;
    this.emissionCO2eInKgPerUnit = props?.emissionCO2eInKgPerUnit;
    this.source = props?.source;
    this.sanitize();
  }
}
