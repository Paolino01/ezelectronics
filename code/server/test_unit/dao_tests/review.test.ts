import { describe, test, expect, jest } from "@jest/globals";
import ProductReviewDAO from "../../src/dao/reviewDAO";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import { ProductReview } from "../../src/components/review";
import { NoReviewProductError } from "../../src/errors/reviewError";

jest.mock("../../src/db/db.ts");

describe("ProductReviewDAO test", () => {
    test("Insert new product review", async () => {
        const testReview = new ProductReview(
            "Model XYZ",
            "John Doe",
            5,
            "2024-06-10",
            "Great product!"
        );

        const reviewDAO = new ProductReviewDAO();
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        const result = await reviewDAO.addReview(testReview);
        expect(result).toBe(undefined);
        mockDBRun.mockRestore();
    });

    test("Insert new product review - duplicate", async () => {
        const testReview = new ProductReview(
            "Model XYZ",
            "John Doe",
            5,
            "2024-06-10",
            "Great product!"
        );

        const reviewDAO = new ProductReviewDAO();
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("UNIQUE constraint failed"));
            return {} as Database;
        });

        try {
            await reviewDAO.addReview(testReview); // Attempt to insert the same review twice
        } catch(e) {
            expect(e.customCode).toBe(409);
        }

        mockDBRun.mockRestore();
    });

    test("Get product reviews by model", async () => {
        const reviewDAO = new ProductReviewDAO();
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, ...params) => {
            const callback = params.pop(); // Last argument is the callback
            const testReviews = [
                new ProductReview("Model XYZ", "John Doe", 5, "2024-06-10", "Great product!"),
                new ProductReview("Model XYZ", "Jane Smith", 4, "2024-06-11", "Nice product!")
            ];
            callback(null, testReviews);
            return {} as Database;
        });
    
        const response = await reviewDAO.getProductReviews("Model XYZ");
        expect(response).toHaveLength(2);
        expect(response[0]).toEqual(expect.objectContaining({
            model: "Model XYZ",
            user: "John Doe",
            score: 5,
            date: "2024-06-10",
            comment: "Great product!"
        }));
        expect(response[1]).toEqual(expect.objectContaining({
            model: "Model XYZ",
            user: "Jane Smith",
            score: 4,
            date: "2024-06-11",
            comment: "Nice product!"
        }));
    
        mockDBAll.mockRestore();
    });

    test("Delete product review", async () => {
        const reviewDAO = new ProductReviewDAO();
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, ...params) => {
            const callback = params.pop(); // Last argument is the callback
            callback.call({ changes: 1 }, null);
            return {} as Database;
        });

        await expect(reviewDAO.deleteReview("Model XYZ", "John Doe")).resolves.toBeUndefined();

        mockDBRun.mockRestore();
    });

    test("Delete product review - not found", async () => {
        const reviewDAO = new ProductReviewDAO();
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, ...params) => {
            const callback = params.pop(); // Last argument is the callback
            callback.call({ changes: 0 }, null);
            return {} as Database;
        });

        await expect(reviewDAO.deleteReview("Model XYZ", "John Doe")).rejects.toThrow(NoReviewProductError);

        mockDBRun.mockRestore();
    });
});
