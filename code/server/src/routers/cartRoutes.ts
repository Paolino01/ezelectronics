import express, { Router } from "express"
import ErrorHandler from "../helper"
import { body, check, param, validationResult } from "express-validator"
import CartController from "../controllers/cartController"
import Authenticator from "./auth"

/**
 * Represents a class that defines the routes for handling carts.
 */
class CartRoutes {
    private controller: CartController
    private router: Router
    private errorHandler: ErrorHandler
    private authenticator: Authenticator

    /**
     * Constructs a new instance of the CartRoutes class.
     * @param {Authenticator} authenticator - The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authenticator = authenticator
        this.controller = new CartController()
        this.router = express.Router()
        this.errorHandler = new ErrorHandler()
        this.initRoutes()
    }

    /**
     * Returns the router instance.
     * @returns The router instance.
     */
    getRouter(): Router {
        return this.router
    }

    /**
     * Initializes the routes for the cart router.
     * 
     * @remarks
     * This method sets up the HTTP routes for creating, retrieving, updating, and deleting cart data.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     */
    initRoutes() {

        /**
         * Route for getting the cart of the logged in customer.
         * It requires the user to be logged in and to be a customer.
         * It returns the cart of the logged in customer.
         */
        this.router.get(
            "/",
            (req: any, res: any, next: any) => this.authenticator.isCustomer(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user

                this.controller.getCart(user)
                .then((cart: any /**Cart */) => {
                    res.status(200).json(cart)
                })
                .catch((err) => {
                    next(err)
                })
            }
        )

        /**
         * Route for adding a product unit to the cart of the logged in customer.
         * It requires the user to be logged in and to be a customer.
         * It requires the following body parameters:
         * - model: string. It cannot be empty, it must represent an existing product model, and the product model's available quantity must be above 0
         * It returns a 200 status code if the product was added to the cart.
         */
        this.router.post(
            "/",
            [
                check("model").isString().trim().isLength({min: 1}).withMessage("Nome prodotto non valido")
            ],
            (req: any, res: any, next: any) => this.authenticator.isCustomer(req, res, next),
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array()[0]["msg"] });
                }

                const user = req.user
                const model = req.body.model.trim()

                if(model.trim().length > 0) {
                    this.controller.addToCart(user, model)
                    .then(() => res.status(200).end())
                    .catch((err) => {
                        next(err)
                    })
                }
            }
        )

        /**
         * Route for checking out the cart of the logged in customer.
         * It requires the user to be logged in and to be a customer.
         * It returns a 200 status code if the cart was checked out.
         * It fails if the cart is empty, there is no current cart in the database, or at least one of the products in the cart is not available in the required quantity.
         */
        this.router.patch(
            "/",
            (req: any, res: any, next: any) => this.authenticator.isCustomer(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user

                this.controller.checkoutCart(user)
                .then(() => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
            }
        )

        /**
         * Route for getting the history of the logged in customer's carts.
         * It requires the user to be logged in and to be a customer.
         * It returns the history of the logged in customer's carts (only carts that have been paid for are returned - the current cart is not included in the list).
         */
        this.router.get(
            "/history",
            (req: any, res: any, next: any) => this.authenticator.isCustomer(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user
                
                this.controller.getCustomerCarts(user)
                .then((carts: any /**Cart[] */) => res.status(200).json(carts))
                .catch((err) => next(err))
            }
        )

        /**
         * Route for removing a product unit from a cart.
         * It requires the user to be logged in and to be a customer.
         * It requires the model of the product to remove as a route parameter. The model must be a non-empty string, the product must exist, must be in the current cart, and the customer must have a current cart
         * It returns a 200 status code if the product was removed from the cart.
         */
        this.router.delete(
            "/products/:model",
            [
                check("model").isString().trim().isLength({min: 1}).withMessage("Nome prodotto non valido")
            ],
            (req: any, res: any, next: any) => this.authenticator.isCustomer(req, res, next),
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array()[0]["msg"] });
                }
                
                const user = req.user
                const model = req.params.model.trim()

                this.controller.removeProductFromCart(user, model)
                .then(() => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
            }
        )

        /**
         * Route for removing all products from the current cart.
         * It requires the user to be logged in and to be a customer.
         * It fails if the user does not have a current cart.
         * It returns a 200 status code if the products were removed from the cart.
         */
        this.router.delete(
            "/current",
            (req: any, res: any, next: any) => this.authenticator.isCustomer(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user

                this.controller.clearCart(user)
                .then(() => res.status(200).end())
                .catch((err) => next(err))
            }
        )

        /**
         * Route for deleting all carts.
         * It requires the user to be authenticated and to be either an admin or a manager.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/",
            (req: any, res: any, next: any) => this.authenticator.isAdminOrManager(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user

                this.controller.deleteAllCarts()
                .then(() => res.status(200).end())
                .catch((err: any) => next(err))
            }
        )

        /**
         * Route for retrieving all carts of all users
         * It requires the user to be authenticated and to be either an admin or a manager.
         * It returns an array of carts.
         */
        this.router.get(
            "/all",
            (req: any, res: any, next: any) => this.authenticator.isAdminOrManager(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user

                this.controller.getAllCarts()
                .then((carts: any/**Cart[] */) => res.status(200).json(carts))
                .catch((err: any) => next(err))
            }
        )
    }
}

export default CartRoutes