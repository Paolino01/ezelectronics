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


    const initializationScriptAfterEach = 
  `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;
  `;
//DELETE FROM users?

const initializationScriptAfterAll = 
  `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;
    DELETE FROM users;
  `;

const userRoutePath = "/ezelectronics/users"
const sessionRoutePath = "/ezelectronics/sessions"

//Default user information. We use them to create users and evaluate the returned values
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const customer1 = { username: "customer1", name: "customer1", surname: "customer1", password: "customer1", role: "Customer" }
const deletedCustomer = { username: "delCustomer", name: "delCustomer", surname: "delCustomer", password: "delCustomer", role: "Customer" }

//Cookies for the users. We use them to keep users logged in. Creating them once and saving them in a variables outside of the tests will make cookies reusable
let adminCookie: string
let managerCookie: string
let customerCookie: string
let deletedCustomerCookie: string

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
        .then(() => postUser(admin))
        .then(() => login(admin))
        .then((cookie) => {
            adminCookie = cookie;
            return postUser(manager);
        })
        .then(() => login(manager))
        .then((cookie) => {
            managerCookie = cookie;
            return postUser(customer);
        })
        .then(() => login(customer))
        .then((cookie) => {
            customerCookie = cookie;
        });
});


afterAll(() => {
    db.exec(initializationScriptAfterAll);
});

