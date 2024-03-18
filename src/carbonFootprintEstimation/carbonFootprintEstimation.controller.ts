import { Controller } from "@nestjs/common";
import { Body, Get, Post } from "@nestjs/common/decorators/http";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CarbonFootprintEstimation } from "./carbonFootprintEstimation.entity";
import { CarbonFootprintEstimationService } from "./carbonFootprintEstimation.service";
import { EstimateCarbonFootprintDto } from "./dto/estimate-carbonFootprint.dto";


@Controller("carbon-footprint-estimations")
@ApiTags("carbon-footprint-estimations")
export class CarbonFootprintEstimationController {
    constructor(
        private readonly carbonFootprintEstimationService: CarbonFootprintEstimationService
    ) { }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'The list of all carbon footprint estimations by source and kg',
        type: [CarbonFootprintEstimation]
    })
    async getCarbonFootprintEstimations(): Promise<CarbonFootprintEstimation[]> {
        return await this.carbonFootprintEstimationService.findAll();
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'The carbon footprint estimation by source and kg',
        type: CarbonFootprintEstimation
    })
    async computeCarbonFootprint(@Body() body: EstimateCarbonFootprintDto): Promise<CarbonFootprintEstimation | null> {
        return await this.carbonFootprintEstimationService.computeCarbonFootprint(body);
    }

}
