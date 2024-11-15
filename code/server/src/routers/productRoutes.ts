import express, { Router } from "express"
import ErrorHandler from "../helper"
import { body, param, query, validationResult } from "express-validator"
import ProductController from "../controllers/productController"
import Authenticator from "./auth"
import { Product } from "../components/product"

/**
 * Represents a class that defines the routes for handling proposals.
 */
class ProductRoutes {
    private controller: ProductController
    private router: Router
    private errorHandler: ErrorHandler
    private authenticator: Authenticator

    /**
     * Constructs a new instance of the ProductRoutes class.
     * @param {Authenticator} authenticator - The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authenticator = authenticator
        this.controller = new ProductController()
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
     * Initializes the routes for the product router.
     * 
     * @remarks
     * This method sets up the HTTP routes for handling product-related operations such as registering products, registering arrivals, selling products, retrieving products, and deleting products.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     * 
     */
    initRoutes() {

        /**
         * Route for registering the arrival of a set of products.
         * It requires the user to be logged in and to be either an admin or a manager.
         * It requires the following parameters:
         * - model: string. It cannot be empty and it cannot be repeated in the database.
         * - category: string (one of "Smartphone", "Laptop", "Appliance")
         * - quantity: number. It must be greater than 0.
         * - details: string. It can be empty.
         * - sellingPrice: number. It must be greater than 0.
         * - arrivalDate: string. It can be omitted. If present, it must be a valid date in the format YYYY-MM-DD that is not after the current date
         * It returns a 200 status code if the arrival was registered successfully.
         */
        this.router.post(
            "/",
            [
                body('model').isString().trim().notEmpty().withMessage('Model can\'t be an empty string'),
                body('category').isString().trim().isIn(['Smartphone', 'Laptop', 'Appliance']).withMessage('Category must be one of "Smartphone", "Laptop", "Appliance"'),
                body('quantity').isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
                body('details').optional().isString().withMessage('Details must be a string'),
                body('sellingPrice').isFloat({ gt: 0 }).withMessage('Selling price must be greater than 0'),
                body('arrivalDate').optional().isISO8601({ strict: true, strictSeparator: true }).withMessage('Arrival date must be a valid date in the format YYYY-MM-DD')
            ],
            (req: any, res: any, next: any) => this.authenticator.isAdminOrManager(req, res, next),
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    // Se ci sono errori di validazione, restituiamo un errore 400 con i dettagli degli errori
                    return res.status(422).json({ errors: errors.array() });
                }
                
                this.controller.registerProducts(req.body.model.trim(), req.body.category.trim(), req.body.quantity, req.body.details, req.body.sellingPrice, req.body.arrivalDate)
                .then(() => res.status(200).end())
                .catch((err) => next(err))
            }
        )

        /**
         * Route for registering the increase in quantity of a product.
         * It requires the user to be logged in and to be either an admin or a manager.
         * It requires the product model as a request parameter. The model must be a string and cannot be empty, and it must represent an existing product.
         * It requires the following body parameters:
         * - quantity: number. It must be greater than 0. This number represents the increase in quantity, to be added to the existing quantity.
         * - changeDate: string. It can be omitted. If present, it must be a valid date in the format YYYY-MM-DD that is not after the current date and is after the arrival date of the product.
         * It returns the new quantity of the product.
         */
        this.router.patch(
            "/:model",
            [
                param('model').isString().trim().notEmpty().withMessage('Model can\'t be an empty string'),
                body('quantity').isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
                body('changeDate').optional().isISO8601({ strict: true, strictSeparator: true }).withMessage('Change date must be a valid date in the format YYYY-MM-DD')
            ],
            (req: any, res: any, next: any) => this.authenticator.isAdminOrManager(req, res, next),
            (req: any, res: any, next: any) => {

                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    // Se ci sono errori di validazione, restituiamo un errore 400 con i dettagli degli errori
                    return res.status(422).json({ errors: errors.array() });
                }
                
                this.controller.changeProductQuantity(req.params.model.trim(), req.body.quantity, req.body.changeDate)
                .then((quantity: any /**number */) => res.status(200).json({ quantity: quantity }))
                .catch((err) => next(err))
            }
        )

        /**
         * Route for selling a product.
         * It requires the user to be logged in and to be either an admin or a manager.
         * It requires the product model as a request parameter. The model must be a string and cannot be empty, and it must represent an existing product.
         * It requires the following body parameters:
         * - quantity: number. It must be greater than 0. This number represents the quantity of units sold. It must be less than or equal to the available quantity of the product.
         * - sellingDate: string. It can be omitted. If present, it must be a valid date in the format YYYY-MM-DD that is not after the current date and is after the arrival date of the product.
         * It returns the new quantity of the product.
         */
        this.router.patch(
            "/:model/sell",
            [
                param('model').isString().trim().notEmpty().withMessage('Model can\'t be an empty string'),
                body('quantity').isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
                body('sellingDate').optional().isISO8601({ strict: true, strictSeparator: true }).withMessage('Selling date must be a valid date in the format YYYY-MM-DD')
            ],
            (req: any, res: any, next: any) => this.authenticator.isAdminOrManager(req, res, next),
            (req: any, res: any, next: any) => {

                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    // Se ci sono errori di validazione, restituiamo un errore 400 con i dettagli degli errori
                    return res.status(422).json({ errors: errors.array() });
                }

                this.controller.sellProduct(req.params.model.trim(), req.body.quantity, req.body.sellingDate)
                .then((quantity: any /**number */) => res.status(200).json({ quantity: quantity }))
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
            }
        )

        /**
         * Route for retrieving all products.
         * It requires the user to be logged in and to be either an admin or a manager
         * It can have the following optional query parameters:
         * - grouping: string. It can be either "category" or "model". If absent, then all products are returned and the other query parameters must also be absent.
         * - category: string. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
         * - model: string. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
         * It returns an array of Product objects.
         */
        this.router.get(
            "/",
            [ 
                query('grouping').isString().trim().isIn(['category', 'model']).optional().withMessage('Grouping must be one of "category", "model"'),
                query('category').isString().trim().isIn(['Smartphone', 'Laptop', 'Appliance']).optional().withMessage('Category must be one of "Smartphone", "Laptop", "Appliance"')
            ],
            (req: any, res: any, next: any) => this.authenticator.isAdminOrManager(req, res, next),
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
                this.controller.getProducts(req.query.grouping, req.query.category, req.query.model)
                .then((products: any /*Product[]*/) => res.status(200).json(products))
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
            }
        )


        /**
         * Route for retrieving all available products.
         * It requires the user to be logged in.
         * It can have the following optional query parameters:
         * - grouping: string. It can be either "category" or "model". If absent, then all products are returned and the other query parameters must also be absent.
         * - category: string. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
         * - model: string. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
         * It returns an array of Product objects.
         */
        this.router.get(
            "/available",
            [ 
                query('grouping').isString().trim().isIn(['category', 'model']).optional().withMessage('Grouping must be one of "category", "model"'),
                query('category').isString().trim().isIn(['Smartphone', 'Laptop', 'Appliance']).optional().withMessage('Category must be one of "Smartphone", "Laptop", "Appliance"')
            ],
            (req: any, res: any, next: any) => this.authenticator.isLoggedIn(req, res, next),
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
                this.controller.getAvailableProducts(req.query.grouping, req.query.category, req.query.model)
                .then((products: any/*Product[]*/) => res.status(200).json(products))
                .catch((err) => next(err))
            }
        )

        /**
         * Route for deleting all products.
         * It requires the user to be logged in and to be either an admin or a manager.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/",
            (req: any, res: any, next: any) => this.authenticator.isAdminOrManager(req, res, next),
            (req: any, res: any, next: any) => this.controller.deleteAllProducts()
                .then(() => res.status(200).end())
                .catch((err: any) => next(err))
        )

        /**
         * Route for deleting a product.
         * It requires the user to be logged in and to be either an admin or a manager.
         * It requires the product model as a request parameter. The model must be a string and cannot be empty, and it must represent an existing product.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/:model",
            [
                param('model').isString().trim().notEmpty().withMessage('Model can\'t be an empty string')
            ],
            (req: any, res: any, next: any) => this.authenticator.isAdminOrManager(req, res, next),
            (req: any, res: any, next: any) => {

                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    // Se ci sono errori di validazione, restituiamo un errore 400 con i dettagli degli errori
                    return res.status(400).json({ errors: errors.array() });
                }
                
                this.controller.deleteProduct(req.params.model.trim())
                .then(() => res.status(200).end())
                .catch((err: any) => next(err))
            }
        )


    }
}

export default ProductRoutes