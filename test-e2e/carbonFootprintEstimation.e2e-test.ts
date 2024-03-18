import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonFootprintEstimation } from "../src/carbonFootprintEstimation/carbonFootprintEstimation.entity";
import { getTestEmissionFactor } from "../src/seed-dev-data";

beforeAll(async () => {
    await dataSource.initialize();
    await dataSource.getRepository(CarbonFootprintEstimation).delete({});
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("CarbonFootprintEstimationController", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();


        await dataSource
            .getRepository(CarbonEmissionFactor)
            .save([getTestEmissionFactor("ham"), getTestEmissionFactor("beef")]);

    });

    describe("Functional tests", () => {

        it("GET /carbon-footprint-estimations empty array", async () => {
            return request(app.getHttpServer())
                .get("/carbon-footprint-estimations")
                .expect(200)
                .expect(({ body }) => {
                    expect(body).toEqual([]);
                });
        });

        it("POST /carbon-footprint-estimations", async () => {
            const carbonFootprintEstimationArgs = {
                source: "Agrybalise",
                products: [
                    { name: "flour", quantity: 2, unit: "kg" },
                    { name: "ham", quantity: 0.5, unit: "kg" },
                    { name: "unknownProduct", quantity: 100, unit: "kg" },
                    { name: "unknownUnit", quantity: 100, unit: "g" }
                ],
            };
            const expected = {
                source: "Agrybalise",
                emmissionCO2: 0.055,
            };
            return request(app.getHttpServer())
                .post("/carbon-footprint-estimations")
                .send(carbonFootprintEstimationArgs)
                .expect(201)
                .expect(({ body }) => {
                    expect(body.emissionCO2).toBe(expected.emmissionCO2);
                    expect(body.source).toBe(expected.source);
                    expect(body).toHaveProperty("estimationDate");
                    expect(body).toHaveProperty("id");
                });
        });

        it("GET /carbon-footprint-estimations after POST", async () => {
            const expected = {
                source: "Agrybalise",
                emmissionCO2: 0.055,
            };

            return request(app.getHttpServer())
                .get("/carbon-footprint-estimations")
                .expect(200)
                .expect(({ body }) => {
                    expect(body).toHaveLength(1);
                    expect(body[0].emissionCO2).toBe(expected.emmissionCO2);
                    expect(body[0].source).toBe(expected.source);
                    expect(new Date(body[0].estimationDate)).toBeDefined();
                });
        });
    });

    describe("Validation tests", () => {
        it("POST /carbon-footprint-estimations should return 400 if source is empty", async () => {
            const carbonFootprintEstimationArgs = {
                source: "",
                products: [
                    { name: "flour", quantity: 2, unit: "kg" },
                    { name: "ham", quantity: 0.5, unit: "kg" },
                    { name: "unknownProduct", quantity: 100, unit: "kg" },
                    { name: "unknownUnit", quantity: 100, unit: "g" }
                ],
            };
            return request(app.getHttpServer())
                .post("/carbon-footprint-estimations")
                .send(carbonFootprintEstimationArgs)
                .expect(400)
                .expect(({ body }) => {
                    expect(body.message).toContain("source must not be empty");
                });
        });

        it("POST /carbon-footprint-estimations should return 400 if products is empty", async () => {
            const carbonFootprintEstimationArgs = {
                source: "Agrybalise",
                products: [],
            };
            return request(app.getHttpServer())
                .post("/carbon-footprint-estimations")
                .send(carbonFootprintEstimationArgs)
                .expect(400)
                .expect(({ body }) => {
                    expect(body.message).toContain("products must not be empty");
                });
        });

        it("POST /carbon-footprint-estimations should return 400 if products is not an array", async () => {
            const carbonFootprintEstimationArgs = {
                source: "Agrybalise",
                products: "notAnArray",
            };
            return request(app.getHttpServer())
                .post("/carbon-footprint-estimations")
                .send(carbonFootprintEstimationArgs)
                .expect(400)
                .expect(({ body }) => {
                    expect(body.message).toContain("products must be an array");
                });
        });

        it("POST /carbon-footprint-estimations should return 400 if products is invalid", async () => {
            const carbonFootprintEstimationArgs = {
                source: "Agrybalise",
                products: [
                    { name: "", quantity: 2, unit: 1.2 },
                    { name: 1.2, quantity: 0.5, unit: "" },
                    { name: "unknownProduct", quantity: "toto", unit: "kg" },
                    { name: "unknownUnit", quantity: -1, unit: "g" }
                ],
            };
            return request(app.getHttpServer())
                .post("/carbon-footprint-estimations")
                .send(carbonFootprintEstimationArgs)
                .expect(400)
                .expect(({ body }) => {
                    expect(body.message).toContain("products.0.name must not be empty");
                    expect(body.message).toContain("products.0.unit must be a string");
                    expect(body.message).toContain("products.1.name must be a string");
                    expect(body.message).toContain("products.1.unit must not be empty");
                    expect(body.message).toContain("products.2.quantity must be a number");
                    expect(body.message).toContain("products.3.quantity must be a positive number");
                });
        });
    });
});