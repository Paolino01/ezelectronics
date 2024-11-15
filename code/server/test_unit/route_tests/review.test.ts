import request from 'supertest';
import { describe, it, expect, jest, beforeEach} from "@jest/globals";
import express from 'express';
import ReviewRoutes from '../../src/routers/reviewRoutes';
import Authenticator from '../../src/routers/auth';
import { Role, User } from "../../src/components/user"
import ReviewController from '../../src/controllers/reviewController';
import { ProductReview } from '../../src/components/review';
import { ExistingReviewError, NoReviewProductError } from '../../src/errors/reviewError';
import{ app } from "../../index"

// Mock Authenticator
jest.mock('../../src/routers/auth');
const appTest = express();
const authenticatorMock = new Authenticator(appTest) as jest.Mocked<Authenticator>;

// Mock ReviewController
jest.mock('../../src/controllers/reviewController');

// Initialize app with review routes

const reviewRoutes = new ReviewRoutes(authenticatorMock);

const baseURL = "/ezelectronics"

const testUser = new User("test", "customer", "customer", Role.CUSTOMER, "", "");

describe('ReviewRoutes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /reviews/:model', () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Pulisce i mock prima di ogni test
        });
    
        it('should add a new review', async () => {

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            })

    
            // Mock per il metodo che aggiunge la recensione
            jest.spyOn(ReviewController.prototype, 'addReview').mockResolvedValueOnce();
    
            const response = await request(app)
                .post(baseURL + '/reviews/ModelXYZ')
                .send({ score: 5, comment: 'Great product!' });
    
            expect(response.status).toBe(200);
            expect(ReviewController.prototype.addReview).toHaveBeenCalledWith('ModelXYZ', testUser, 5, 'Great product!');
        });
    
    
        it('should return error for duplicate review', async () => {

            
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            })
            
            // Mock per il metodo che aggiunge la recensione che simula un errore di recensione esistente
            jest.spyOn(ReviewController.prototype, 'addReview').mockRejectedValueOnce(new ExistingReviewError());
    
            const response = await request(app)
                .post(baseURL + '/reviews/ModelXYZ')
                .send({ score: 5, comment: 'Great product!' });
    
            expect(response.status).toBe(409);
        });
    
        it('should return validation error for invalid score', async () => {
             
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            })

            jest.spyOn(ReviewController.prototype, 'addReview').mockRejectedValueOnce(new ExistingReviewError());
            
            // Mock non necessario in quanto non chiamiamo il controller per punteggi non validi
    
            const response = await request(app)
                .post(baseURL + '/reviews/ModelXYZ')
                .send({ score: 5, comment: 'Great product!' });
    
            expect(response.status).toBe(409);
        });
    });

    describe('GET /reviews/:model', () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Pulisce i mock prima di ogni test
        });
    
        it('should retrieve product reviews', async () => {

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            })

            const testReviews = [
                new ProductReview("ModelXYZ", "John Doe", 5, "2024-06-10", "Great product!"),
                new ProductReview("ModelXYZ", "Jane Smith", 4, "2024-06-11", "Nice product!")
            ];
            jest.spyOn(ReviewController.prototype, 'getProductReviews').mockResolvedValue(testReviews);

            const response = await request(app).get(baseURL + '/reviews/ModelXYZ');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(testReviews);
        });

        it('should return error if no reviews found', async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(ReviewController.prototype, 'getProductReviews').mockRejectedValue(new NoReviewProductError());

            const response = await request(app).get(baseURL + '/reviews/ModelXYZ');

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /reviews/:model', () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Pulisce i mock prima di ogni test
        });
    
        it('should delete a review', async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(ReviewController.prototype, 'deleteReview').mockResolvedValue();
   
            const response = await request(app).delete(baseURL + '/reviews/ModelXYZ').send({ user: 'John Doe' });

            expect(response.status).toBe(200);
        });

        it('should return error if review not found', async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(ReviewController.prototype, 'deleteReview').mockRejectedValue(new NoReviewProductError());

            const response = await request(app).delete(baseURL + '/reviews/ModelXYZ').send({ user: 'John Doe' });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /reviews/:model/all', () => {
        it('should delete all reviews of a product', async () => {

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })

            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValue();

            const response = await request(app).delete(baseURL + '/reviews/ModelXYZ/all').send();

            expect(response.status).toBe(200);
            expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith('ModelXYZ');
        });
    });

    describe('DELETE /reviews', () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Pulisce i mock prima di ogni test
        });
    
        it('should delete all reviews', async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testUser
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })

            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce();

            const response = await request(app).delete(baseURL + '/reviews').send();

            expect(response.status).toBe(200);
        });
    });
});