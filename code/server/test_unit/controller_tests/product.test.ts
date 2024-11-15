import { describe, test, expect, jest } from "@jest/globals"
import ProductController from "../../src/controllers/productController"
import CartController from "../../src/controllers/cartController"
import { ProductAlreadyExistsError, ProductNotFoundError, UncorrectGroupingCategoryModelFilter } from "../../src/errors/productError"
import { Role, User } from "../../src/components/user"
import { Category, Product } from "../../src/components/product"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import ProductDAO from "../../src/dao/productDAO"

jest.mock("../../src/dao/productDAO")

//Product tests
//Parameters checks are done in the Routes, so here I should not pass wrong parameters

describe("productController test", () => {
    //Insert a new product. Should return an empty promise
    test("Insert new product", async () => {
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "addProduct").mockResolvedValueOnce();
        const productController = new ProductController()
        const response = await productController.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, testProduct.arrivalDate)
        expect(response).toBe(undefined)
    })

    //Insert a new product without specifiyng arrivalDate. Should return an empty promise
    test("Insert new product - no date", async () => {
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00
        }
        jest.spyOn(ProductDAO.prototype, "addProduct").mockResolvedValueOnce();
        const productController = new ProductController()
        const response = await productController.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, null)
        expect(response).toBe(undefined)
    })

    //Insert a product that is already in the DB. Should return an error
    test("Insert existing product", async () => {
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "addProduct").mockRejectedValue(new ProductAlreadyExistsError());
        const productController = new ProductController()

        //Call the same function twice
        try {                                                   //Since we are expencting an error, we need to write this function call in a try-catch
            await productController.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, testProduct.arrivalDate)
        }
        catch(e) {
            expect(e.customCode).toBe(409)
        }
    })

    test("Insert new product - arrival date after current date", async () => {
        var today = new Date()
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: (today.getFullYear()+1)+"-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "addProduct").mockResolvedValueOnce();
        const productController = new ProductController()

        try {                                                   //Since we are expencting an error, we need to write this function call in a try-catch
            await productController.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, testProduct.arrivalDate)
        }
        catch(e) {
            expect(e.customCode).toBe(400)
        }
    })

    test("Increase quantity of existing product", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 5));
        const productController = new ProductController()

        const testQuantity = {
            quantity: 3,
            changeDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        const response = await productController.changeProductQuantity(testProduct.model, testQuantity.quantity, testQuantity.changeDate)
        expect(response).toBe(8)        //5 + 3
    })

    test("Increase quantity of existing product - no date", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 5));
        const productController = new ProductController()

        const testQuantity = {
            quantity: 3
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        const response = await productController.changeProductQuantity(testProduct.model, testQuantity.quantity, null)
        expect(response).toBe(8)
    })

    test("Increase quantity of non existing product", async () => {
        const cartController = new CartController()
        const productController = new ProductController()
        jest.spyOn(ProductDAO.prototype, "getProduct").mockRejectedValue(new ProductNotFoundError());

        const testQuantity = {
            quantity: 3,
            changeDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        try {
            await productController.changeProductQuantity("Fake model", testQuantity.quantity, testQuantity.changeDate)
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }
    })

    test("Increase quantity - changeDate before arrivalDate", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 5));
        const productController = new ProductController()

        const testQuantity = {
            quantity: 3,
            changeDate: "2023-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        try {
            await productController.changeProductQuantity(testProduct.model, testQuantity.quantity, testQuantity.changeDate)
        }
        catch(e) {
            expect(e.customCode).toBe(400)
        }
    })

    test("Increase quantity - changeDate after current date", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 5));
        const productController = new ProductController()

        const today = new Date()
        const testQuantity = {
            quantity: 3,
            changeDate: (today.getFullYear()+1)+"-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        try {
            await productController.changeProductQuantity(testProduct.model, testQuantity.quantity, testQuantity.changeDate)
        }
        catch(e) {
            expect(e.customCode).toBe(400)
        }
    })

    test("Record sell of existing product", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 5));
        const productController = new ProductController()

        const testSell = {
            quantity: 2,
            sellingDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        const response = await productController.sellProduct(testProduct.model, testSell.quantity, testSell.sellingDate)
        expect(response).toBe(3)
    })

    test("Record sell of existing product - no sellingDate", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 5));
        const productController = new ProductController()

        const testSell = {
            quantity: 2
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        const response = await productController.sellProduct(testProduct.model, testSell.quantity, null)
        expect(response).toBe(3)
    })

    test("Record sell of non existing product", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockRejectedValue(new ProductNotFoundError());
        const productController = new ProductController()

        const testSell = {
            quantity: 2,
            sellingDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        try {
            await productController.sellProduct("Fake model", testSell.quantity, testSell.sellingDate)
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }
    })

    test("Record Sell - sellingDate before arrivalDate", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 5));
        const productController = new ProductController()

        const testSell = {
            quantity: 2,
            sellingDate: "2023-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        try {
            await productController.changeProductQuantity(testProduct.model, testSell.quantity, testSell.sellingDate)
        }
        catch(e) {
            expect(e.customCode).toBe(400)
        }
    })

    test("Record Sell - sellingDate after current date", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 5,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 5));
        const productController = new ProductController()

        const today = new Date()
        const testSell = {
            quantity: 2,
            sellingDate: (today.getFullYear()+1)+"-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        try {
            await productController.changeProductQuantity(testProduct.model, testSell.quantity, testSell.sellingDate)
        }
        catch(e) {
            expect(e.customCode).toBe(400)
        }
    })

    test("Record sell of existing product - quantity = 0", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 0,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 0));
        const productController = new ProductController()

        const testSell = {
            quantity: 2,
            sellingDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        try {
            await productController.sellProduct(testProduct.model, testSell.quantity, testSell.sellingDate)
        }
        catch(e) {
            expect(e.customCode).toBe(409)
        }
    })

    test("Record sell of existing product - not enough quantity", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 2,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 2));
        const productController = new ProductController()

        const testSell = {
            quantity: 3,
            sellingDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        try {
            await productController.sellProduct(testProduct.model, testSell.quantity, testSell.sellingDate)
        }
        catch(e) {
            expect(e.customCode).toBe(409)
        }
    })

    test("Record sell of existing product - available quantity is just enough", async () => {
        //Insert product in DB
        const testProduct = {
            model: "iPhone13",
            category: "Smartphone",
            quantity: 2,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(new Product(800.0, "iPhone13", Category.SMARTPHONE, "2024-01-01", "128GB, Black", 2));
        jest.spyOn(ProductDAO.prototype, "addProduct").mockResolvedValue();
        const productController = new ProductController()
        await productController.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, testProduct.arrivalDate)

        const testSell = {
            quantity: 2,
            sellingDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "increaseQuantity").mockResolvedValueOnce();
        const response = await productController.sellProduct(testProduct.model, testSell.quantity, testSell.sellingDate)
        expect(response).toBe(0)
    })

    test("Get all products", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([testProduct1, testProduct2]);
        const productController = new ProductController()

        const response = await productController.getProducts(null, null, null)

        expect(response.length).toBe(2)
        expect(response[0].model).toBe("iPhone13")
        expect(response[0].category).toBe("Smartphone")
        expect(response[0].quantity).toBe(3)
        expect(response[0].details).toBe("128GB, Black")
        expect(response[0].sellingPrice).toBe(800.00)
        expect(response[0].arrivalDate).toBe("2024-01-01")

        expect(response[1].model).toBe("Macbook Pro")
        expect(response[1].category).toBe("Laptop")
        expect(response[1].quantity).toBe(5)
        expect(response[1].details).toBe("")
        expect(response[1].sellingPrice).toBe(1200.00)
        expect(response[1].arrivalDate).toBe("2024-02-01")
    })

    test("Get all products - empty DB", async () => {
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([]);
        const productController = new ProductController()

        const response = await productController.getProducts(null, null, null)

        expect(response).toEqual([])
    })

    test("Get products - filter by model", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([testProduct1]);
        const productController = new ProductController()

        const response = await productController.getProducts("model", null, "iPhone13")

        expect(response.length).toBe(1)
        expect(response[0].model).toBe("iPhone13")
        expect(response[0].category).toBe("Smartphone")
        expect(response[0].quantity).toBe(3)
        expect(response[0].details).toBe("128GB, Black")
        expect(response[0].sellingPrice).toBe(800.00)
        expect(response[0].arrivalDate).toBe("2024-01-01")
    })

    test("Get products - filter by not existing model", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockRejectedValue(new ProductNotFoundError());
        const productController = new ProductController()

        try {
            await productController.getProducts("model", null, "Fake Model")
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }
    })

    test("Get products - filter by null model", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockRejectedValue(new UncorrectGroupingCategoryModelFilter());
        const productController = new ProductController()

        try {
            await productController.getProducts("model", null, null)
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
    })

    test("Get products - filter by model and category", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockRejectedValue(new UncorrectGroupingCategoryModelFilter());
        const productController = new ProductController()

        try {
            await productController.getProducts("model", "Smartphone", "iPhone13")
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
    })

    test("Get products - filter by model and category 2", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockRejectedValue(new UncorrectGroupingCategoryModelFilter());
        const productController = new ProductController()

        try {
            await productController.getProducts("category", "Smartphone", "iPhone13")
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
    })

    test("Get products - filter by category", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([testProduct2]);
        const productController = new ProductController()

        const response = await productController.getProducts("category", Category.LAPTOP, null)

        expect(response.length).toBe(1)
        expect(response[0].model).toBe("Macbook Pro")
        expect(response[0].category).toBe("Laptop")
        expect(response[0].quantity).toBe(5)
        expect(response[0].details).toBe("")
        expect(response[0].sellingPrice).toBe(1200.00)
        expect(response[0].arrivalDate).toBe("2024-02-01")
    })

    test("Get products - filter by null category", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockRejectedValue(new UncorrectGroupingCategoryModelFilter());
        const productController = new ProductController()

        try {
            await productController.getProducts("category", null, null)
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
    })

    test("Get products - filter by category - no products", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([]);
        const productController = new ProductController()

        const response = await productController.getProducts("category", Category.APPLIANCE, null)
        expect(response).toEqual([])
    })

    test("Get available products", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce([testProduct1]);
        const productController = new ProductController()

        const response = await productController.getAvailableProducts(null, null, null)

        expect(response.length).toBe(1)
        expect(response[0].model).toBe("iPhone13")
        expect(response[0].category).toBe("Smartphone")
        expect(response[0].quantity).toBe(3)
        expect(response[0].details).toBe("128GB, Black")
        expect(response[0].sellingPrice).toBe(800.00)
        expect(response[0].arrivalDate).toBe("2024-01-01")
    })

    test("Delete Product", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "deleteProduct").mockResolvedValueOnce(true);
        const productController = new ProductController()

        const response = await productController.deleteProduct("Macbook Pro")
        expect(response).toBe(true)
    })

    test("Delete product - not existing model", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "deleteProduct").mockRejectedValue(new ProductNotFoundError());
        const productController = new ProductController()

        try {
            await productController.deleteProduct("Fake Model")
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }
    })

    test("Delete all products", async () => {
        const testProduct1 = {
            model: "iPhone13",
            category: Category.SMARTPHONE,
            quantity: 3,
            details: "128GB, Black",
            sellingPrice: 800.00,
            arrivalDate: "2024-01-01"
        }
        const testProduct2: { model: string, category: Category, quantity: number, details: string, sellingPrice: number, arrivalDate: string | null } = {
            model: "Macbook Pro",
            category: Category.LAPTOP,
            quantity: 5,
            details: "",
            sellingPrice: 1200.00,
            arrivalDate: "2024-02-01"
        }
        jest.spyOn(ProductDAO.prototype, "deleteProducts").mockResolvedValueOnce(true);
        const productController = new ProductController()

        const response = await productController.deleteAllProducts()
        expect(response).toBe(true)
    })
})