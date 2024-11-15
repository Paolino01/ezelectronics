import { describe, test, expect, beforeAll, afterEach, afterAll, jest } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"

import CartController from "../../src/controllers/cartController"
import Authenticator from "../../src/routers/auth"
import { Role, User } from "../../src/components/user"
import { Cart, ProductInCart } from "../../src/components/cart"
import { Product, Category } from "../../src/components/product"
import ErrorHandler from "../../src/helper"
import { check } from "express-validator"
const baseURL = "/ezelectronics/carts"

//For unit tests, we need to validate the internal logic of a single component, without the need to test the interaction with other components
//For this purpose, we mock (simulate) the dependencies of the component we are testing
jest.mock("../../src/controllers/cartController")
jest.mock("../../src/routers/auth")


const paoloCagliero = new User("paoloCagliero", "customer", "customer", Role.CUSTOMER, "", "");

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Cart routes unit tests", () => {

    describe("GET /", () => {

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Get current cart of the logged in user", async () => {

            //We mock the Authenticator isCustomer method to return the next function, because we are not testing the Authenticator logic here (we assume it works correctly)
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                req.user = paoloCagliero;
                return next();
            });

            //We mock the ErrorHandler validateRequest method to return the next function, because we are not testing the validation logic here (we assume it works correctly)
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });

            const productsInCart = [
                new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
            ];
            const expected = new Cart("paoloCagliero", false, null, 4799.94, productsInCart);
            
            //We mock the cartController getCart method
            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(expected);

            const response = await request(app).get(baseURL + "/");
            expect(response.status).toBe(200);
            expect(CartController.prototype.getCart).toHaveBeenCalled();
            expect(CartController.prototype.getCart).toHaveBeenCalledWith(paoloCagliero);
            expect(response.body).toEqual(expected);

        })


        test("The user is not logged in as a Customer", async () => {

            //In this case, we are testing the situation where the route returns an error code because the user is not an Admin
            //We mock the 'isAdmin' method to return a 401 error code, because we are not testing the Authenticator logic here (we assume it works correctly)
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })
            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).get(baseURL + "/")
            expect(response.status).toBe(401)

        })

    })   
    
    
    describe("POST /", () => {

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Add a product instance", async () => {

            jest.mock('express-validator', () => ({
                check: jest.fn().mockImplementation(() => ({
                    isLength: () => ({ isLength: () => ({}) })
                })),
            }))

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                req.user = paoloCagliero;
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)

            const response = await request(app).post(baseURL + "/").send({model: "P004"})
            expect(response.status).toBe(200)
            expect(CartController.prototype.addToCart).toHaveBeenCalled()
            expect(CartController.prototype.addToCart).toHaveBeenCalledWith(paoloCagliero, "P004")
            
        })


        test("The user is not logged in as a Customer", async () => {

            //In this case, we are testing the situation where the route returns an error code because the user is not an Admin
            //We mock the 'isAdmin' method to return a 401 error code, because we are not testing the Authenticator logic here (we assume it works correctly)
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })
            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).post(baseURL + "/").send({model: "P004"})
            expect(response.status).toBe(401)

        })


        test("model is an empty string", async () => {

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            })

            jest.mock('express-validator', () => ({
                check: jest.fn().mockImplementation(() => {
                    throw new Error("model can't be an empty string");
                }),
            }));

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return res.status(422).json({ error: "The body is not formatted properly\n\n" });
            })

            const response = await request(app).post(baseURL + "/").send({model: ""})
            expect(response.status).toBe(422)

        })

    })  


    describe("PATCH /", () => {

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Payment for the current cart of the logged in user", async () => {

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                req.user = paoloCagliero;
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true)

            const response = await request(app).patch(baseURL + "/")
            expect(response.status).toBe(200)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalled()
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(paoloCagliero)
            
        })


        test("The user is not logged in as a Customer", async () => {

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })

            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).patch(baseURL + "/")
            expect(response.status).toBe(401)

        })

    }) 
    
    
    describe("GET /history", () => {

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Get the history of the carts that have been paid for by the current user", async () => {

            //We mock the Authenticator isCustomer method to return the next function, because we are not testing the Authenticator logic here (we assume it works correctly)
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                req.user = paoloCagliero;
                return next();
            });

            //We mock the ErrorHandler validateRequest method to return the next function, because we are not testing the validation logic here (we assume it works correctly)
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });

            const productsInCart = [
                new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
                ];
    
                const expected = [
                new Cart("paoloCagliero", true, "2024-06-05", 4799.94, productsInCart)
                ];

            jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce(expected);

            const response = await request(app).get(baseURL + "/history");
            expect(response.status).toBe(200);
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalled();
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledWith(paoloCagliero);
            expect(response.body).toEqual(expected);

        })


        test("The user is not logged in as a Customer", async () => {

            //In this case, we are testing the situation where the route returns an error code because the user is not an Admin
            //We mock the 'isAdmin' method to return a 401 error code, because we are not testing the Authenticator logic here (we assume it works correctly)
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })
            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).get(baseURL + "/history")
            expect(response.status).toBe(401)

        })

    })   


    describe("DELETE /products/:model", () => {

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Delete an instance of a product from the current cart of the logged in user", async () => {

            jest.mock('express-validator', () => ({
                check: jest.fn().mockImplementation(() => ({
                    isLength: () => ({ isLength: () => ({}) })
                })),
            }))

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                req.user = paoloCagliero;
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)

            const response = await request(app).delete(baseURL + "/products/P004")
            expect(response.status).toBe(200)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalled()
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(paoloCagliero, "P004")
            
        })


        test("The user is not logged in as a Customer", async () => {

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })
            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).delete(baseURL + "/products/P004")
            expect(response.status).toBe(401)

        })

    }) 


    describe("DELETE /current", () => {

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Delete the current cart", async () => {

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                req.user = paoloCagliero;
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true)

            const response = await request(app).delete(baseURL + "/current")
            expect(response.status).toBe(200)
            expect(CartController.prototype.clearCart).toHaveBeenCalled()
            expect(CartController.prototype.clearCart).toHaveBeenCalledWith(paoloCagliero)
            
        })


        test("The user is not logged in as a Customer", async () => {

            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })
            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).delete(baseURL + "/current")
            expect(response.status).toBe(401)

        })

    }) 


    describe("DELETE /", () => {

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Delete all existing carts of all users", async () => {

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = paoloCagliero;
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)

            const response = await request(app).delete(baseURL + "/")
            expect(response.status).toBe(200)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalled()
            
        })


        test("The user is logged in as neither an Admin nor a Manager", async () => {

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })
            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).delete(baseURL + "/")
            expect(response.status).toBe(401)

        })

    }) 


    describe("GET /all", () => {

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Get all carts of all users", async () => {

            //We mock the Authenticator isCustomer method to return the next function, because we are not testing the Authenticator logic here (we assume it works correctly)
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = paoloCagliero;
                return next();
            });

            //We mock the ErrorHandler validateRequest method to return the next function, because we are not testing the validation logic here (we assume it works correctly)
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });

            const productsInCartPaolo = [
                new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
            ];
          
            const productsInCartGiorgio = [
            new ProductInCart('P005', 1, Category.APPLIANCE, 499.99)
            ];
          
            let expected = [
            new Cart("paoloCagliero", false, null, 4799.94, productsInCartPaolo),
            new Cart("paoloCagliero", true, "2024-06-05", 4799.94, productsInCartPaolo),
            new Cart("anitaAscheri", false, null, 0, []),
            new Cart("giorgioBongiovanni", false, null, 499.99, productsInCartGiorgio)
            ]

            jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce(expected);

            const response = await request(app).get(baseURL + "/all");
            expect(response.status).toBe(200);
            expect(CartController.prototype.getAllCarts).toHaveBeenCalled();
            expect(response.body).toEqual(expected);

        })


        test("The user is logged in as neither an Admin nor a Manager", async () => {

            //In this case, we are testing the situation where the route returns an error code because the user is not an Admin
            //We mock the 'isAdmin' method to return a 401 error code, because we are not testing the Authenticator logic here (we assume it works correctly)
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })
            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).get(baseURL + "/all")
            expect(response.status).toBe(401)

        })

    }) 


    


})