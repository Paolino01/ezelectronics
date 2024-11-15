import { test, expect, jest, describe, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import ProductController from "../../src/controllers/productController"
import { Role } from "../../src/components/user"
import Authenticator from "../../src/routers/auth"
import { Category, Product } from "../../src/components/product"

//import ProductController from "../../src/controllers/productController"
const baseURL = "/ezelectronics"

jest.mock("../../src/controllers/productController")
jest.mock("../../src/routers/auth")

let testProduct1 = new Product(800.00, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 3)
let testProduct2 = new Product(1200.00, "Macbook Pro", Category.LAPTOP, "2024-02-01", "", 0)

describe("productRoute", () => {
    describe("insertProduct", () => {
        test("Insert new product", async ()=> {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.registerProducts).toHaveBeenCalled()
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
                inputProduct.model,
                inputProduct.category,
                inputProduct.quantity,
                inputProduct.details,
                inputProduct.sellingPrice,
                inputProduct.arrivalDate
            )
        })

        test("Insert new product - null model", async ()=> {
            const inputProduct: { model: string | null, category: string | null, quantity: number | null, details: string | null, sellingPrice: number | null, arrivalDate: string | null} = {
                model: null,
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - no details", async ()=> {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.registerProducts).toHaveBeenCalled()
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
                inputProduct.model,
                inputProduct.category,
                inputProduct.quantity,
                inputProduct.details,
                inputProduct.sellingPrice,
                inputProduct.arrivalDate
            )
        })

        test("Insert new product - empty model", async ()=> {
            const inputProduct = {
                model: "",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - no category", async ()=> {
            const inputProduct = {
                model: "iPhone13",
                category: "",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - wrong category", async ()=> {
            const inputProduct = {
                model: "iPhone13",
                category: "asdfg",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - negative quantity", async ()=> {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: -7,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - quantity = 0", async ()=> {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 0,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - price = 0", async ()=> {
            const inputProduct = {
                model: "",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 0,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - negative price", async ()=> {
            const inputProduct = {
                model: "",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: -700.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - price is a string", async ()=> {
            const inputProduct = {
                model: "",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: "600.00",
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - wrong date format", async ()=> {
            const inputProduct = {
                model: "",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 600.00,
                arrivalDate: "01/01/2024"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(422)
        })

        test("Insert new product - user not admin or manager", async ()=> {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce()

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "User is not an admin or manager", status: 401 })
            })
            
            const response = await request(app).post(baseURL + "/products").send(inputProduct)
            expect(response.status).toBe(401)
        })
    })

    describe("increaseProductQuantity", () => {
        test("Increase Product quantity", async ()=> {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: 3,
                changeDate: "2024-02-01"
            }

            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(8)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel).send(inputQuantity)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalled()
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
                inputModel,
                inputQuantity.quantity,
                inputQuantity.changeDate
            )
        })

        test("Increase Product quantity - undefined changeDate", async ()=> {
            const inputModel = "iPhone13"
            const inputQuantity: { quantity: number, changeDate: string | undefined | null } = {
                quantity: 3,
                changeDate: undefined
            }

            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(8)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel).send(inputQuantity)
            expect(response.status).toBe(200)                   //TODO: should return 200 even when changeDate = null
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalled()
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
                inputModel,
                inputQuantity.quantity,
                inputQuantity.changeDate
            )
        })

        test("Increase Product quantity - quantity = 0", async ()=> {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: 0,
                changeDate: "2024-02-01"
            }

            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(8)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel).send(inputQuantity)
            expect(response.status).toBe(422)
        })

        test("Increase Product quantity - negative quantity", async ()=> {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: -3,
                changeDate: "2024-02-01"
            }

            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(8)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel).send(inputQuantity)
            expect(response.status).toBe(422)
        })

        test("Increase Product quantity - wrong changeDate format", async ()=> {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: 3,
                changeDate: "2024/02/01"
            }

            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(8)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel).send(inputQuantity)
            expect(response.status).toBe(422)
        })

        test("Increase Product quantity - user not admin or manager", async ()=> {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: 3,
                changeDate: "2024/02/01"
            }

            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(8)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "User is not an admin or manager", status: 401 })
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel).send(inputQuantity)
            expect(response.status).toBe(401)
        })
    })

    describe("sellProduct", () => {
        test("Sell Product", async () => {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: 3,
                sellingDate: "2024-02-01"
            }

            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(2)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel+"/sell").send(inputQuantity)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.sellProduct).toHaveBeenCalled()
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledWith(
                inputModel,
                inputQuantity.quantity,
                inputQuantity.sellingDate
            )
        })

        test("Sell Product - quantity = 0", async () => {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: 0,
                sellingDate: "2024-02-01"
            }

            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(2)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel+"/sell").send(inputQuantity)
            expect(response.status).toBe(422)
        })

        test("Sell Product - negative quantity", async () => {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: -7,
                sellingDate: "2024-02-01"
            }

            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(2)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel+"/sell").send(inputQuantity)
            expect(response.status).toBe(422)
        })

        test("Sell Product - wrong sellingDate format", async () => {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: -7,
                sellingDate: "01/02/2024"
            }

            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(2)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel+"/sell").send(inputQuantity)
            expect(response.status).toBe(422)
        })

        test("Sell Product - undefined sellingDate", async () => {
            const inputModel = "iPhone13"
            const inputQuantity: { quantity: number, sellingDate: string | undefined | null } = {
                quantity: 3,
                sellingDate: undefined
            }

            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(2)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel+"/sell").send(inputQuantity)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.sellProduct).toHaveBeenCalled()
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledWith(
                inputModel,
                inputQuantity.quantity,
                inputQuantity.sellingDate
            )
        })

        test("Sell Product - user not admin or manager", async () => {
            const inputModel = "iPhone13"
            const inputQuantity = {
                quantity: 3,
                sellingDate: "01/02/2024"
            }

            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(2)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "User is not an admin or manager", status: 401 })
            })
            
            const response = await request(app).patch(baseURL + "/products/"+inputModel+"/sell").send(inputQuantity)
            expect(response.status).toBe(401)
        })
    })

    describe("getProducts", () => {
        test("Retrieve all Products", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce([testProduct1, testProduct2])

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).get(baseURL + "/products")
            expect(response.status).toBe(200)
            expect(ProductController.prototype.getProducts).toHaveBeenCalled()
            expect(ProductController.prototype.getProducts).toHaveBeenCalledWith(
                undefined,
                undefined,
                undefined
            )
            
            expect(response.body.length).toBe(2)
            expect(response.body[0].model).toBe("iPhone13")
            expect(response.body[0].category).toBe("Smartphone")
            expect(response.body[0].quantity).toBe(3)
            expect(response.body[0].details).toBe("128GB, Black")
            expect(response.body[0].sellingPrice).toBe(800.00)
            expect(response.body[0].arrivalDate).toBe("2024-01-01")

            expect(response.body[1].model).toBe("Macbook Pro")
            expect(response.body[1].category).toBe("Laptop")
            expect(response.body[1].quantity).toBe(0)
            expect(response.body[1].details).toBe("")
            expect(response.body[1].sellingPrice).toBe(1200.00)
            expect(response.body[1].arrivalDate).toBe("2024-02-01")
        })

        test("Retrieve all Products - filter by model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "iPhone13",
                category: null
            }

            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce([testProduct1])

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).get(baseURL + "/products?grouping="+inputOptions.grouping+"&model="+inputOptions.model)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.getProducts).toHaveBeenCalled()
            expect(ProductController.prototype.getProducts).toHaveBeenCalledWith(
                inputOptions.grouping,
                undefined,
                inputOptions.model
            )
            
            expect(response.body.length).toBe(1)
            expect(response.body[0].model).toBe("iPhone13")
            expect(response.body[0].category).toBe("Smartphone")
            expect(response.body[0].quantity).toBe(3)
            expect(response.body[0].details).toBe("128GB, Black")
            expect(response.body[0].sellingPrice).toBe(800.00)
            expect(response.body[0].arrivalDate).toBe("2024-01-01")
        })

        test("Retrieve all Products - filter by category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: null,
                category: Category.LAPTOP
            }

            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce([testProduct2])

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).get(baseURL + "/products?grouping="+inputOptions.grouping+"&category="+inputOptions.category)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.getProducts).toHaveBeenCalled()
            expect(ProductController.prototype.getProducts).toHaveBeenCalledWith(
                inputOptions.grouping,
                inputOptions.category,
                undefined
            )
            
            expect(response.body.length).toBe(1)
            expect(response.body[0].model).toBe("Macbook Pro")
            expect(response.body[0].category).toBe("Laptop")
            expect(response.body[0].quantity).toBe(0)
            expect(response.body[0].details).toBe("")
            expect(response.body[0].sellingPrice).toBe(1200.00)
            expect(response.body[0].arrivalDate).toBe("2024-02-01")
        })

        test("Retrieve all Products - user not logged in", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce([testProduct1, testProduct2])

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "User is not an admin or manager", status: 401 })
            })
            
            const response = await request(app).get(baseURL + "/products?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category)
            expect(response.status).toBe(401)
        })
    })

    describe("getAvailableProducts", () => {
        test("Retrieve available Products", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce([testProduct1])

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).get(baseURL + "/products/available")
            expect(response.status).toBe(200)
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalled()
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith(
                undefined,
                undefined,
                undefined
            )
            
            expect(response.body.length).toBe(1)
            expect(response.body[0].model).toBe("iPhone13")
            expect(response.body[0].category).toBe("Smartphone")
            expect(response.body[0].quantity).toBe(3)
            expect(response.body[0].details).toBe("128GB, Black")
            expect(response.body[0].sellingPrice).toBe(800.00)
            expect(response.body[0].arrivalDate).toBe("2024-01-01")
        })

        test("Retrieve available Products - filter by model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "iPhone13",
                category: null
            }

            jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce([testProduct1])

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).get(baseURL + "/products/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalled()
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith(
                inputOptions.grouping,
                undefined,
                inputOptions.model
            )
            
            expect(response.body.length).toBe(1)
            expect(response.body[0].model).toBe("iPhone13")
            expect(response.body[0].category).toBe("Smartphone")
            expect(response.body[0].quantity).toBe(3)
            expect(response.body[0].details).toBe("128GB, Black")
            expect(response.body[0].sellingPrice).toBe(800.00)
            expect(response.body[0].arrivalDate).toBe("2024-01-01")
        })

        test("Retrieve available Products - filter by category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: null,
                category: Category.LAPTOP
            }

            jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce([])

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).get(baseURL + "/products/available?grouping="+inputOptions.grouping+"&category="+inputOptions.category)
            expect(response.status).toBe(200)
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalled()
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith(
                inputOptions.grouping,
                inputOptions.category,
                undefined
            )
            
            expect(response.body.length).toBe(0)
        })

        test("Retrieve available Products - user not logged in", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce([testProduct1])

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthenticated user", status: 401 })
            })
            
            const response = await request(app).get(baseURL + "/products/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category)
            expect(response.status).toBe(401)
        })
    })

    describe("deleteAllProducts", () => {
        test("Delete all Products", async () => {
            jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValueOnce(true)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).delete(baseURL + "/products").send()
            expect(response.status).toBe(200)
            expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalled()
            expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledWith()
        })

        test("Delete all Products - user not Admin or Manager", async () => {
            jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValueOnce(true)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "User is not an admin or manager", status: 401 })
            })
            
            const response = await request(app).delete(baseURL + "/products").send()
            expect(response.status).toBe(401)
        })
    })

    describe("deleteProduct", () => {
        test("Delete Product", async () => {
            const inputModel = "iPhone13"
            jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValueOnce(true)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            })
            
            const response = await request(app).delete(baseURL + "/products/"+inputModel).send()
            expect(response.status).toBe(200)
            expect(ProductController.prototype.deleteProduct).toHaveBeenCalled()
            expect(ProductController.prototype.deleteProduct).toHaveBeenCalledWith(inputModel)
        })

        test("Delete Product - user not Admin or Manager", async () => {
            const inputModel = "iPhone13"
            jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValueOnce(true)

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "User is not an admin or manager", status: 401 })
            })
            
            const response = await request(app).delete(baseURL + "/products/"+inputModel).send()
            expect(response.status).toBe(401)
        })
    })
})