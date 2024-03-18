import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("carbon_footprint_estimation")
export class CarbonFootprintEstimation extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty(
        {
            name: "id",
            type: "number",
            description: "The unique identifier of the carbon footprint estimation entry",
            required: true,
            example: 1
        }
    )
    id: number;

    @Column({
        nullable: false,
        type: 'timestamptz',
    })
    @CreateDateColumn()
    @ApiProperty(
        {
            name: "estimationDate",
            type: "string",
            description: "The date and time when the carbon footprint estimation was made",
            required: true,
            example: "2021-08-23T18:25:43.511Z"
        }
    )
    estimationDate: Date;

    @Column({
        type: "float",
        nullable: false,
    })
    @ApiProperty(
        {
            name: "emissionCO2",
            type: "number",
            description: "The amount of carbon dioxide emitted in kg",
            required: true,
            example: 0.12
        }
    )
    emissionCO2: number;

    @Column({
        nullable: false,
    })
    @ApiProperty(
        {
            name: "source",
            type: "string",
            description: "The source of the data used to calculate the carbon footprint estimation",
            required: true,
            example: "Agrybalise"
        }
    )
    source: string;

    sanitize() {
        if (this.source === "") {
            throw new Error("Source cannot be empty");
        }
    }

    constructor(props: {
        emissionCO2: number;
        source: string;
    }) {
        super();
        this.emissionCO2 = props?.emissionCO2;
        this.source = props?.source;
        this.sanitize();
    }
}