import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonFootprintEstimation } from "./carbonFootprintEstimation.entity";
import { EstimateCarbonFootprintDto } from "./dto/estimate-carbonFootprint.dto";

@Injectable()
export class CarbonFootprintEstimationService {
    constructor(
        @InjectRepository(CarbonEmissionFactor)
        private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>,
        @InjectRepository(CarbonFootprintEstimation)
        private carbonFootprintEstimationRepository: Repository<CarbonFootprintEstimation>
    ) { }

    async computeCarbonFootprint(
        estimateCarbonFootprintDto: EstimateCarbonFootprintDto
    ): Promise<CarbonFootprintEstimation | null> {

        const carbonEmissionEstimations = await this.retrieveProductCarbonEmission(estimateCarbonFootprintDto)

        if (carbonEmissionEstimations.includes(-1)) {
            return await this.carbonFootprintEstimationRepository.save({ source: estimateCarbonFootprintDto.source, emissionCO2: null });
        }

        const carbonEmissionEstimation = carbonEmissionEstimations.reduce((a, b) => a + b, 0);

        return await this.carbonFootprintEstimationRepository.save({ source: estimateCarbonFootprintDto.source, emissionCO2: carbonEmissionEstimation });
    }

    private retrieveProductCarbonEmission(estimateCarbonFootprintDto: EstimateCarbonFootprintDto) {
        const carbonEmissionEstimations = estimateCarbonFootprintDto.products.map(
            async (product) => {
                const carbonEmissionFactor = await this.carbonEmissionFactorRepository.findOne({
                    where: { name: product.name, source: estimateCarbonFootprintDto.source, unit: product.unit }
                });
                if (!carbonEmissionFactor) return -1;
                return carbonEmissionFactor.emissionCO2eInKgPerUnit * product.quantity;
            }
        );

        return Promise.all(carbonEmissionEstimations);
    }

    findAll(): Promise<CarbonFootprintEstimation[]> {
        return this.carbonFootprintEstimationRepository.find();
    }
}
