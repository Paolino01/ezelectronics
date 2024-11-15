import { describe, test, expect, beforeAll, afterAll, jest, afterEach, it } from "@jest/globals"

import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { UserAlreadyExistsError, UserIsAdminError, UserNotFoundError } from "../../src/errors/userError"
import { Role, User } from "../../src/components/user"

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods to simulate the hashing of the password
//It then calls the createUser method and expects it to resolve true

describe("UserDAO_UnitTest", () => {
    let userDAO: UserDAO;
  
    beforeAll(() => {
        userDAO = new UserDAO();
    });

    afterEach(() => {
        jest.clearAllMocks();
      });
      
    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("getIsUserAuthenticated", () => {
        test("It should return true when username and password are valid", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
                callback(null, { username: "user1", password: "hashedPassword", salt: "salt" });
                return {} as Database
              });
              const mockCrypto = jest.spyOn(crypto, "timingSafeEqual").mockReturnValue(true);
              const result = await userDAO.getIsUserAuthenticated("user1", "password");
              expect(result).toBe(true);
              mockDBGet.mockRestore();
              mockCrypto.mockRestore();
        })

        test("It should return false for non-existent username", async () => {
            const userDAO = new UserDAO();
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, null);
                return {} as Database;
            });
    
            const result = await userDAO.getIsUserAuthenticated('nonexistentuser', 'plainPassword');
    
            expect(db.get).toHaveBeenCalledWith("SELECT username, password, salt FROM users WHERE username = ?", ['nonexistentuser'], expect.any(Function));
            expect(result).toBe(false);
        })

        test('It should return false for invalid password', async () => {
            const userDAO = new UserDAO();
            const mockUser = {
                username: 'testuser',
                password: Buffer.from('hashedPassword').toString('hex'),
                salt: 'salt'
            };
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockUser);
                return {} as Database;
            });
    
            const mockScryptSync = jest.spyOn(crypto, 'scryptSync').mockImplementation((password, salt, keylen) => {
                return Buffer.from('wrongHashedPassword');
            });
    
            const result = await userDAO.getIsUserAuthenticated('testuser', 'plainPassword');
    
            expect(db.get).toHaveBeenCalledWith("SELECT username, password, salt FROM users WHERE username = ?", [mockUser.username], expect.any(Function));
            expect(result).toBe(false);
    
            mockScryptSync.mockRestore();
        })    

        test('It should reject with an error on database error', async () => {
            const userDAO = new UserDAO();
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error('Database error'), null);
                return {} as Database;
            });
    
            await expect(userDAO.getIsUserAuthenticated('testuser', 'plainPassword')).rejects.toThrow('Database error');
            expect(db.get).toHaveBeenCalledWith("SELECT username, password, salt FROM users WHERE username = ?", ['testuser'], expect.any(Function));
        })
    })



    describe("createUser", () => {
        test("It should return true when user is created successfully", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null)
                return {} as Database;
            });
            const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
                return (Buffer.from("salt"))
            })
            const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
                return Buffer.from("hashedPassword")
            })
            const result = await userDAO.createUser("username", "name", "surname", "password", "role")
            expect(result).toBe(true)
            mockRandomBytes.mockRestore()
            mockDBRun.mockRestore()
            mockScrypt.mockRestore()
        })

        test("Check if the user already exists", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
                const uniqueConstraintError = new Error("UNIQUE constraint failed: users.username");
                callback(uniqueConstraintError);
                return {} as Database;
            });
            
            await expect(userDAO.createUser("existingUser", "test", "test", "password", "Customer")).rejects.toThrow(UserAlreadyExistsError);
            mockDBRun.mockRestore();
        })

        test("Check if there is a crypto error", async () => {
            const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation(() => {
                throw new Error("Crypto error");
            });
            
            await expect(userDAO.createUser("newUser", "test", "test", "password", "Customer")).rejects.toThrow(Error);
            mockRandomBytes.mockRestore();
        })

        test("It should reject with an error on database error", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
                const genericError = new Error("Generic database error");
                callback(genericError);
                return {} as Database;
            });
           
            await expect(userDAO.createUser("newUser", "test", "test", "password", "Customer")).rejects.toThrow(Error);
            mockDBRun.mockRestore();
        })
    })



    describe("getUsers", () => {
        test("It should return all the users", async () => {
            const users: User[] = [ new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                    new User('user2','user2','user2',Role.MANAGER,'user2','01/01/2001')];
            
            jest.spyOn(db, "all").mockImplementation((sql, callback) => {
                callback(null, users)
                return {} as Database;
            })
            const result = await userDAO.getUsers();
            expect(db.all).toHaveBeenCalledWith("SELECT * FROM users", expect.any(Function));
            expect(result).toEqual([new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                    new User('user2','user2','user2',Role.MANAGER,'user2','01/01/2001')]);
        })

        test('It should reject with an error on database error', async () => {
            const mockError = new Error('Database error');

            jest.spyOn(db, "all").mockImplementation((sql, callback) => {
                callback(mockError, null);
                return {} as Database;
            });
    
            await expect(userDAO.getUsers()).rejects.toThrow('Database error');
            expect(db.all).toHaveBeenCalledWith("SELECT * FROM users", expect.any(Function));
        })
    })



    describe("getUsersByRole", () => {
        it('It should resolve with an array of users for a valid role', async () => {
            const userDAO = new UserDAO();
            const role = 'Customer';
            const users: User[] = [ new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                    new User('user2','user2','user2',Role.CUSTOMER,'user2','01/01/2001')];
    
            jest.spyOn(db, "all").mockImplementation((sql, role, callback) => {
                callback(null, users);
                return {} as Database;
            });
    
            const result = await userDAO.getUsersByRole(role);
    
            expect(db.all).toHaveBeenCalledWith("SELECT * FROM users WHERE role=?", role, expect.any(Function));
            expect(result).toEqual([new User('user1','user1','user1',Role.CUSTOMER,'user1','01/01/2000'),
                                    new User('user2','user2','user2',Role.CUSTOMER,'user2','01/01/2001')]);
        })

        test('It should resolve with an empty array if no users have the specified role', async () => {
            const userDAO = new UserDAO();
            const mockRole = 'NonExistentRole';
            const mockRows: any[] = [];

            jest.spyOn(db, "all").mockImplementation((sql, role, callback) => {
                callback(null, mockRows);
                return {} as Database;
            });
    
            const result = await userDAO.getUsersByRole(mockRole);
    
            expect(db.all).toHaveBeenCalledWith("SELECT * FROM users WHERE role=?", mockRole, expect.any(Function));
            expect(result).toEqual([]);
        })

        test('It should reject with an error on database error', async () => {
            const userDAO = new UserDAO();
            const mockRole = 'Admin';
            const mockError = new Error('Database error');
    
            jest.spyOn(db, "all").mockImplementation((sql, role, callback) => {
                callback(mockError, null);
                return {} as Database;
            });
    
            await expect(userDAO.getUsersByRole(mockRole)).rejects.toThrow('Database error');
            expect(db.all).toHaveBeenCalledWith("SELECT * FROM users WHERE role=?", mockRole, expect.any(Function));
        })
    })



    describe("getUserByUsername", () => {
        test('It should resolve with a user object for an existing username', async () => {
            const mockUsername = 'existingUser';
            const mockRow: User = new User('existingUser', 'test', 'test', Role.CUSTOMER, 'test', '2000-01-01');
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockRow);
                return {} as Database;
            });
    
            const result = await userDAO.getUserByUsername(mockUsername);
    
            expect(db.get).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", [mockUsername], expect.any(Function));
            expect(result).toEqual(new User('existingUser', 'test', 'test', Role.CUSTOMER, 'test', '2000-01-01'));
        })

        test('It should reject with a UserNotFoundError for a non-existent username', async () => {
            const userDAO = new UserDAO();
            const mockUsername = 'nonExistentUser';
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, null);
                return {} as Database;
            });
    
            await expect(userDAO.getUserByUsername(mockUsername)).rejects.toThrow(UserNotFoundError);
            expect(db.get).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", [mockUsername], expect.any(Function));
        })
    
        test('It should reject with an error on database error', async () => {
            const userDAO = new UserDAO();
            const mockUsername = 'existingUser';
            const mockError = new Error('Database error');
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(mockError, null);
                return {} as Database;
            });
    
            await expect(userDAO.getUserByUsername(mockUsername)).rejects.toThrow('Database error');
            expect(db.get).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", [mockUsername], expect.any(Function));
        })
    })



    describe("deleteUser", () => {
        test('It should resolve with true when user is deleted successfully', async () => {
            const userDAO = new UserDAO();
            const mockUsername = 'userToDelete';
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, { role: 'Customer' });
                return {} as Database;
            });
    
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as Database;
            });
    
            const result = await userDAO.deleteUser(mockUsername);
    
            expect(db.get).toHaveBeenCalledWith("SELECT role FROM users WHERE username=?", mockUsername, expect.any(Function));
            expect(db.all).toHaveBeenCalledWith("DELETE FROM users WHERE username=?", mockUsername, expect.any(Function));
            expect(result).toBe(true);
        })
    
        test('It should reject with UserNotFoundError when user does not exist', async () => {
            const userDAO = new UserDAO();
            const mockUsername = 'nonexistentuser';
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, null);
                return {} as Database;
            });
    
            await expect(userDAO.deleteUser(mockUsername)).rejects.toThrow(UserNotFoundError);
            expect(db.get).toHaveBeenCalledWith("SELECT role FROM users WHERE username=?", mockUsername, expect.any(Function));
        })
    
        test('It should reject with UserIsAdminError when the user to delete is an admin', async () => {
            const userDAO = new UserDAO();
            const mockUsername = 'adminUser';
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, { role: 'Admin' });
                return {} as Database;
            });
    
            await expect(userDAO.deleteUser(mockUsername)).rejects.toThrow(UserIsAdminError);
            expect(db.get).toHaveBeenCalledWith("SELECT role FROM users WHERE username=?", mockUsername, expect.any(Function));
        })
    
        test('It should reject with an error on database error', async () => {
            const userDAO = new UserDAO();
            const mockUsername = 'userToDelete';
            const mockError = new Error('Database error');
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, { role: 'Manager' });
                return {} as Database;
            });
    
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(mockError);
                return {} as Database;
            });
    
            await expect(userDAO.deleteUser(mockUsername)).rejects.toThrow('Database error');
            expect(db.get).toHaveBeenCalledWith("SELECT role FROM users WHERE username=?", mockUsername, expect.any(Function));
            expect(db.all).toHaveBeenCalledWith("DELETE FROM users WHERE username=?", mockUsername, expect.any(Function));
        })
    })



    describe("deleteAll", () => {
        test('It should resolve with true when all non-admin users are deleted successfully', async () => {
            const userDAO = new UserDAO();
    
            jest.spyOn(db, "all").mockImplementation((sql, callback) => {
                callback(null);
                return {} as Database;
            });
    
            const result = await userDAO.deleteAll();
    
            expect(db.all).toHaveBeenCalledWith("DELETE FROM users WHERE role != 'Admin'", expect.any(Function));
            expect(result).toBe(true);
        })
    
        test('It should reject with an error on database error', async () => {
            const userDAO = new UserDAO();
            const mockError = new Error('Database error');
    
            jest.spyOn(db, "all").mockImplementation((sql, callback) => {
                callback(mockError);
                return {} as Database;
            });
    
            await expect(userDAO.deleteAll()).rejects.toThrow('Database error');
            expect(db.all).toHaveBeenCalledWith("DELETE FROM users WHERE role != 'Admin'", expect.any(Function));
        })

        test('It should resolve with true when there are no users in the database', async () => {
            const userDAO = new UserDAO();
    
            jest.spyOn(db, "all").mockImplementation((sql, callback) => {
                // Simulazione di una risposta vuota dal database
                callback(null, []);
                return {} as Database;
            });
    
            const result = await userDAO.deleteAll();
    
            expect(db.all).toHaveBeenCalledWith("DELETE FROM users WHERE role != 'Admin'", expect.any(Function));
            expect(result).toBe(true);
        })
    })



    describe("updateUserInfo", () => {
        test('It should resolve with the updated user object when the update is successful', async () => {
            const mockUsername = 'existingUser';
            const mockUpdatedUser: User = new User('existingUser', 'UpdatedName', 'UpdatedSurname', Role.CUSTOMER, 'UpdatedAddress', '2000-01-01');
    
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, true); 
                return {} as Database;
            });
    
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockUpdatedUser); 
                return {} as Database;
            });
    
            const result = await userDAO.updateUserInfo(mockUpdatedUser.name, mockUpdatedUser.surname, mockUpdatedUser.address, mockUpdatedUser.birthdate, mockUsername);
    
            expect(db.all).toHaveBeenCalledWith("UPDATE users SET name=?, surname=?, address=?, birthdate=? WHERE username=?", [mockUpdatedUser.name, mockUpdatedUser.surname, mockUpdatedUser.address, mockUpdatedUser.birthdate, mockUsername], expect.any(Function));
            expect(db.get).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", [mockUsername], expect.any(Function));
            expect(result).toEqual(new User(mockUpdatedUser.username, mockUpdatedUser.name, mockUpdatedUser.surname, mockUpdatedUser.role, mockUpdatedUser.address, mockUpdatedUser.birthdate));
        })
    
        test('It should reject with UserNotFoundError when the user does not exist during update', async () => {
            const mockUsername = 'nonExistentUser';
    
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, false); 
                return {} as Database;
            });
    
            await expect(userDAO.updateUserInfo('name', 'surname', 'address', '2000-01-01', mockUsername)).rejects.toThrow(UserNotFoundError);
            expect(db.all).toHaveBeenCalledWith("UPDATE users SET name=?, surname=?, address=?, birthdate=? WHERE username=?", ['name', 'surname', 'address', '2000-01-01', mockUsername], expect.any(Function));
        })
    
        test('It should reject with UserNotFoundError when the user does not exist during fetch', async () => {
            const mockUsername = 'nonExistentUser';
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, true); 
                return {} as Database;
            });
    
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, true); 
                return {} as Database;
            });
    
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, null); 
                return {} as Database;
            });
    
            await expect(userDAO.updateUserInfo('name', 'surname', 'address', '2000-01-01', mockUsername)).rejects.toThrow(UserNotFoundError);
            expect(db.all).toHaveBeenCalledWith("UPDATE users SET name=?, surname=?, address=?, birthdate=? WHERE username=?", ['name', 'surname', 'address', '2000-01-01', mockUsername], expect.any(Function));
            expect(db.get).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", [mockUsername], expect.any(Function));
        })
    
        test('It should reject with an error on database error during update', async () => {
            const mockUsername = 'userToUpdate';
            const mockError = new Error('Database error during update');
    
            jest.spyOn(db, "get").mockImplementation((sql, role, callback) => {
                callback(null, []);
                return {} as Database;
            });
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(mockError); 
                return {} as Database;
            });
    
            await expect(userDAO.updateUserInfo('name', 'surname', 'address', '2000-01-01', mockUsername)).rejects.toThrow('Database error during update');
            expect(db.all).toHaveBeenCalledWith("UPDATE users SET name=?, surname=?, address=?, birthdate=? WHERE username=?", ['name', 'surname', 'address', '2000-01-01', mockUsername], expect.any(Function));
        })
    
        test('It should reject with an error on database error during fetch', async () => {
            const userDAO = new UserDAO();
            const mockUsername = 'userToUpdate';
            const mockUserToUpdate: User = new User('userToUpdate', 'Name', 'Surname', Role.CUSTOMER, 'Address', '2000-01-01');
            const mockUpdatedUser: User = new User('userToUpdate', 'UpdatedName', 'UpdatedSurname', Role.CUSTOMER, 'UpdatedAddress', '2000-01-01');
            const mockError = new Error('Database error during fetch');

            jest.spyOn(db, "get").mockImplementationOnce((sql, role, callback) => {
                callback(null, mockUpdatedUser);
                return {} as Database;
            });
    
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, true);
                return {} as Database;
            });
    
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(mockError); 
                return {} as Database;
            });
    
            await expect(userDAO.updateUserInfo(mockUpdatedUser.name, mockUpdatedUser.surname, mockUpdatedUser.address, mockUpdatedUser.birthdate, mockUsername)).rejects.toThrow('Database error during fetch');
            expect(db.all).toHaveBeenCalledWith("UPDATE users SET name=?, surname=?, address=?, birthdate=? WHERE username=?", [mockUpdatedUser.name, mockUpdatedUser.surname, mockUpdatedUser.address, mockUpdatedUser.birthdate, mockUsername], expect.any(Function));
            expect(db.get).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", [mockUsername], expect.any(Function));
        })
    })
})