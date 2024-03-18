import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonFootprintEstimationController } from "./carbonFootprintEstimation.controller";
import { CarbonFootprintEstimation } from "./carbonFootprintEstimation.entity";
import { CarbonFootprintEstimationService } from "./carbonFootprintEstimation.service";

@Module({
    imports: [TypeOrmModule.forFeature([CarbonFootprintEstimation, CarbonEmissionFactor])],
    providers: [CarbonFootprintEstimationService],
    controllers: [CarbonFootprintEstimationController],
})
export class CarbonFootprintEstimationModule { }
