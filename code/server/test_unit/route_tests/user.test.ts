import { test, expect, jest, describe, afterEach} from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { User } from "../../src/components/user"
import { Role } from "../../src/components/user"

import UserController from "../../src/controllers/userController"
import Authenticator from "../../src/routers/auth"
import { UnauthorizedUserError, UserIsAdminError } from "../../src/errors/userError"
import { DateError } from "../../src/utilities"
const baseURL = "/ezelectronics"

//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters
describe ("UserRoutes_UnitTest", () => {
    
    afterEach(() => {
        jest.restoreAllMocks();
    });



    describe("User route: POST/", () => {
        test("POST request to create a user: it should return a 200 success code", async () => {
            const testUser = { //Define a test user object sent to the route
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            }
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
            const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
            expect(response.status).toBe(200) //Check if the response status is 200
            expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
            //Check if the createUser method has been called with the correct parameters
            expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role)
        })
        
        test("POST request to create a user: it should return a 422 error code when parameters are empty", async () => {
            const invalidUser = { 
                username: "", 
                name: "", 
                surname: "", 
                password: "", 
                role: "" 
            }
        
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true)
            const response = await request(app).post(baseURL + "/users").send(invalidUser)
            expect(response.status).toBe(422) 
        })
        
        test("POST request to create a user: it should return a 422 error code when username, name, surname and password are not string", async () => {
            const invalidUser = { 
                username: 123, 
                name: 123, 
                surname: 123, 
                password: 123, 
                role: 123 
            }
        
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true)
            const response = await request(app).post(baseURL + "/users").send(invalidUser)
            expect(response.status).toBe(422) 
        })
    })



    describe("User route: GET/", () => {
        test('GET request to get all users: it should return a 200 success code', async () => {
            const loggedInUser = {
                role: 'Admin'
            };
        
            const users: User[] = [ new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                    new User('user2','user2','user2',Role.MANAGER,'user2','01/01/2001')];
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next(); 
            });
        
            const isAdminMock = jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementation((req, res, next) => {
                if (req.user && req.user.role === 'Admin') {
                    next(); 
                } else {
                    res.status(401).json({ error: 'Unauthorized' }); 
                }
            });
        
            const getUsersMock = jest.spyOn(UserController.prototype, 'getUsers').mockResolvedValueOnce(users);
            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(200);
            expect(isLoggedInMock).toHaveBeenCalled();
            expect(isAdminMock).toHaveBeenCalled();
            expect(getUsersMock).toHaveBeenCalled();
        
            isLoggedInMock.mockRestore();
            isAdminMock.mockRestore();
            getUsersMock.mockRestore();
        });
        
        test('GET request to get all users: it should return a 401 error code when the user is not an admin', async () => {
            const loggedInUser = {
                role: 'Customer'
            };
        
            const users: User[] = [ new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                    new User('user2','user2','user2',Role.MANAGER,'user2','01/01/2001')];
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next(); 
            });
        
            const isAdminMock = jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementation((req, res, next) => {
                if (req.user && req.user.role === 'Admin') {
                    next();
                } else {
                    res.status(401).json({ error: 'Unauthorized' });
                }
            });
        
            const getUsersMock = jest.spyOn(UserController.prototype, 'getUsers').mockResolvedValueOnce(users);
            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(401);
        
            isLoggedInMock.mockRestore();
            isAdminMock.mockRestore();
            getUsersMock.mockRestore();
        });
    })



    describe("User route: GET/roles/:role", () => {
        test('GET request to get all users with a specific role: it should return a 200 success code', async () => {
            const loggedInUser = {
                role: 'Admin'
            };
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next(); 
            });
        
            const isAdminMock = jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementation((req, res, next) => {
                if (req.user && req.user.role === 'Admin') {
                    next(); 
                } else {
                    res.status(401).json({ error: 'Unauthorized' }); 
                }
            });
        
            const users: User[] = [ new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                    new User('user2','user2','user2',Role.MANAGER,'user2','01/01/2001')];
        
            jest.spyOn(UserController.prototype, 'getUsersByRole').mockResolvedValueOnce(users);
        
            const validRole = 'Customer';
            const response = await request(app).get(`${baseURL}/users/roles/${validRole}`);
            expect(response.status).toBe(200);
            expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
            expect(UserController.prototype.getUsersByRole).toHaveBeenCalledWith(validRole);
            expect(response.body).toEqual(users);
        });
        
        test('GET request to get all users with a specific role: it should return a 401 error code, when the user is not an admin', async () => {
        
            const loggedInUser = {
                role: 'Customer'
            };
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next(); 
            });
        
            const isAdminMock = jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementation((req, res, next) => {
                if (req.user && req.user.role === 'Admin') {
                    next(); 
                } else {
                    res.status(401).json({ error: 'Unauthorized' }); 
                }
            });
        
            const users: User[] = [ new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                    new User('user2','user2','user2',Role.MANAGER,'user2','01/01/2001')];
        
            jest.spyOn(UserController.prototype, 'getUsersByRole').mockResolvedValueOnce(users);
        
            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(401);
        });
        
        test('GET request to get all users with a specific role: it should return a 422 error code if it filters by an invalid role', async () => {
            const loggedInUser = {
                role: 'Admin'
            };
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next(); 
            });
        
            const isAdminMock = jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementation((req, res, next) => {
                if (req.user && req.user.role === 'Admin') {
                    next(); 
                } else {
                    res.status(401).json({ error: 'Unauthorized' }); 
                }
            });
        
            const invalidRole = 'InvalidRole';
            const response = await request(app).get(`${baseURL}/users/roles/${invalidRole}`);
        
            expect(response.status).toBe(422);
          });
    })



    describe("User route: GET/:username", () => {
        test('GET request to get a user with a specific username: it should return a 200 success code', async () => {
            const loggedInUser = {
                username: 'user2',
                role: 'Manager'
            };
        
            /*You can try also with
            const loggedInUser = {
                username: 'user1',
                role: 'Customer'
            };*/
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next(); 
            }); 
        
            const user: User = new User('user2','user1','user1',Role.MANAGER,'user1','01/01/2000')
        
            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValueOnce(user);
        
            const username = 'user2';
            const response = await request(app).get(`${baseURL}/users/${username}`);
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(username);
            expect(response.status).toBe(200);
        });
        
        test('GET request to get a user with a specific username: it should a 401 error code if a manager or a customer wants the info of another username', async () => {
            const loggedInUser = {
                username: 'user2',
                role: 'Manager'
            };
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser;
                next();
            });
        
            const user: User = new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000')
        
            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValueOnce(user);
        
            const username = 'user1';
            const response = await request(app).get(`${baseURL}/users/${username}`);
            expect(response.status).toBe(401);
        });

        test('GET request to get all users with a specific username: it should return a 404 error code if the username is invalid (does not exist)', async () => {
            const loggedInUser = {
                role: 'Admin'
            };
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next(); 
            });
        
            const isAdminMock = jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementation((req, res, next) => {
                if (req.user && req.user.role === 'Admin') {
                    next(); 
                } else {
                    res.status(401).json({ error: 'Unauthorized' }); // Utente non autorizzato
                }
            });
        
            const invalidUsername = 'InvalidUsername';
            const response = await request(app).get(`${baseURL}/users/${invalidUsername}`);
        
            expect(response.status).toBe(404);
          });
    })



    describe("User route: DELETE/:username", () => {
        test('DELETE request to delete a personal account: it should return a 200 success code', async () => {
            const loggedInUser = {
                username: 'user2',
                role: 'Admin'
            };
        
            /*You can try also with
            const loggedInUser = {
                username: 'user1',
                role: 'Customer' or 'Manager
            };*/
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next();
            });
        
            const user: User = new User('user1','user1','user1',Role.ADMIN,'user1','01/01/2000')
        
            jest.spyOn(UserController.prototype, 'deleteUser').mockResolvedValueOnce(true);
        
            const username = 'user1';
            const response = await request(app).delete(`${baseURL}/users/${username}`);
            expect(response.status).toBe(200);
            expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(username);
        });
        
        test('DELETE request to delete a personal account: it should return a 401 error code if admin tries to delete another admin', async () => {
            const loggedInUser = {
                username: 'user2',
                role: 'Admin'
            };
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next();
            });
        
            jest.spyOn(UserController.prototype, 'deleteUser').mockRejectedValue(new UserIsAdminError());
        
            const username = 'user1';
            const response = await request(app).delete(`${baseURL}/users/${username}`);
            expect(response.status).toBe(401);
        });

        test('DELETE request to delete a personal account: it should return a 401 error code if customer tries to delete another user account', async () => {
            const loggedInUser = {
                username: 'user1',
                role: 'Customer'
            };
        
            const isLoggedInMock = jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser; 
                next();
            });
        
            jest.spyOn(UserController.prototype, 'deleteUser').mockRejectedValue(new UnauthorizedUserError);
        
            const username = 'user2';
            const response = await request(app).delete(`${baseURL}/users/${username}`);
            expect(response.status).toBe(401);
        });
    })



    describe("User route: DELETE/", () => {
        test("DELETE request to delete all users: it should return a 200 success code", async () => {
            const loggedInUser = new User("admin", "admin", "admin", Role.ADMIN, "", "");

            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser;
                next();
            });
    
            jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementation((req, res, next) => {
                if (req.user && req.user.role === 'Admin') {
                    next();
                } else {
                    res.status(401).json({ error: 'Unauthorized' });
                }
            });

            jest.spyOn(UserController.prototype, 'deleteAll').mockResolvedValueOnce(true);
            const response = await request(app).delete(`${baseURL}/users/`);
            expect(response.status).toBe(200);
        })

        test("DELETE request to delete all users: it should return a 401 error code when no admin", async () => {
            const loggedInUser = new User("admin", "admin", "admin", Role.MANAGER, "", "");
        
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = loggedInUser;
                next();
            });
        
            // Mock `deleteAll` to reject the promise
            jest.spyOn(UserController.prototype, 'deleteAll').mockResolvedValueOnce(true);
            const response = await request(app).delete(`${baseURL}/users/`);
            expect(response.status).toBe(401);
        });
    })



    describe("User route: PATCH/:username", () => {
        test("PATCH request to update personal account: it should return a 200 success code", async () => {
            const testUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.CUSTOMER,
                address: "",
                birthdate: ""
            };
            const updatedUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.CUSTOMER,
                address: "via roma",
                birthdate: "2001-01-01"
            }

            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = testUser;
                next()
            });

            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValueOnce(testUser);
            jest.spyOn(UserController.prototype, 'updateUserInfo').mockResolvedValueOnce(updatedUser);            
            const response = await request(app).patch(`${baseURL}/users/${testUser.username}`).send({
                name: "test",
                surname: "test",
                address: "via roma",
                birthdate: "2001-01-01"
            })
            expect(response.status).toBe(200); 
            expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1); 
            expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(testUser, updatedUser.name, updatedUser.surname, updatedUser.address, updatedUser.birthdate, updatedUser.username);
            expect(response.body).toEqual(updatedUser);
        })

        test("PATCH admin request to update other admin personal account: it should return a 401 error code, User Admin Error", async () => {
            const testUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.ADMIN,
                address: "via verdi",
                birthdate: "2001-01-01"
            };
            const updatedUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.ADMIN,
                address: "via roma",
                birthdate: "2001-01-01"
            }
            const admin = new User("admin", "admin", "admin", Role.ADMIN, "", "");
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = admin;
                next()
            });

            jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementation((req, res, next) => {
                if (req.user && req.user.role === 'Admin' && req.user.username === testUser.username) {
                    next();
                } else {
                    res.status(401).json({ error: 'Unauthorized' });
                }
            });

            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValueOnce(testUser);
            jest.spyOn(UserController.prototype, 'updateUserInfo').mockRejectedValueOnce(new UserIsAdminError);

            const response = await request(app).patch(`${baseURL}/users/${testUser.username}`).send({
                name: "test",
                surname: "test",
                address: "via roma",
                birthdate: "2001-01-01"
            });
            expect(response.status).toBe(401); 
        })

        test("PATCH user request to update other user personal account: it should return a 401 error code, Unauthorized User Error", async () => {
            const testUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.CUSTOMER,
                address: "via verdi",
                birthdate: "2001-01-01"
            };
            
            const otherUser = new User("other", "other", "other", Role.MANAGER, "", "");
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = otherUser;
                next()
            });

            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValueOnce(testUser);
            jest.spyOn(UserController.prototype, 'updateUserInfo').mockRejectedValueOnce(new UnauthorizedUserError);

            const response = await request(app).patch(`${baseURL}/users/${testUser.username}`).send({
                name: "test",
                surname: "test",
                address: "via roma",
                birthdate: "2001-01-01"
            });
            expect(response.status).toBe(401); 
        })

        test("PATCH user request with invalid parameters: it should return a 422 error code", async () => {
            const testUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.CUSTOMER,
                address: "via verdi",
                birthdate: ""
            };
            
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = testUser;
                next()
            });

            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValueOnce(testUser);
            jest.spyOn(UserController.prototype, 'updateUserInfo').mockRejectedValueOnce(new Error("Errore: parametri non validi"));

            const response = await request(app).patch(`${baseURL}/users/${testUser.username}`).send({
                name: "",
                surname: "test",
                address: "via roma",
                birthdate: ""
            });
            expect(response.status).toBe(422); 
        })

        test("PATCH user request with invalid date format: it should return a 422 error code", async () => {
            const testUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.CUSTOMER,
                address: "via verdi",
                birthdate: ""
            };
            
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = testUser;
                next()
            });

            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValueOnce(testUser);
            jest.spyOn(UserController.prototype, 'updateUserInfo').mockRejectedValueOnce(new Error("Errore: formato della data non corretto"));

            const response = await request(app).patch(`${baseURL}/users/${testUser.username}`).send({
                name: "test",
                surname: "test",
                address: "via roma",
                birthdate: "2001/01/01"
            });
            expect(response.status).toBe(422); 
        })

        test("PATCH user request with invalid date: it should return a 400 error code, Date Error", async () => {
            const testUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.CUSTOMER,
                address: "via verdi",
                birthdate: ""
            };
            
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = testUser;
                next()
            });

            jest.spyOn(UserController.prototype, 'getUserByUsername').mockResolvedValueOnce(testUser);
            jest.spyOn(UserController.prototype, 'updateUserInfo').mockRejectedValueOnce(new DateError());

            const response = await request(app).patch(`${baseURL}/users/${testUser.username}`).send({
                name: "test",
                surname: "test",
                address: "via roma",
                birthdate: "2025-01-01"
            });
            expect(response.status).toBe(400); 
        })
    })



    describe("Session route: POST/", () => {
        test("POST request to login: it should return a 200 success code", async () => {
            const testUser = {
                username: "test",
                password: "test"
            }

            jest.spyOn(Authenticator.prototype, 'login').mockResolvedValueOnce(true)
            const response = await request(app).post(`${baseURL}/sessions/`).send(testUser) 
            expect(response.status).toBe(200) 
            expect(Authenticator.prototype.login).toHaveBeenCalledTimes(1) 
        })

        test("POST request to login with invalid parameters: it should return a 422 error code", async () => {
            const invalidUser = {
                username: 123,
                password: ""
            }

            jest.spyOn(Authenticator.prototype, 'login').mockResolvedValueOnce(true)
            const response = await request(app).post(`${baseURL}/sessions/`).send(invalidUser) 
            expect(response.status).toBe(422) 
        })
    })



    describe("Session route: DELETE/current", () => {
        test('DELETE request to logout: it should return a 200 success code', async () => {
            const loggedInUser = {username: 'user1', role: 'Customer'};
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {req.user = loggedInUser; next(); });
            jest.spyOn(Authenticator.prototype, 'logout').mockResolvedValueOnce(true)

            const response = await request(app).delete(`${baseURL}/sessions/current`).send();
    
            expect(response.status).toBe(200);
            expect(Authenticator.prototype.logout).toHaveBeenCalledTimes(1);
        })

        test('DELETE request to logout: it should return a 401 error code if the user is not logged in', async () => {
            jest.spyOn(Authenticator.prototype, 'logout').mockImplementation((req, res, next) => {
                return Promise.reject(new Error('Logout failed'));
            });
            const response = await request(app).delete(`${baseURL}/sessions/current`);
    
            expect(response.status).toBe(401);
        });
    })



    describe("Session route: GET/current", () => {
        test("GET request to get the currently logged in user: it should return a 200 success code", async () => {
            const testUser = {
                username: "test",
                name: "test",
                surname: "test",
                role: Role.CUSTOMER,
                address: "via verdi",
                birthdate: "2001-01-01"
            }

            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                req.user = testUser;
                next();
            });
            const response = await request(app).get(`${baseURL}/sessions/current`)
            expect(response.status).toBe(200);
        })

        test('GET request to get the currently logged in user: it should return a 401 error code if the user is not logged in', async () => {
            jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
                return res.status(401).json({ error: 'Unauthorized' });
            });

            const response = await request(app).get(`${baseURL}/sessions/current`);
            expect(response.status).toBe(401);
        });
    })
})






  

