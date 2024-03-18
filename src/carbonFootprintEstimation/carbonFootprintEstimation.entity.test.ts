import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonFootprintEstimation } from "./carbonFootprintEstimation.entity";

let carbonFootprintEstimation: CarbonFootprintEstimation;
beforeAll(async () => {
    await dataSource.initialize();
    carbonFootprintEstimation = new CarbonFootprintEstimation({
        emissionCO2: 2.4,
        source: "TotoTable",
    });
});
beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("CarbonFoodPrintEstimation Entity tests", () => {
    describe("constructor test", () => {
        it("should create a carbon footprint estimation", () => {
            carbonFootprintEstimation = new CarbonFootprintEstimation({
                emissionCO2: 2.4,
                source: "TotoTable",
            });

            expect(carbonFootprintEstimation.emissionCO2).toBe(2.4);
            expect(carbonFootprintEstimation.source).toBe("TotoTable");
        });
        it("should throw an error if the source of estimation is empty", () => {
            expect(() => {
                const carbonFootprintEstimation = new CarbonFootprintEstimation({
                    emissionCO2: 2.4,
                    source: "",
                });
            }).toThrow();
        });
    });
});

afterAll(async () => {
    await dataSource.destroy();
});
