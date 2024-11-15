import { describe, test, expect, jest, afterEach } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { UserAlreadyExistsError, UserNotFoundError } from "../../src/errors/userError"
import { Role, User } from "../../src/components/user"

jest.mock("../../src/dao/userDAO")

//Example of a unit test for the createUser method of the UserController
//The test checks if the method returns true when the DAO method returns true
//The test also expects the DAO method to be called once with the correct parameters

describe("UserController_UnitTest", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });



    describe("createUser", () => {
        test("It should return true when user is created successfully", async () => {
            const testUser = { 
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            }
            jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); 
            const controller = new UserController(); 
            const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);
        
            expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role);
            expect(response).toBe(true); //Check if the response is true
        })

        test("Check if the user already exists", async () => {
            const testUser = { 
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            }
            jest.spyOn(UserDAO.prototype, "createUser").mockRejectedValue(new UserAlreadyExistsError()); 
            const controller = new UserController(); 
        
            try {                                                   
                await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role)
            }
            catch(e) {
                expect(e.customCode).toBe(409)
            }
        })
    })



    describe("getUsers", () => {
        test("It should return all the users when the parameters are correct", async () => {
            const testUsers: User[] = [ new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                        new User('user2','user2','user2',Role.MANAGER,'user2','01/01/2001')];
    
            jest.spyOn(UserDAO.prototype, 'getUsers').mockResolvedValue(testUsers);
            const controller = new UserController();
            const result = await controller.getUsers();
            expect(UserDAO.prototype.getUsers).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testUsers);
        })

        test("Check if the database is empty", async () => {
            jest.spyOn(UserDAO.prototype, 'getUsers').mockResolvedValueOnce([]);
            const controller = new UserController();
            const response = await controller.getUsers()
            expect(response).toEqual([])
        })
    })



    describe("getUsersByRole", () => {
        test("It should return all the users by role when parameters are correct", async () => {
            const testUsers: User[] = [ new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                        new User('user2','user2','user2',Role.CUSTOMER,'user2','01/01/2001')];
            
            jest.spyOn(UserDAO.prototype, 'getUsersByRole').mockResolvedValueOnce(testUsers);
            const controller = new UserController();
            const result = await controller.getUsersByRole('Customer');
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith('Customer');
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testUsers);
        })

        test("Check if the role does not esist", async () => {
            jest.spyOn(UserDAO.prototype, 'getUsersByRole').mockResolvedValueOnce([])
            const controller = new UserController();
            const result = await controller.getUsersByRole('NonExistentRole');
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith('NonExistentRole');
            expect(result).toEqual([]);
        })

        test("Check if the database is empty", async () => {
            jest.spyOn(UserDAO.prototype, 'getUsersByRole').mockResolvedValueOnce([]);
            const controller = new UserController();
            const response = await controller.getUsersByRole('Manager')
            expect(response).toEqual([])
        })
    })



    describe("getUsersByUsername", () => {
        test("It should return the user by username when parameters are correct", async () => {
            const testUser: User = new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000');
            
            jest.spyOn(UserDAO.prototype, 'getUserByUsername').mockResolvedValueOnce(testUser);
            const controller = new UserController();
            const result = await controller.getUserByUsername('user1');
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith('user1');
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testUser);
        })

        test("Check if the username does not esist", async () => {
            jest.spyOn(UserDAO.prototype, 'getUserByUsername').mockRejectedValueOnce(new UserNotFoundError());
            const controller = new UserController();
            
            try {                                                   
                await controller.getUserByUsername('NotExistingUser')
            }
            catch(e) {
                expect(e.customCode).toBe(404)
            }
        })
    })



    describe("deleteUser", () => {
        test("It should return true when the user is deleted successfully", async () => {
            jest.spyOn(UserDAO.prototype, 'deleteUser').mockResolvedValue(true);
            const controller = new UserController();
            const result = await controller.deleteUser('test');

            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith('test');
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);
        })

        test("Check if the user does not exist", async () => {
            jest.spyOn(UserDAO.prototype, 'deleteUser').mockRejectedValueOnce(new UserNotFoundError());
            const controller = new UserController();

            try {                                                   
                await controller.deleteUser('NotExistingUser')
            }
            catch(e) {
                expect(e.customCode).toBe(404)
            }
        })
    })



    describe("deleteAll", () => {
        test("It should return true when all the users are deleted successfully", async () => {
            jest.spyOn(UserDAO.prototype, 'deleteAll').mockResolvedValue(true);
            const controller = new UserController();
            const result = await controller.deleteAll();

            expect(UserDAO.prototype.deleteAll).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);
        })
    })

    

    describe("updateUserInfo", () => {
        test("It should return true when the user's info are updated successfully", async () => {
            const testUser: User = new User('testuser', 'Updated Name', 'Updated Surname', Role.CUSTOMER, 'Updated Address', '2000-01-01');
    
            jest.spyOn(UserDAO.prototype, 'updateUserInfo').mockResolvedValue(testUser);
            const controller = new UserController();
            const result = await controller.updateUserInfo(testUser,'Updated Name','Updated Surname','Updated Address','2000-01-01','testuser');
    
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledWith('Updated Name','Updated Surname','Updated Address','2000-01-01','testuser');
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testUser);
        })

        test("Check if the user does not exist", async () => {
            const testUser: User = new User('testuser', 'Updated Name', 'Updated Surname', Role.CUSTOMER, 'Updated Address', '2000-01-01');
            jest.spyOn(UserDAO.prototype, 'updateUserInfo').mockRejectedValueOnce(new UserNotFoundError());
            const controller = new UserController();

            try {                                                   
                await controller.updateUserInfo(testUser,'Updated Name','Updated Surname','Updated Address','2000-01-01','testuser')
            }
            catch(e) {
                expect(e.customCode).toBe(404)
            }
        })
    })
})
