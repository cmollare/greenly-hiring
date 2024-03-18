import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { getTestEmissionFactor } from "../seed-dev-data";
import { CarbonFootprintEstimation } from "./carbonFootprintEstimation.entity";
import { CarbonFootprintEstimationService } from "./carbonFootprintEstimation.service";

let flourEmissionFactor = getTestEmissionFactor("flour");
let hamEmissionFactor = getTestEmissionFactor("ham");
let olivedOilEmissionFactor = getTestEmissionFactor("oliveOil");
let productsToEstimate = {
    source: "Agrybalise",
    products: [
        { name: "flour", quantity: 2, unit: "kg" },
        { name: "ham", quantity: 1, unit: "kg" },
    ]
};

let carbonFootPrintEstimationService: CarbonFootprintEstimationService;

beforeAll(async () => {
    await dataSource.initialize();
    carbonFootPrintEstimationService = new CarbonFootprintEstimationService(
        dataSource.getRepository(CarbonEmissionFactor),
        dataSource.getRepository(CarbonFootprintEstimation)
    );

    await GreenlyDataSource.cleanDatabase();
    await dataSource
        .getRepository(CarbonEmissionFactor)
        .save(flourEmissionFactor);
    await dataSource
        .getRepository(CarbonEmissionFactor)
        .save(hamEmissionFactor);
});


describe("CarbonFootprintEstimation.service", () => {
    it("should compute and save estimation", async () => {
        await carbonFootPrintEstimationService.computeCarbonFootprint(productsToEstimate);

        const expected = await dataSource
            .getRepository(CarbonFootprintEstimation)
            .findOne({ where: { emissionCO2: 0.39 } });
        expect(expected?.source).toBe("Agrybalise");
    });
    it("should retrieve previously computed estimations", async () => {
        const carbonFootPrintEstimations = await carbonFootPrintEstimationService.findAll();
        expect(carbonFootPrintEstimations).toHaveLength(1);
        expect(carbonFootPrintEstimations[0].emissionCO2).toBe(0.39);
        expect(carbonFootPrintEstimations[0].source).toBe("Agrybalise");
    });

    it("should set a null emissionC02 if a product is not found", async () => {
        const productsToEstimate = {
            source: "Agrybalise",
            products: [
                { name: "flour", quantity: 2, unit: "kg" },
                { name: "unknownProduct", quantity: 100, unit: "kg" },
                { name: "unknownUnit", quantity: 100, unit: "g" }
            ]
        };
        await carbonFootPrintEstimationService.computeCarbonFootprint(productsToEstimate);
        const carbonFootPrintEstimations = await carbonFootPrintEstimationService.findAll();
        expect(carbonFootPrintEstimations).toHaveLength(2);
        expect(carbonFootPrintEstimations[1].emissionCO2).toBeNull();
    });
});

afterAll(async () => {
    await dataSource.destroy();
});