describe("User routes integration tests", () => {

    describe("POST /", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);

            await postUser(customer);
            customerCookie = await login(customer);
            
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return a 200 success code when user is created successfully", async () => {
            await request(app)
                .post(`${userRoutePath}/`)
                .send(customer1)
                .expect(200)

            const users = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)
                                
            expect(users.body).toHaveLength(4)
            let cust = users.body.find((user: any) => user.username === customer1.username)
            expect(cust).toBeDefined() 
            expect(cust.name).toBe(customer1.name)
            expect(cust.surname).toBe(customer1.surname)
            expect(cust.role).toBe(customer1.role)
        })

        test("It should return a 422 error code if at least one request body parameter is empty/missing", async () => {
            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "", name: "test", surname: "test", password: "test", role: "Customer" }) 
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "", surname: "test", password: "test", role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: "", password: "test", role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: "test", password: "", role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: "test", password: "test", role: "InvalidRole" })
                .expect(422) 
        })

        test("It should return a 422 error code if at least one request body parameter is not a string", async () => {
            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: 123, name: "test", surname: "test", password: "test", role: "Customer" }) 
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: 123, surname: "test", password: "test", role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: 123, password: "test", role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: "test", password: 123, role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: "test", password: "test", role: 123 })
                .expect(422) 
        })

        test("It should return a 422 error code if at least one request body parameter is null", async () => {
            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: null, name: "test", surname: "test", password: "test", role: "Customer" }) 
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: null, surname: "test", password: "test", role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: null, password: "test", role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: "test", password: null, role: "Customer" })
                .expect(422)

            await request(app)
                .post(`${userRoutePath}/`)
                .send({ username: "test", name: "test", surname: "test", password: "test", role: null })
                .expect(422) 
        })

        test("It should return a 409 error code if the user already exists", async () => {
            await request(app)
                .post(`${userRoutePath}/`)
                .send(manager)
                .expect(409)

            const users = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)
                                
            expect(users.body).toHaveLength(3)
        })
    })



    describe("GET /", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);

            await postUser(customer);
            customerCookie = await login(customer);
            
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return an array of users when user is an admin", async () => {
            const users = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)

            expect(users.body).toHaveLength(3)

            let adm = users.body.find((user: any) => user.username === admin.username)
            expect(adm).toBeDefined()
            expect(adm.name).toBe(admin.name)
            expect(adm.surname).toBe(admin.surname)
            expect(adm.role).toBe(admin.role)

            let mngr = users.body.find((user: any) => user.username === manager.username)
            expect(mngr).toBeDefined()
            expect(mngr.name).toBe(manager.name)
            expect(mngr.surname).toBe(manager.surname)
            expect(mngr.role).toBe(manager.role)

            let cust = users.body.find((user: any) => user.username === customer.username)
            expect(cust).toBeDefined()
            expect(cust.name).toBe(customer.name)
            expect(cust.surname).toBe(customer.surname)
            expect(cust.role).toBe(customer.role)
        })

        test("It should return a 401 error code if the user is not an admin", async () => {
            await request(app)
                .get(`${userRoutePath}/`)
                .set("Cookie", managerCookie)
                .expect(401)
        })
    })



    describe("GET /roles/:role", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);
            
            await postUser(customer);
            customerCookie = await login(customer);
        })
        
        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return an array of users with a specific role", async () => {
            //Route parameters are set in this way by placing directly the value in the path
            //It is not possible to send an empty value for the role (/users/roles/ will not be recognized as an existing route, it will return 404)
            //Empty route parameters cannot be tested in this way, but there should be a validation block for them in the route
            const admins = await request(app)
                                .get(`${userRoutePath}/roles/Admin`)
                                .set("Cookie", adminCookie)
                                .expect(200)
            
            expect(admins.body).toHaveLength(1) 
            let adm = admins.body[0]
            expect(adm.username).toBe(admin.username)
            expect(adm.name).toBe(admin.name)
            expect(adm.surname).toBe(admin.surname)
        })

        test("It should return a 422 error code if the role is not valid", async () => {
            await request(app)
                .get(`${userRoutePath}/roles/InvalidRole`)
                .set("Cookie", adminCookie)
                .expect(422)
        })

        test("It should return a 401 error code if the user is not an admin", async () => {
            await request(app)
                .get(`${userRoutePath}/roles/Customer`)
                .set("Cookie", managerCookie)
                .expect(401)
        })

        test("It should return a 422 error code if the role is null", async () => {
            const role: string|null = null;
            await request(app)
                .get(`${userRoutePath}/roles/${role}`)
                .set("Cookie", adminCookie)
                .expect(422)
        })
    })



    describe("GET /:username", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);
            
            await postUser(customer);
            customerCookie = await login(customer);
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return a user with a specific username", async () => {
            const user = await request(app)
                                .get(`${userRoutePath}/manager`)
                                .set("Cookie", adminCookie) 
                                .expect(200)
            
            expect(user.body.username).toBe(manager.username)
            expect(user.body.name).toBe(manager.name)
            expect(user.body.surname).toBe(manager.surname)
        })

        test("It should return a 404 error code if the user does not exists", async () => {
            await request(app)
                .get(`${userRoutePath}/NonExistentUser`)
                .set("Cookie", adminCookie)
                .expect(404)
        })

        test("It should return a 401 error code if the user is not an admin or if it is not them profile", async () => {
            const otherUser = { username: "other", name: "other", surname: "other", password: "other", role: "Customer" }
            await request(app)
                .post(`/ezelectronics/users`)
                .send(otherUser)
                .expect(200)

            await request(app)
                .get(`${userRoutePath}/otherUser`)
                .set("Cookie", managerCookie)
                .expect(401)
        })

        test("It should return a 422 error code if username is null", async () => {
            const username: string|null = null
            await request(app)
                .get(`${userRoutePath}/${username}`)
                .set("Cookie", adminCookie)
                .expect(404)
        })

        test("It should return a 422 error code if username is not a string", async () => {
            const username = 123
            await request(app)
                .get(`${userRoutePath}/${username}`)
                .set("Cookie", adminCookie)
                .expect(404)
        })
    })



    describe("UPDATE /:username", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);
            
            await postUser(customer);
            customerCookie = await login(customer);
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return a 200 success code when user's info are updated successfully by an admin", async () => {
            const updatedManager = { 
                name: "upManager", 
                surname: "upManager",  
                address: "upManager", 
                birthdate: "2000-01-01"}
                
            const update = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(200)
                    
            expect(update.body.surname).toBe(updatedManager.surname)
            expect(update.body.name).toBe(updatedManager.name)
            expect(update.body.address).toBe(updatedManager.address)
            expect(update.body.birthdate).toBe(updatedManager.birthdate)
        })

        test("It should return a 200 success code when user's info are updated successfully by themself", async () => {
            const updatedManager = { 
                name: "upManager", 
                surname: "upManager",  
                address: "upManager", 
                birthdate: "2000-01-01"}
                
            const update = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", managerCookie)
                            .expect(200)
                    
            expect(update.body.surname).toBe(updatedManager.surname)
            expect(update.body.name).toBe(updatedManager.name)
            expect(update.body.address).toBe(updatedManager.address)
            expect(update.body.birthdate).toBe(updatedManager.birthdate)
        })

        test("It should return a 422 error code when parameters are empty", async () => {
            const updatedManager = { 
                name: "", 
                surname: "upManager",  
                address: "upManager", 
                birthdate: "2000-01-01"}
                
            const update = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)

            const updatedManager1 = { 
                name: "upManager", 
                surname: "",  
                address: "upManager", 
                birthdate: "2000-01-01"}
                
            const update1 = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)

            const updatedManager2 = { 
                name: "upManager", 
                surname: "upManager",  
                address: "", 
                birthdate: "2000-01-01"}
                
            const update2 = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)

            const updatedManager3 = { 
                name: "upManager", 
                surname: "upManager",  
                address: "upManager", 
                birthdate: ""}
                
            const update3 = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)
        })

        test("It should return a 422 error code when parameters are not string", async () => {
            const updatedManager = { 
                name: 123, 
                surname: "upManager",  
                address: "upManager", 
                birthdate: "2000-01-01"}
                
            const update = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)

            const updatedManager1 = { 
                name: "upManager", 
                surname: 123,  
                address: "upManager", 
                birthdate: "2000-01-01"}
                
            const update1 = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)

            const updatedManager2 = { 
                name: "upManager", 
                surname: "upManager",  
                address: 123, 
                birthdate: "2000-01-01"}
                
            const update2 = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)

            const updatedManager3 = { 
                name: "upManager", 
                surname: "upManager",  
                address: "upManager", 
                birthdate: 123}
                
            const update3 = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)
        })

        test("It should return a 422 error code when date format is invalid", async () => {
            const updatedManager = { 
                name: "upManager", 
                surname: "upManager",  
                address: "upManager", 
                birthdate: "2000/01/01"}
                
            const update = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(422)
        })

        test("It should return a 400 error code when birthdate is wrong (after current date)", async () => {
            const updatedManager = { 
                name: "upManager", 
                surname: "upManager",  
                address: "upManager", 
                birthdate: "2025-01-01"}
                
            const update = await request(app)
                            .patch(`${userRoutePath}/manager`)
                            .send(updatedManager)
                            .set("Cookie", adminCookie)
                            .expect(400)
        })

        test("It should return a 401 error code when an admin tries to update anoter admin's info", async () => {
            const otherAdmin = { username: "otherAdmin", name: "otherAdmin", surname: "otherAdmin", password: "otherAdmin", role: "Admin", address: "otherAdmin", birthdate: "2000-02-02"}
            
            await request(app)
                .post(`${userRoutePath}`)
                .send(otherAdmin)
                .expect(200)

            const updatedAdmin = { 
                name: "upAdmin", 
                surname: "upAdmin",  
                address: "upAdmin", 
                birthdate: "2000-01-01"}
                
            const response = await request(app)
                .patch(`${userRoutePath}/otherAdmin`)
                .send(updatedAdmin)
                .set("Cookie", adminCookie)
                .expect(401)
        })
    })



    describe("DELETE /:username", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);
            
            await postUser(customer);
            customerCookie = await login(customer);
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return a 200 success code when a user is deleted successfully by an admin", async () => {
            await request(app)
                .post(`${userRoutePath}/`)
                .send(deletedCustomer)
                .expect(200)

            const usersBefore = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)
                                
            expect(usersBefore.body).toHaveLength(4)

            await request(app)
                .delete(`${userRoutePath}/delCustomer`)
                .set("Cookie", adminCookie)
                .expect(200)
              
            const usersAfter = await request(app)
                .get(`${userRoutePath}/`)
                .set("Cookie", adminCookie)
                .expect(200)
                
            expect(usersAfter.body).toHaveLength(3)
        })

        test("It should return a 200 success code when a user is deleted successfully by themselves", async () => {
            await request(app)
                .post(`${userRoutePath}/`)
                .send(deletedCustomer)
                .expect(200)

            const usersBefore = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)
                                
            expect(usersBefore.body).toHaveLength(4)

            deletedCustomerCookie = await login(deletedCustomer)
            await request(app)
                .delete(`${userRoutePath}/delCustomer`)
                .set("Cookie", deletedCustomerCookie)
                .expect(200)
              
            const usersAfter = await request(app)
                .get(`${userRoutePath}/`)
                .set("Cookie", adminCookie)
                .expect(200)
                
            expect(usersAfter.body).toHaveLength(3)
        })

        test("It should return a 401 error code when an admin tries to delete another admin", async () => {
            const otherAdmin = { username: "otherAdmin", name: "otherAdmin", surname: "otherAdmin", password: "otherAdmin", role: "Admin" }

            await request(app)
                    .post(`${userRoutePath}/`)
                    .send(otherAdmin)
                    .expect(200)

            const usersBefore = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)
                                
            expect(usersBefore.body).toHaveLength(4)

            await request(app)
                .delete(`${userRoutePath}/otherAdmin`)
                .set("Cookie", adminCookie)
                .expect(401)
              
            const usersAfter = await request(app)
                .get(`${userRoutePath}/`)
                .set("Cookie", adminCookie)
                .expect(200)
                
            expect(usersAfter.body).toHaveLength(4)
        })

        test("It should return a 401 error code when a user tries to delete another user", async () => {
            await request(app)
                    .post(`${userRoutePath}/`)
                    .send(customer1)
                    .expect(200)

            const usersBefore = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)
                                
            expect(usersBefore.body).toHaveLength(4)

            await request(app)
                .delete(`${userRoutePath}/customer1`)
                .set("Cookie", customerCookie)
                .expect(401)
              
            const usersAfter = await request(app)
                .get(`${userRoutePath}/`)
                .set("Cookie", adminCookie)
                .expect(200)
                
            expect(usersAfter.body).toHaveLength(4)
        })

        test("It should return a 404 error code if the user to delete does not exists", async () => {
            await request(app)
                .delete(`${userRoutePath}/NonExistentUser`)
                .set("Cookie", adminCookie)
                .expect(404)
        })
    })



    describe("DELETE /", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);
            
            await postUser(customer);
            customerCookie = await login(customer);
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return a 401 error code when a customer or a manager tries to delete all users", async () => {
            const usersBefore = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)
                                
            expect(usersBefore.body).toHaveLength(3)

            await request(app)
                .delete(`${userRoutePath}/`)
                .set("Cookie", customerCookie)
                .expect(401)
              
            const usersAfter = await request(app)
                .get(`${userRoutePath}/`)
                .set("Cookie", adminCookie)
                .expect(200)
                
            expect(usersAfter.body).toHaveLength(3)
        })

        test("It should return a 200 success code when all users are deleted successfully", async () => {
            const usersBefore = await request(app)
                                .get(`${userRoutePath}/`)
                                .set("Cookie", adminCookie)
                                .expect(200)
                                
            expect(usersBefore.body).toHaveLength(3)

            await request(app)
                .delete(`${userRoutePath}/`)
                .set("Cookie", adminCookie)
                .expect(200)
              
            const usersAfter = await request(app)
                .get(`${userRoutePath}/`)
                .set("Cookie", adminCookie)
                .expect(200)
                
            expect(usersAfter.body).toHaveLength(1)
        })
    })
})



