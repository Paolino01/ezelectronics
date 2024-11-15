import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import ProductDAO from "../../src/dao/productDAO"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { Category, Product } from "../../src/components/product"
import { ProductNotFoundError, UncorrectGroupingCategoryModelFilter } from "../../src/errors/productError"

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

describe("productDAO test", () => {
    test("Insert new product", async () => {
        const testProduct = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            5
        )

        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        })
        const result = await productDAO.addProduct(testProduct)
        expect(result).toBe(undefined)
        mockDBRun.mockRestore()
    })

    test("Insert new product - product already existing", async () => {
        const testProduct = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            5
        )

        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("UNIQUE constraint failed"))
            return {} as Database
        })
        try {
            await productDAO.addProduct(testProduct)    //Insert the same product twice
        }
        catch(e) {
            expect(e.customCode).toBe(409)
        }
        mockDBRun.mockRestore()
    })

    test("Increase quantity of existing product", async () => {
        //Insert product in DB
        const testProduct = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 1}, null);
            return {} as Database
        })

        const testQuantity = {
            quantity: 3,
            changeDate: "2024-02-01"
        }

        const response = await productDAO.increaseQuantity(testProduct.model, testQuantity.quantity)
        expect(response).toBe(undefined)
        mockDBRun.mockRestore()
    })

    test("Increase quantity of non existing product", async () => {
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 0}, null);
            return {} as Database
        })

        const testQuantity = {
            quantity: 3,
            changeDate: "2024-02-01"
        }
        try {
            await productDAO.increaseQuantity("Fake model", testQuantity.quantity)
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }
        mockDBRun.mockRestore()
    })

    test("Record sell of existing product", async () => {
        //Insert product in DB
        const testProduct = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 1}, null);
            return {} as Database
        })
        await productDAO.addProduct(testProduct)

        const testSell = {
            quantity: 2,
            sellingDate: "2024-02-01"
        }
        const response = await productDAO.increaseQuantity(testProduct.model, -testSell.quantity)
        expect(response).toBe(undefined)
        mockDBRun.mockRestore()
    })

    test("Record sell of non existing product", async () => {
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 0}, null);
            return {} as Database
        })

        const testSell = {
            quantity: 2,
            sellingDate: "2024-02-01"
        }
        try {
            await productDAO.increaseQuantity("Fake Model", -testSell.quantity)
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }
        mockDBRun.mockRestore()
    })

    test("Record sell of existing product - available quantity is just enough", async () => {
        //Insert product in DB
        const testProduct = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 1}, null);
            return {} as Database
        })
        await productDAO.addProduct(testProduct)

        const testSell = {
            quantity: 3,
            sellingDate: "2024-02-01"
        }
        const response = await productDAO.increaseQuantity(testProduct.model, -testSell.quantity)
        expect(response).toBe(undefined)
        mockDBRun.mockRestore()
    })

    test("Get product", async () => {
        const productDAO = new ProductDAO()
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const mockDBGet = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null, testProduct1)
            return {} as Database
        })

        const response = await productDAO.getProduct(testProduct1.model)

        expect(response.model).toBe("iPhone13")
        expect(response.category).toBe("Smartphone")
        expect(response.quantity).toBe(3)
        expect(response.details).toBe("128GB, Black")
        expect(response.sellingPrice).toBe(800.00)
        expect(response.arrivalDate).toBe("2024-01-01")
        mockDBGet.mockRestore()
    })

    test("Get product - not existing model", async () => {
        const productDAO = new ProductDAO()
        const mockDBGet = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null, null)
            return {} as Database
        })

        try {
            await productDAO.getProduct("Fake model")
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }
        mockDBGet.mockRestore()
    })

    test("Get all products", async () => {
        const productDAO = new ProductDAO()
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const mockDBAll = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null, [testProduct1, testProduct2])
            return {} as Database
        })

        const response = await productDAO.getProducts(null, null, null)

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
        mockDBAll.mockRestore()
    })

    test("Get all products - empty DB", async () => {
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [])
            return {} as Database
        })

        const response = await productDAO.getProducts(null, null, null)

        expect(response.length).toBe(0)
        mockDBAll.mockRestore()
    })

    test("Get products - filter by model", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [testProduct1])
            return {} as Database
        })

        const response = await productDAO.getProducts("model", null, "iPhone13")

        expect(response.length).toBe(1)
        expect(response[0].model).toBe("iPhone13")
        expect(response[0].category).toBe("Smartphone")
        expect(response[0].quantity).toBe(3)
        expect(response[0].details).toBe("128GB, Black")
        expect(response[0].sellingPrice).toBe(800.00)
        expect(response[0].arrivalDate).toBe("2024-01-01")
        mockDBAll.mockRestore()
    })

    test("Get products - filter by category", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [testProduct1])
            return {} as Database
        })

        const response = await productDAO.getProducts("category", Category.SMARTPHONE, null)

        expect(response.length).toBe(1)
        expect(response[0].model).toBe("iPhone13")
        expect(response[0].category).toBe("Smartphone")
        expect(response[0].quantity).toBe(3)
        expect(response[0].details).toBe("128GB, Black")
        expect(response[0].sellingPrice).toBe(800.00)
        expect(response[0].arrivalDate).toBe("2024-01-01")
        mockDBAll.mockRestore()
    })

    test("Get products - filter by category - no products", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [])
            return {} as Database
        })

        const response = await productDAO.getProducts("category", Category.APPLIANCE, null)

        expect(response.length).toBe(0)
        mockDBAll.mockRestore()
    })

    test("Get products - filter by not existing model", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new ProductNotFoundError(), [])
            return {} as Database
        })

        try {
            await productDAO.getProducts("model", null, "Fake Model")
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }

        mockDBAll.mockRestore()
    })

    test("Get products - filter by null model", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new UncorrectGroupingCategoryModelFilter, [])
            return {} as Database
        })

        try {
            await productDAO.getProducts("model", null, null)
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
        
        mockDBAll.mockRestore()
    })

    test("Get products - filter by model and category", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new UncorrectGroupingCategoryModelFilter, [])
            return {} as Database
        })

        try {
            await productDAO.getProducts("model", Category.SMARTPHONE, "iPhone13")
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
        
        mockDBAll.mockRestore()
    })

    test("Get products - filter by null category", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new UncorrectGroupingCategoryModelFilter, [])
            return {} as Database
        })

        try {
            await productDAO.getProducts("category", null, null)
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
        
        mockDBAll.mockRestore()
    })

    test("Get available products", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            0
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [testProduct1])
            return {} as Database
        })

        const response = await productDAO.getAvailableProducts(null, null, null)

        expect(response.length).toBe(1)
        expect(response[0].model).toBe("iPhone13")
        expect(response[0].category).toBe("Smartphone")
        expect(response[0].quantity).toBe(3)
        expect(response[0].details).toBe("128GB, Black")
        expect(response[0].sellingPrice).toBe(800.00)
        expect(response[0].arrivalDate).toBe("2024-01-01")
        mockDBAll.mockRestore()
    })

    test("Get available products - empty DB", async () => {
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [])
            return {} as Database
        })

        const response = await productDAO.getAvailableProducts(null, null, null)

        expect(response.length).toBe(0)
        mockDBAll.mockRestore()
    })

    test("Get products - filter by model", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            0
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [testProduct1])
            return {} as Database
        })

        const response = await productDAO.getAvailableProducts("model", null, "iPhone13")

        expect(response.length).toBe(1)
        expect(response[0].model).toBe("iPhone13")
        expect(response[0].category).toBe("Smartphone")
        expect(response[0].quantity).toBe(3)
        expect(response[0].details).toBe("128GB, Black")
        expect(response[0].sellingPrice).toBe(800.00)
        expect(response[0].arrivalDate).toBe("2024-01-01")
        mockDBAll.mockRestore()
    })

    test("Get available products - filter by category", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            0
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [testProduct1])
            return {} as Database
        })

        const response = await productDAO.getAvailableProducts("category", Category.SMARTPHONE, null)

        expect(response.length).toBe(1)
        expect(response[0].model).toBe("iPhone13")
        expect(response[0].category).toBe("Smartphone")
        expect(response[0].quantity).toBe(3)
        expect(response[0].details).toBe("128GB, Black")
        expect(response[0].sellingPrice).toBe(800.00)
        expect(response[0].arrivalDate).toBe("2024-01-01")
        mockDBAll.mockRestore()
    })

    test("Get available products - filter by category - no products", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            0
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [])
            return {} as Database
        })

        const response = await productDAO.getAvailableProducts("category", Category.APPLIANCE, null)

        expect(response.length).toBe(0)
        mockDBAll.mockRestore()
    })

    test("Get available products - filter by not existing model", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            0
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new ProductNotFoundError(), [])
            return {} as Database
        })

        try {
            await productDAO.getAvailableProducts("model", null, "Fake Model")
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }

        mockDBAll.mockRestore()
    })

    test("Get available products - filter by null model", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            0
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new UncorrectGroupingCategoryModelFilter, [])
            return {} as Database
        })

        try {
            await productDAO.getAvailableProducts("model", null, null)
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
        
        mockDBAll.mockRestore()
    })

    test("Get available products - filter by model and category", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            0
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new UncorrectGroupingCategoryModelFilter, [])
            return {} as Database
        })

        try {
            await productDAO.getAvailableProducts("model", Category.SMARTPHONE, "iPhone13")
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
        
        mockDBAll.mockRestore()
    })

    test("Get available products - filter by null category", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            0
        )
        const productDAO = new ProductDAO()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new UncorrectGroupingCategoryModelFilter, [])
            return {} as Database
        })

        try {
            await productDAO.getAvailableProducts("category", null, null)
        }
        catch(e) {
            expect(e.customCode).toBe(422)
        }
        
        mockDBAll.mockRestore()
    })

    test("Delete a product", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 1}, null);
            return {} as Database
        })

        const response = await productDAO.deleteProduct("iPhone13")
        expect(response).toBe(true)
        mockDBRun.mockRestore()
    })

    test("Delete a product - not existing model", async () => {
        const testProduct1 = new Product(
            800.00,
            "iPhone13",
            Category.SMARTPHONE,
            "2024-01-01",
            "128GB, Black",
            3
        )
        const testProduct2 = new Product(
            1200.00,
            "Macbook Pro",
            Category.LAPTOP,
            "2024-02-01",
            "",
            5
        )
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 0}, null);
            return {} as Database
        })
        await productDAO.addProduct(testProduct1)
        await productDAO.addProduct(testProduct2)

        try {
            await productDAO.deleteProduct("Fake Model")
        }
        catch(e) {
            expect(e.customCode).toBe(404)
        }
        mockDBRun.mockRestore()
    })

    test("Delete all products", async () => {
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 1}, null);
            return {} as Database
        })

        const response = await productDAO.deleteProducts()
        expect(response).toBe(true)
        mockDBRun.mockRestore()
    })

    test("Delete all products - empty DB", async () => {
        const productDAO = new ProductDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 0}, null);
            return {} as Database
        })

        const response = await productDAO.deleteProducts()
        expect(response).toBe(false)
        mockDBRun.mockRestore()
    })
})