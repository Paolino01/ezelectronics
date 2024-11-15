import { describe, test, expect, jest } from "@jest/globals";
import ReviewController from "../../src/controllers/reviewController";
import { User, Role } from "../../src/components/user";
import { ProductReview } from "../../src/components/review";
import ReviewDAO from "../../src/dao/reviewDAO";
import ProductDAO from "../../src/dao/productDAO";

jest.mock("../../src/dao/reviewDAO");
jest.mock("../../src/dao/productDAO");

describe("ReviewController test", () => {
    const mockReviewDAO = new ReviewDAO() as jest.Mocked<ReviewDAO>;
    const mockProductDAO = new ProductDAO() as jest.Mocked<ProductDAO>;
    const reviewController = new ReviewController();
    reviewController['dao'] = mockReviewDAO;
    reviewController['productDao'] = mockProductDAO;

    const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "Test Address", "2000-01-01");
    const testReview = new ProductReview("testModel", "testUser", 4, "2024-06-11", "Test Comment");


    test("Add a new review", async () => {
        mockReviewDAO.addReview.mockResolvedValueOnce();

        await expect(reviewController.addReview("testModel", testUser, 4, "Test Comment")).resolves.toBeUndefined();
        expect(mockReviewDAO.addReview).toHaveBeenCalledWith(expect.objectContaining({
            model: "testModel",
            user: "testUser",
            score: 4,
            date: expect.any(String),
            comment: "Test Comment"
        }));
    });


    test("Get all reviews for a product", async () => {
        mockReviewDAO.getProductReviews.mockResolvedValueOnce([testReview]);

        const reviews = await reviewController.getProductReviews("testModel");
        expect(reviews).toEqual([testReview]);
        expect(mockReviewDAO.getProductReviews).toHaveBeenCalledWith("testModel");
    });

    test("Delete a review", async () => {
   
        mockReviewDAO.deleteReview.mockResolvedValueOnce();

        await expect(reviewController.deleteReview("testModel", testUser)).resolves.toBeUndefined();
        expect(mockProductDAO.getProduct).toHaveBeenCalledWith("testModel");
        expect(mockReviewDAO.deleteReview).toHaveBeenCalledWith("testModel", "testUser");
    });

    test("Delete all reviews for a product", async () => {
   
        mockReviewDAO.deleteReviewsOfProduct.mockResolvedValueOnce();

        await expect(reviewController.deleteReviewsOfProduct("testModel")).resolves.toBeUndefined();
        expect(mockProductDAO.getProduct).toHaveBeenCalledWith("testModel");
        expect(mockReviewDAO.deleteReviewsOfProduct).toHaveBeenCalledWith("testModel");
    });

    test("Delete all reviews", async () => {
        mockReviewDAO.deleteAllReviews.mockResolvedValueOnce();

        await expect(reviewController.deleteAllReviews()).resolves.toBeUndefined();
        expect(mockReviewDAO.deleteAllReviews).toHaveBeenCalledTimes(1);
    });
});