describe ("Session routes integration test", () => {

    describe("POST /", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);
            
            await postUser(customer);
            customerCookie = await login(customer);
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return a 200 success code when login is successful", async () => {
            const newUser = { username: "test", name: "test", surname: "test", password: "test", role: "Customer" } 
            await request(app)
                .post(`${userRoutePath}/`)
                .send(newUser)
                .expect(200)

            await request(app)
                .post(`${sessionRoutePath}/`)
                .send(newUser)    
                .expect(200)
        })

        test("It should return a 422 error code when username or password are empty", async () => {
            const newUser = { username: "", name: "test", surname: "test", password: "test", role: "Customer" } 
            await request(app)
                .post(`${userRoutePath}/`)
                .send(newUser)
                .expect(422)

            await request(app)
                .post(`${sessionRoutePath}/`)
                .send(newUser)    
                .expect(422)
            
            const newUser1 = { username: "test", name: "test", surname: "test", password: "", role: "Customer" } 
            await request(app)
                .post(`${userRoutePath}/`)
                .send(newUser1)
                .expect(422)

            await request(app)
                .post(`${sessionRoutePath}/`)
                .send(newUser1)    
                .expect(422)
        })

        test("It should return a 422 error code when username or password are not string", async () => {
            const newUser = { username: 123, name: "test", surname: "test", password: "test", role: "Customer" } 
            await request(app)
                .post(`${userRoutePath}/`)
                .send(newUser)
                .expect(422)

            await request(app)
                .post(`${sessionRoutePath}/`)
                .send(newUser)    
                .expect(422)
            
            const newUser1 = { username: "test", name: "test", surname: "test", password: 123, role: "Customer" } 
            await request(app)
                .post(`${userRoutePath}/`)
                .send(newUser1)
                .expect(422)

            await request(app)
                .post(`${sessionRoutePath}/`)
                .send(newUser1)    
                .expect(422)
        })
    })



    describe("DELETE /current", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);

            await postUser(customer);
            customerCookie = await login(customer);
            
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return a 200 success code when logout is successful", async () => {
            await request(app)
                .delete(`${sessionRoutePath}/current`)
                .set("Cookie", customerCookie)
                .expect(200)
        })
        
        //come testo il fallimento del logout?
    })



    describe("getCurrent", () => {

        beforeEach(async () => {
            await runExec(initializationScriptBeforeAll);
        
            await postUser(admin);
            adminCookie = await login(admin);
        
            await postUser(manager);
            managerCookie = await login(manager);
            
            await postUser(customer);
            customerCookie = await login(customer);
        })

        afterEach(() => {
            return runExec(initializationScriptAfterEach);
        })

        test("It should return a 200 success code when retrieving the current user's info is successful.", async () => {
            const current =await request(app)
                            .get(`${sessionRoutePath}/current`)
                            .set("Cookie", managerCookie)
                            .expect(200)

            expect(current.body.name).toBe(manager.name)
            expect(current.body.surname).toBe(manager.surname)
            expect(current.body.username).toBe(manager.username)
        }) 
        
        test("It should return a 401 error code when cookie is invalid.", async () => {
            const current =await request(app)
                            .get(`${sessionRoutePath}/current`)
                            .set("Cookie", "someCookie")
                            .expect(401)
        })

        test("It should return a 401 error code when there is no cookie", async () => {
            const current =await request(app)
                            .get(`${sessionRoutePath}/current`)
                            .expect(401)
        })
    })
})