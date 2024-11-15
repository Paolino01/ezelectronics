import { describe, test, expect, beforeEach, beforeAll, afterEach, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import db from "../../src/db/db"
import { Category, Product } from "../../src/components/product"
import { response } from "express"

const runExec = (sql: string) => {
    return new Promise<void>((resolve, reject) => {
        db.exec(sql, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const initializationScriptBeforeAll = 
    `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;
    DELETE FROM users;
    `;

const initializationScriptBeforeAll2 = 
    `
    INSERT INTO product (model, arrivalDate, quantity, sellingPrice, details, category) VALUES
    ('P001', '2023-01-10', 1, 699.99, 'Galaxy S21', 'Smartphone'),
    ('P002', '2023-02-20', 2, 999.99, 'Laptop 16GB RAM, 512GB SSD', 'Laptop'),
    ('P003', '2023-03-15', 3, 799.99, 'Fotocamera digitale EOS 200D', 'Appliance'),
    ('P004', '2023-04-05', 4, 699.99, 'Apple Watch', 'Appliance'),
    ('P005', '2023-05-10', 0, 499.99, 'Televisore 4K UHD da 55 pollici Bravia X90J', 'Appliance');`;


const initializationScriptAfterEach = 
  `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;

  INSERT INTO product (model, arrivalDate, quantity, sellingPrice, details, category) VALUES
  ('P001', '2023-01-10', 1, 699.99, 'Galaxy S21', 'Smartphone'),
  ('P002', '2023-02-20', 2, 999.99, 'Laptop 16GB RAM, 512GB SSD', 'Laptop'),
  ('P003', '2023-03-15', 3, 799.99, 'Fotocamera digitale EOS 200D', 'Appliance'),
  ('P004', '2023-04-05', 4, 699.99, 'Apple Watch', 'Appliance'),
  ('P005', '2023-05-10', 0, 499.99, 'Televisore 4K UHD da 55 pollici Bravia X90J', 'Appliance');`;


const initializationScriptAfterAll = 
  `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;
    DELETE FROM users;
  `;


const routePath = "/ezelectronics/products" //Base route path for the API

//Default user information. We use them to create users and evaluate the returned values
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }

//Cookies for the users. We use them to keep users logged in. Creating them once and saving them in a variables outside of the tests will make cookies reusable
let adminCookie: string
let managerCookie: string
let customerCookie: string

//Helper function that creates a new user in the database.
//Can be used to create a user before the tests or in the tests
const postUser = async (userInfo: any) => {
    await request(app)
        .post(`/ezelectronics/users`)
        .send(userInfo)
        .expect(200)
}

//Helper function that logs in a user and returns the cookie
//Can be used to log in a user before the tests or in the tests
const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`/ezelectronics/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}

// beforeAll(async () => {
//     await runExec(initializationScriptBeforeAll);

//     await postUser(admin);
//     adminCookie = await login({username: admin.username, password: admin.password});

//     await postUser(manager);
//     managerCookie = await login({username: manager.username, password: manager.password});

//     await postUser(customer);
//     customerCookie = await login({username: customer.username, password: customer.password});

//     await runExec(initializationScriptBeforeAll2);
// })
beforeAll(() => {
     return runExec(initializationScriptBeforeAll)
        .then(() => postUser(admin))
        .then(() => login({ username: admin.username, password: admin.password }))
        .then((cookie) => {
            adminCookie = cookie;
            return postUser(manager);
        })
        .then(() => login({ username: manager.username, password: manager.password }))
        .then((cookie) => {
            managerCookie = cookie;
            return postUser(customer);
        })
        .then(() => login({ username: customer.username, password: customer.password }))
        .then((cookie) => {
            customerCookie = cookie;
            return runExec(initializationScriptBeforeAll2);
        });
});


afterAll(() => {
    db.exec(initializationScriptAfterAll);
});

describe("Product routes integration tests", () => {
    describe("Insert Product", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("Insert new product", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(200)
        })

        test("Insert new product - null model", async () => {
            const inputProduct: { model: string | null, category: string | null, quantity: number | null, details: string | null, sellingPrice: number | null, arrivalDate: string | null} =  {
                model: null,
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - no details", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(200)
        })

        test("Insert new product - empty model", async () => {
            const inputProduct = {
                model: "",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - no category", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - wrong category", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "asdf",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - negative quantity", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: -7,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - quantity = 0", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 0,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - negative price", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: -600.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - price = 0", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 0,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - price is a string", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: "asdf",
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)       //TODO: ritorna 200 invece di 422
        })

        test("Insert new product - wrong date format", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "01/01/2024"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })

        test("Insert new product - user not logged in", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct);

            expect(response.status).toBe(401)
        })

        test("Insert new product - user is customer", async () => {
            const inputProduct = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", customerCookie);

            expect(response.status).toBe(401)
        })

        test("Insert existing product", async () => {
            const inputProduct = {
                model: "P001",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: "2024-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(409)
        })

        test("Insert new product - arrival date after current date", async () => {
            const today = new Date();
            const inputProduct = {
                model: "P001",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: (today.getFullYear()+1)+"-01-01"
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(400)
        })

        test("Insert new product - no arrival date", async () => {
            const today = new Date();
            const inputProduct: { model: string | null, category: string | null, quantity: number | null, details: string | null, sellingPrice: number | null, arrivalDate: string | undefined | null}  = {
                model: "iPhone13",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: undefined
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(200)
        })

        test("Insert new product - empty arrival date", async () => {
            const today = new Date();
            const inputProduct: { model: string | null, category: string | null, quantity: number | null, details: string | null, sellingPrice: number | null, arrivalDate: string | null}  = {
                model: "P001",
                category: "Smartphone",
                quantity: 5,
                details: "128GB, Black",
                sellingPrice: 800.00,
                arrivalDate: ""
            }

            const response = await request(app).post(`${routePath}/`).send(inputProduct).set("Cookie", adminCookie);

            expect(response.status).toBe(422)
        })
    })

    describe("Increase Product Quantity", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("Increase Product Quantity", async () => {
            const inputModel = "P001"

            const inputQuantity = {
                quantity: 3,
                changeDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(200)
            expect(response.body.quantity).toBe(4)
        })

        test("Increase Product Quantity - undefined changeDate", async () => {
            const inputModel = "P001"

            const inputQuantity: { quantity: number, changeDate: string | undefined | null } = {
                quantity: 3,
                changeDate: undefined
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(200)
            expect(response.body.quantity).toBe(4)
        })

        test("Increase Product Quantity - empty changeDate", async () => {
            const inputModel = "P001"

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: 3,
                changeDate: ""
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(422)
        })

        test("Increase Product Quantity - quantity = 0", async () => {
            const inputModel = "P001"

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: 0,
                changeDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(422)
        })

        test("Increase Product Quantity - negative quantity", async () => {
            const inputModel = "P001"

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: -7,
                changeDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(422)
        })

        test("Increase Product Quantity - wrong change date format", async () => {
            const inputModel = "P001"

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: 3,
                changeDate: "01/02/2024"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(422)
        })

        test("Increase Product Quantity - change date after current date", async () => {
            const inputModel = "P001"

            const today = new Date()

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: 3,
                changeDate: (today.getFullYear()+1)+"-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(400)
        })

        test("Increase Product Quantity - change date before arrival date", async () => {
            const inputModel = "P001"

            const today = new Date()

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: 3,
                changeDate: "2021-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(400)
        })

        test("Increase Product Quantity - non existing product", async () => {
            const inputModel = "Fake Model"

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: 3,
                changeDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", adminCookie)

            expect(response.status).toBe(404)
        })

        test("Increase Product Quantity - user not logged in", async () => {
            const inputModel = "P001"

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: 3,
                changeDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity)

            expect(response.status).toBe(401)
        })

        test("Increase Product Quantity - user is customer", async () => {
            const inputModel = "P001"

            const inputQuantity: { quantity: number, changeDate: string | null } = {
                quantity: 3,
                changeDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}`).send(inputQuantity).set("Cookie", customerCookie)

            expect(response.status).toBe(401)
        })
    })

    describe("Sell Product", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("Sell existing product", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(200)
            expect(response.body.quantity).toBe(1)
        })

        test("Sell existing product - quantity = 0", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 0,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(422)
        })

        test("Sell existing product - negative quantity", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: -7,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(422)
        })

        test("Sell existing product - wrong selling date format", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: "01/02/2024"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(422)
        })

        test("Sell existing product - undefined selling date", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | undefined | null } = {
                quantity: 2,
                sellingDate: undefined
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(200)
            expect(response.body.quantity).toBe(1)
        })

        test("Sell existing product - empty selling date", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: ""
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(422)
        })

        test("Sell existing product - selling date after current date", async () => {
            const inputModel = "P003"

            const today = new Date()

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: (today.getFullYear()+1)+"-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(400)
        })

        test("Sell existing product - selling date before arrival date", async () => {
            const inputModel = "P003"

            const today = new Date()

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: "2020-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(400)
        })

        test("Sell not existing product", async () => {
            const inputModel = "Fake model"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(404)
        })

        test("Sell existing product - product quantity = 0", async () => {
            const inputModel = "P005"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(409)
        })

        test("Sell existing product - product quantity < selling quantity", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 5,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(409)
        })

        test("Sell existing product - quantity is just enough", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 3,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", adminCookie)

            expect(response.status).toBe(200)
            expect(response.body.quantity).toBe(0)
        })

        test("Sell existing product - user is customer", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell).set("Cookie", customerCookie)

            expect(response.status).toBe(401)
        })

        test("Sell existing product - user not logged in", async () => {
            const inputModel = "P003"

            const inputSell: { quantity: number, sellingDate: string | null } = {
                quantity: 2,
                sellingDate: "2024-02-01"
            }

            const response = await request(app).patch(`${routePath}/${inputModel}/sell`).send(inputSell)

            expect(response.status).toBe(401)
        })
    })

    describe("Get Products", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("Retrieve all products", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            const response = await request(app).get(`${routePath}/`).set("Cookie", adminCookie)
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(5)
        })

        test("Retrieve all products - filter by model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "P001",
                category: null
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&model="+inputOptions.model).set("Cookie", adminCookie)
            expect(response.status).toBe(200)

            expect(response.body.length).toBe(1)
            expect(response.body[0].model).toBe("P001")
            expect(response.body[0].category).toBe("Smartphone")
            expect(response.body[0].quantity).toBe(1)
            expect(response.body[0].details).toBe("Galaxy S21")
            expect(response.body[0].sellingPrice).toBe(699.99)
            expect(response.body[0].arrivalDate).toBe("2023-01-10")
        })

        test("Retrieve all products - filter by category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: null,
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(200)

            expect(response.body.length).toBe(1)
            expect(response.body[0].model).toBe("P001")
            expect(response.body[0].category).toBe("Smartphone")
            expect(response.body[0].quantity).toBe(1)
            expect(response.body[0].details).toBe("Galaxy S21")
            expect(response.body[0].sellingPrice).toBe(699.99)
            expect(response.body[0].arrivalDate).toBe("2023-01-10")
        })

        test("Retrieve all products - filter by not existing model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "Fake model",
                category: null
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&model="+inputOptions.model).set("Cookie", adminCookie)
            expect(response.status).toBe(404)
        })

        test("Retrieve all products - filter by null model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: null,
                category: null
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve all products - filter by model and category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "P001",
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve all products - filter by model and category 2", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: "P001",
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve all products - filter by model and category 3", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: "P001",
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve all products - filter by null category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: null,
                category: null
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve all products - filter by not existing category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: null,
                category: "asdf"
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve all products - not null category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve all products - not null model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: "P001",
                category: null
            }

            const response = await request(app).get(routePath + "?grouping="+inputOptions.grouping+"&model="+inputOptions.model).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve all products - user is customer", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            const response = await request(app).get(`${routePath}/`).send(inputOptions).set("Cookie", customerCookie)
            expect(response.status).toBe(401)
        })

        test("Retrieve all products - user not logged in", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            const response = await request(app).get(`${routePath}/`).send(inputOptions)
            expect(response.status).toBe(401)
        })
    })

    describe("Get Available Products", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("Retrieve available products", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            const response = await request(app).get(routePath + "/available").set("Cookie", adminCookie)
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(4)
        })

        test("Retrieve available products - filter by model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "P001",
                category: null
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model).set("Cookie", adminCookie)
            expect(response.status).toBe(200)

            expect(response.body.length).toBe(1)
            expect(response.body[0].model).toBe("P001")
            expect(response.body[0].category).toBe("Smartphone")
            expect(response.body[0].quantity).toBe(1)
            expect(response.body[0].details).toBe("Galaxy S21")
            expect(response.body[0].sellingPrice).toBe(699.99)
            expect(response.body[0].arrivalDate).toBe("2023-01-10")
        })

        test("Retrieve available products - filter by not available model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "P005",
                category: null
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model).set("Cookie", adminCookie)
            expect(response.status).toBe(200)
        })

        test("Retrieve available products - filter by category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: null,
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(200)

            expect(response.body.length).toBe(1)
            expect(response.body[0].model).toBe("P001")
            expect(response.body[0].category).toBe("Smartphone")
            expect(response.body[0].quantity).toBe(1)
            expect(response.body[0].details).toBe("Galaxy S21")
            expect(response.body[0].sellingPrice).toBe(699.99)
            expect(response.body[0].arrivalDate).toBe("2023-01-10")
        })

        test("Retrieve available products - filter by not existing model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "Fake model",
                category: null
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model).set("Cookie", adminCookie)
            expect(response.status).toBe(404)
        })

        test("Retrieve available products - filter by null model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: null,
                category: null
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve available products - filter by model and category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "model",
                model: "P001",
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve available products - filter by model and category 2", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: "P001",
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve available products - filter by model and category 3", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: "P001",
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve available products - filter by null category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: null,
                category: null
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping).send(inputOptions).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve available products - filter by not existing category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: "category",
                model: null,
                category: "asdf"
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve available products - not null category", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: "Smartphone"
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve available products - not null model", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: "P001",
                category: null
            }

            const response = await request(app).get(routePath + "/available?grouping="+inputOptions.grouping+"&model="+inputOptions.model+"&category="+inputOptions.category).set("Cookie", adminCookie)
            expect(response.status).toBe(422)
        })

        test("Retrieve available products - user is customer", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            const response = await request(app).get(`${routePath}/available`).send(inputOptions).set("Cookie", customerCookie)
            expect(response.status).toBe(200)
        })

        test("Retrieve available products - user not logged in", async () => {
            const inputOptions: { grouping: string | null, model: string | null, category: string | null } = {
                grouping: null,
                model: null,
                category: null
            }

            const response = await request(app).get(`${routePath}/available`).send(inputOptions)
            expect(response.status).toBe(401)
        })
    })

    describe("deleteAllProducts", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("Delete all Products", async () => {
            const response = await request(app).delete(`${routePath}/`).send().set("Cookie", adminCookie)
            expect(response.status).toBe(200)

            const products = await request(app).get(`${routePath}/`).send().set("Cookie", adminCookie)
            expect(products.status).toBe(200)
            expect(products.body.length).toBe(0)
        })

        test("Delete all Products - user is customer", async () => {
            const response = await request(app).delete(`${routePath}/`).send().set("Cookie", customerCookie)
            expect(response.status).toBe(401)

            const products = await request(app).get(`${routePath}/`).send().set("Cookie", adminCookie)
            expect(products.status).toBe(200)
            expect(products.body.length).toBe(5)
        })

        test("Delete all Products - user not logged in", async () => {
            const response = await request(app).delete(`${routePath}/`).send()
            expect(response.status).toBe(401)

            const products = await request(app).get(`${routePath}/`).send().set("Cookie", adminCookie)
            expect(products.status).toBe(200)
            expect(products.body.length).toBe(5)
        })
    })

    describe("deleteProduct", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("Delete Product", async () => {
            const inputModel = "P001"

            const response = await request(app).delete(`${routePath}/${inputModel}`).send().set("Cookie", adminCookie)
            expect(response.status).toBe(200)

            const products = await request(app).get(`${routePath}/`).send().set("Cookie", adminCookie)
            expect(products.status).toBe(200)
            expect(products.body.length).toBe(4)
        })

        test("Delete Product - not existing model", async () => {
            const inputModel = "Fake model"

            const response = await request(app).delete(`${routePath}/${inputModel}`).send().set("Cookie", adminCookie)
            expect(response.status).toBe(404)

            const products = await request(app).get(`${routePath}/`).send().set("Cookie", adminCookie)
            expect(products.status).toBe(200)
            expect(products.body.length).toBe(5)
        })

        test("Delete Product - user is customer", async () => {
            const inputModel = "P001"

            const response = await request(app).delete(`${routePath}/${inputModel}`).send().set("Cookie", customerCookie)
            expect(response.status).toBe(401)

            const products = await request(app).get(`${routePath}/`).send().set("Cookie", adminCookie)
            expect(products.status).toBe(200)
            expect(products.body.length).toBe(5)
        })

        test("Delete Product - user not logged", async () => {
            const inputModel = "P001"

            const response = await request(app).delete(`${routePath}/${inputModel}`).send()
            expect(response.status).toBe(401)

            const products = await request(app).get(`${routePath}/`).send().set("Cookie", adminCookie)
            expect(products.status).toBe(200)
            expect(products.body.length).toBe(5)
        })
    })
})