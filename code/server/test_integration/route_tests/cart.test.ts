import { describe, test, expect, beforeEach, beforeAll, afterEach, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import db from "../../src/db/db"
import { Category, Product } from "../../src/components/product"
import { Cart, ProductInCart } from "../../src/components/cart"
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
    ('P005', '2023-05-10', 0, 499.99, 'Televisore 4K UHD da 55 pollici Bravia X90J', 'Appliance');
  
    INSERT INTO cart (id, paid, paymentDate, total, username) VALUES
    (1, 0, null, 4799.94, 'paoloCagliero'),
    (2, 0, null, 0, 'anitaAscheri'),
    (3, 0, null, 499.99, 'giorgioBongiovanni'),
    (4, 1, '2024-06-05', 4799.94, 'paoloCagliero');
  
    INSERT INTO productInCart (id, model, quantity, category, sellingPrice) VALUES
    (1, 'P001', 1, 'Smartphone', 699.99),
    (1, 'P002', 1, 'Laptop', 999.99),
    (1, 'P003', 3, 'Appliance', 799.99),
    (3, 'P005', 1, 'Appliance', 499.99),
    (4, 'P001', 1, 'Smartphone', 699.99),
    (4, 'P002', 1, 'Laptop', 999.99),
    (4, 'P003', 3, 'Appliance', 799.99);
    `;


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
    ('P005', '2023-05-10', 0, 499.99, 'Televisore 4K UHD da 55 pollici Bravia X90J', 'Appliance');

    INSERT INTO cart (id, paid, paymentDate, total, username) VALUES
    (1, 0, null, 4799.94, 'paoloCagliero'),
    (2, 0, null, 0, 'anitaAscheri'),
    (3, 0, null, 499.99, 'giorgioBongiovanni'),
    (4, 1, '2024-06-05', 4799.94, 'paoloCagliero');

    INSERT INTO productInCart (id, model, quantity, category, sellingPrice) VALUES
    (1, 'P001', 1, 'Smartphone', 699.99),
    (1, 'P002', 1, 'Laptop', 999.99),
    (1, 'P003', 3, 'Appliance', 799.99),
    (3, 'P005', 1, 'Appliance', 499.99),
    (4, 'P001', 1, 'Smartphone', 699.99),
    (4, 'P002', 1, 'Laptop', 999.99),
    (4, 'P003', 3, 'Appliance', 799.99);
  `;


const initializationScriptAfterAll = 
`
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;
    DELETE FROM users;
`;


const routePath = "/ezelectronics/carts" //Base route path for the API

//Default user information. We use them to create users and evaluate the returned values
const paoloCagliero = { username: "paoloCagliero", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const anitaAscheri = { username: "anitaAscheri", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const robertoCandela = { username: "robertoCandela", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const giorgioBongiovanni = { username: "giorgioBongiovanni", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }
//Cookies for the users. We use them to keep users logged in. Creating them once and saving them in a variables outside of the tests will make cookies reusable
let paoloCaglieroCookie: string
let anitaAscheriCookie: string
let robertoCandelaCookie: string
let giorgioBongiovanniCookie: string
let adminCookie: string
let managerCookie: string

//Helper function that creates a new user in the database.
//Can be used to create a user before the tests or in the tests
//Is an implicit test because it checks if the return code is successful
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

beforeAll(() => {
    return runExec(initializationScriptBeforeAll)
        .then(() => postUser(paoloCagliero))
        .then(() => login({ username: paoloCagliero.username, password: paoloCagliero.password }))
        .then((cookie) => {
            paoloCaglieroCookie = cookie;
            return postUser(robertoCandela);
        })
        .then(() => login({ username: robertoCandela.username, password: robertoCandela.password }))
        .then((cookie) => {
            robertoCandelaCookie = cookie;
            return postUser(anitaAscheri);
        })
        .then(() => login({ username: anitaAscheri.username, password: anitaAscheri.password }))
        .then((cookie) => {
            anitaAscheriCookie = cookie;
            return postUser(giorgioBongiovanni);
        })
        .then(() => login({ username: giorgioBongiovanni.username, password: giorgioBongiovanni.password }))
        .then((cookie) => {
            giorgioBongiovanniCookie = cookie;
            return postUser(admin);
        })
        .then(() => login({ username: admin.username, password: admin.password }))
        .then((cookie) => {
            adminCookie = cookie;
            return postUser(manager);
        })
        .then(() => login({ username: manager.username, password: manager.password }))
        .then((cookie) => {
            managerCookie = cookie;
            return runExec(initializationScriptBeforeAll2);
        });
});


// beforeAll(() => {
//     return runExec(initializationScriptBeforeAll)
//         .then(() => postUser(admin))
//         .then(() => login({ username: admin.username, password: admin.password }))
//         .then((cookie) => {
//             adminCookie = cookie;
//             return postUser(manager);
//         })
//         .then(() => login({ username: manager.username, password: manager.password }))
//         .then((cookie) => {
//             managerCookie = cookie;
//             return postUser(customer);
//         })
//         .then(() => login({ username: customer.username, password: customer.password }))
//         .then((cookie) => {
//             customerCookie = cookie;
//             return runExec(initializationScriptBeforeAll2);
//         });
// });

afterAll(() => {
    db.exec(initializationScriptAfterAll);
});


//A 'describe' block is a way to group tests. It can be used to group tests that are related to the same functionality
//In this example, tests are for the user routes
//Inner 'describe' blocks define tests for each route
describe("Cart routes integration tests", () => {

    describe("GET /", () => {

        afterEach(() => {
             return runExec(initializationScriptAfterEach);
        })

        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Get current cart of the logged in user", async () => {
            
            const res = await request(app).get(`${routePath}/`).set("Cookie", paoloCaglieroCookie).expect(200);

            const productsInCart = [
                new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
            ];
    
            const expected = new Cart("paoloCagliero", false, null, 4799.94, productsInCart);
            
            expect(res.body).toEqual(expected);
            

        })


        test("Get current cart of the logged in user - there is no information about an unpaid cart", async () => {
            
            const res = await request(app).get(`${routePath}/`).set("Cookie", robertoCandelaCookie).expect(200);

            const expected = new Cart("robertoCandela", false, null, 0, []);
        
            expect(res.body).toEqual(expected);
        })

        test("It should return a 401 error code", async () => {
            await request(app).get(`${routePath}/`).expect(401);
            await request(app).get(`${routePath}/`).set("Cookie", managerCookie).expect(401); 
            await request(app).get(`${routePath}/`).set("Cookie", adminCookie).expect(401); 
        })

    })    

    describe("POST /", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        
        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Add a product instance", async () => {
            
            await request(app).post(`${routePath}/`).send({model: "P004"}).set("Cookie", paoloCaglieroCookie).expect(200);

            // Recupera il carrello attuale dell'utente
            const res = await request(app).get(`${routePath}/`).set("Cookie", paoloCaglieroCookie).expect(200);
            const cart = res.body;

            // Cerca il prodotto nel carrello
            const productInCart = cart.products.find((product: ProductInCart) => product.model === 'P004');
            expect(productInCart).toBeDefined();
            expect(cart.total).toBeCloseTo(5499.93, 2);
            
        })

        test("It should return a 401 error code", async () => {
            await request(app).post(`${routePath}/`).expect(401);
            await request(app).post(`${routePath}/`).set("Cookie", managerCookie).expect(401); 
            await request(app).post(`${routePath}/`).set("Cookie", adminCookie).expect(401); 
        })


        test("model is an empty string", async () => {
            await request(app).post(`${routePath}/`).send({ model: "" }).set("Cookie", paoloCaglieroCookie).expect(422);
        })
    })


    describe("PATCH /", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        
        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Payment for the current cart of the logged in user", async () => {
    
            await request(app).patch(`${routePath}/`).set("Cookie", paoloCaglieroCookie).expect(200);

            const res = await request(app).get(`/ezelectronics/products/`).set("Cookie", managerCookie).expect(200);

            const products = res.body;

            
            let updatedProduct = products.find((product: Product) => product.model === 'P001');
            expect(updatedProduct.quantity).toBe(0);
            updatedProduct = products.find((product: Product) => product.model === 'P002');
            expect(updatedProduct.quantity).toBe(1);
            updatedProduct = products.find((product: Product) => product.model === 'P003');
            expect(updatedProduct.quantity).toBe(0);
            
        })

        test("It should return a 401 error code", async () => {
            await request(app).patch(`${routePath}/`).expect(401);
            await request(app).patch(`${routePath}/`).set("Cookie", managerCookie).expect(401); 
            await request(app).patch(`${routePath}/`).set("Cookie", adminCookie).expect(401); 
        })

    }) 

    
    describe("GET /history", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        
        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Get the history of the carts that have been paid for by the current user", async () => {
            
            const res = await request(app).get(`${routePath}/history`).set("Cookie", paoloCaglieroCookie).expect(200);
            const carts = res.body;

            const productsInCart = [
            new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
            new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
            new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
            ];

            const expected = [
            new Cart("paoloCagliero", true, "2024-06-05", 4799.94, productsInCart)
            ];
        
            expect(carts).toEqual(expected);
            
        })

        test("It should return a 401 error code", async () => {
            await request(app).get(`${routePath}/history`).expect(401);
            await request(app).get(`${routePath}/history`).set("Cookie", managerCookie).expect(401); 
            await request(app).get(`${routePath}/history`).set("Cookie", adminCookie).expect(401); 
        })
    })


    describe("DELETE /products/:model", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        
        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Delete an instance of a product from the current cart of the logged in user", async () => {
            
            await request(app).delete(`${routePath}/products/P001`).set("Cookie", paoloCaglieroCookie).expect(200); 

            const res = await request(app).get(`${routePath}/`).set("Cookie", paoloCaglieroCookie).expect(200);
            const cartAfterDeletion = res.body;
            const productStillPresentAfterDeletion = cartAfterDeletion.products.find((product: Product) => product.model === 'P001');
            expect(productStillPresentAfterDeletion).toBeUndefined();
            
        })

        test("It should return a 401 error code", async () => {
            await request(app).delete(`${routePath}/products/P001`).expect(401);
            await request(app).delete(`${routePath}/products/P001`).set("Cookie", managerCookie).expect(401); 
            await request(app).delete(`${routePath}/products/P001`).set("Cookie", adminCookie).expect(401); 
        })


        test("model is an empty string", async () => {
            await request(app).delete(`${routePath}/products/`).set("Cookie", paoloCaglieroCookie).expect(404); 
        })

    }) 


    describe("DELETE /current", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        
        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Delete the current cart", async () => {
            
            await request(app).delete(`${routePath}/current`).set("Cookie", paoloCaglieroCookie).expect(200);

            const res = await request(app).get(`${routePath}/`).set("Cookie", paoloCaglieroCookie).expect(200);
            const cartAfterDeletion = res.body;

            expect(cartAfterDeletion.total).toBe(0);
            
        })

        test("It should return a 401 error code", async () => {
            await request(app).delete(`${routePath}/current`).expect(401);
            await request(app).delete(`${routePath}/current`).set("Cookie", managerCookie).expect(401); 
            await request(app).delete(`${routePath}/current`).set("Cookie", adminCookie).expect(401); 
        })


    }) 


    describe("GET /all", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        
        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Get all carts of all users", async () => {
            
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
          
              const res = await request(app).get(`${routePath}/all`).set("Cookie", managerCookie).expect(200);
              let carts = res.body;
          
              expect(carts.length).toBe(expected.length);
          
              carts = carts.sort((e1: Cart, e2: Cart) => e1.customer.localeCompare(e2.customer));
              expected = expected.sort((e1: Cart, e2: Cart) => e1.customer.localeCompare(e2.customer));
              expect(carts).toEqual(expected);
            
        })

        test("It should return a 401 error code", async () => {
            await request(app).get(`${routePath}/all`).expect(401);
            await request(app).get(`${routePath}/all`).set("Cookie", paoloCaglieroCookie).expect(401); 
        })
    })


    describe("DELETE /", () => {

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        
        //A 'test' block is a single test. It should be a single logical unit of testing for a specific functionality and use case (e.g. correct behavior, error handling, authentication checks)
        test("Delete all existing carts of all users", async () => {
            
            await request(app).delete(`${routePath}/`).set("Cookie", managerCookie).expect(200);

            const res = await request(app).get(`${routePath}/all`).set("Cookie", managerCookie).expect(200);
            const cartsAfterDeletion = res.body;
            expect(cartsAfterDeletion.length).toBe(0);
            
        })

        test("It should return a 401 error code", async () => {
            await request(app).delete(`${routePath}/`).expect(401);
            await request(app).delete(`${routePath}/`).set("Cookie", paoloCaglieroCookie).expect(401); 
        })

    }) 


    

    


        


}) 

  
