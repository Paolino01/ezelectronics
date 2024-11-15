import { test, expect, jest, describe, beforeEach, afterEach, beforeAll, afterAll } from "@jest/globals"
import { Role, User } from "../../src/components/user"
import { Category, Product } from "../../src/components/product"
import { Cart, ProductInCart } from "../../src/components/cart"
import { ProductNotFoundError, ProductAlreadyExistsError, ProductSoldError, EmptyProductStockError, LowProductStockError, UncorrectGroupingCategoryModelFilter } from "../../src/errors/productError"
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError } from "../../src/errors/cartError"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import ProductDAO from "../../src/dao/productDAO"
import CartDAO from "../../src/dao/cartDAO"
import UserDAO from "../../src/dao/userDAO"

jest.mock("../../src/db/db.ts")

const cartDAO = new CartDAO()

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods to simulate the hashing of the password
//It then calls the createUser method and expects it to resolve true

afterEach(() => {
    jest.restoreAllMocks();
});


describe("Cart DAO methods unit tests", () => {

    describe("Add a product instance", () => {
        
        test("Add a product instance", async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P004', arrivalDate: '2023-04-05', quantity: 4, sellingPrice: 699.99, details: 'Apple Watch', category: 'Appliance' } as any)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, paid: 0, paymentDate: null, total: 4799.94, username: 'paoloCagliero' } as any)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, null)
                return {} as Database
            });

            jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
                callback(null)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null)
                return {} as Database
            });
    
            // Chiamata al metodo da testare
            const result = await cartDAO.addToCart(new User('paoloCagliero', 'Paolo', 'Cagliero', Role.CUSTOMER, 'address', 'birthdate'), 'P004'); 
        
            // Asserzioni
            expect(result).toBe(true);
            
        })


        test("Add a product instance - there is already at least one instance of the product in the cart", async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P001', arrivalDate: '2023-01-10', quantity: 1, sellingPrice: 699.99, details: 'Galaxy S21', category: 'Smartphone' } as any)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, paid: 0, paymentDate: null, total: 4799.94, username: 'paoloCagliero' } as any)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, model: 'P001', quantity: 1, category: 'Smartphone', sellingPrice: 699.99 })
                return {} as Database
            });

            jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
                callback(null)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null)
                return {} as Database
            });
    
            // Chiamata al metodo da testare
            const result = await cartDAO.addToCart(new User('paoloCagliero', 'Paolo', 'Cagliero', Role.CUSTOMER, 'address', 'birthdate'), 'P001'); 
        
            // Asserzioni
            expect(result).toBe(true);
            
        })


        test("Add a product instance - there is no information about the current unpaid cart of the user", async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P001', arrivalDate: '2023-01-10', quantity: 1, sellingPrice: 699.99, details: 'Galaxy S21', category: 'Smartphone' } as any)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, null)
                return {} as Database
            });

            jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
                callback(null)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null)
                return {} as Database
            });
    
            // Chiamata al metodo da testare
            const result = await cartDAO.addToCart(new User('robertoCandela', 'Roberto', 'Candela', Role.CUSTOMER, 'address', 'birthdate'), 'P001'); 
        
            // Asserzioni
            expect(result).toBe(true);
            
        })

        test("Add a product instance - model does not represent an existing product", async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, null)
                return {} as Database
            });
    
            // Chiamata al metodo da testare
            await expect(cartDAO.addToCart(new User('paoloCagliero', 'Paolo', 'Cagliero', Role.CUSTOMER, 'address', 'birthdate'), 'P006')).rejects.toThrow(ProductNotFoundError);
            
        })


        test('Add a product instance - model represents a product whose available quantity is 0', async () => {
            
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P005', arrivalDate: '2023-05-10', quantity: 0, sellingPrice: 499.99, details: 'Televisore 4K UHD da 55 pollici Bravia X90J', category: 'Appliance' } as any)
                return {} as Database
            });

          
            await expect(cartDAO.addToCart(new User('paoloCagliero', 'Paolo', 'Cagliero', Role.CUSTOMER, 'address', 'birthdate'), 'P005')).rejects.toThrow(EmptyProductStockError);
          });
    }) 
    
    
    describe("Get current cart of the logged in user", () => {
        
        test('Get current cart of the logged in user', async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, paid: 0, paymentDate: null, total: 4799.94, username: 'paoloCagliero' } as any)
                return {} as Database
            });

            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                callback(null, 
                    [ 
                    {id: 1, model: 'P001', quantity: 1, category: 'Smartphone', sellingPrice: 699.99 }, 
                    {id: 1, model: 'P002', quantity: 1, category: 'Laptop', sellingPrice: 999.99 },
                    {id: 1, model: 'P003', quantity: 3, category: 'Appliance', sellingPrice: 799.99 }
                    ] as any
                )
                return {} as Database
            });

            const productsInCart = [
                new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
              ];
            const expected = new Cart('paoloCagliero', false, null, 4799.94, productsInCart);
            // Chiamata al metodo da testare
            const result = await cartDAO.getCart('paoloCagliero');
        
            // Asserzioni
            expect(result).toEqual(expected);

        });
        
        
        test('Get current cart of the logged in user - there is no information about an unpaid cart', async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, null)
                return {} as Database
            });

            const expected = new Cart('robertoCandela', false, null, 0, []);
            // Chiamata al metodo da testare
            const result = await cartDAO.getCart('robertoCandela');
        
            // Asserzioni
            expect(result).toEqual(expected);
          
        });
        
    })  


    describe("Payment for the current cart of the logged in user", () => {
        
        test('Payment for the current cart of the logged in user', async () => {
            
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, paid: 0, paymentDate: null, total: 4799.94, username: 'paoloCagliero' } as any)
                return {} as Database
            })
            .mockImplementation((sql, params, callback) => {
                callback(null, { quantity: 100 } as any)
                return {} as Database
            });

            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                callback(null, 
                    [ 
                    {id: 1, model: 'P001', quantity: 1, category: 'Smartphone', sellingPrice: 699.99 }, 
                    {id: 1, model: 'P002', quantity: 1, category: 'Laptop', sellingPrice: 999.99 },
                    {id: 1, model: 'P003', quantity: 3, category: 'Appliance', sellingPrice: 799.99 }
                    ] as any
                )
                return {} as Database
            });

            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null)
                return {} as Database
            });

            const result = await cartDAO.checkoutCart('paoloCagliero');

            expect(result).toBe(true);
            
        });
        
        
        test('Payment for the current cart of the logged in user - there is no information about an unpaid cart in the database', async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, null)
                return {} as Database
            })
            
            await expect(cartDAO.checkoutCart('robertoCandela')).rejects.toThrow(CartNotFoundError);
        });
    
        
        test('Payment for the current cart of the logged in user - there is information about an unpaid cart but the cart contains no product', async () => {

            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 2, paid: 0, paymentDate: null, total: 0, username: 'anitaAscheri' } as any)
                return {} as Database
            });

            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                callback(null, [])
                return {} as Database
            });
            
            await expect(cartDAO.checkoutCart('anitaAscheri')).rejects.toThrow(EmptyCartError);
        });
    
        test('Payment for the current cart of the logged in user - there is at least one product in the cart whose available quantity in the stock is 0', async () => {
            
            jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 3, paid: 0, paymentDate: null, total: 499.99, username: 'giorgioBongiovanni' } as any)
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { quantity: 0 } as any )
                return {} as Database
            })
            ;

            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                callback(null, 
                    [ 
                    {id: 3, model: 'P005', quantity: 1, category: 'Appliance', sellingPrice: 499.99 }
                    ] as any
                )
                return {} as Database
            });
            

            await expect(cartDAO.checkoutCart('giorgioBongiovanni')).rejects.toThrow(LowProductStockError);
        });
    })  


    describe("Get the history of the carts that have been paid for by the current user", () => {
        
        test('Get the history of the carts that have been paid for by the current user', async () => {

            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                callback(null, [
                    { id: 4, paid: 1, paymentDate: '2024-06-05', total: 4799.94, username: 'paoloCagliero' } as any
                ]);
             
                return {} as Database;
            });
    
            // Mocking getProductsInCart method
            jest.spyOn(cartDAO, "getProductsInCart").mockImplementation((cartId) => {
                const productsInCart = [
                    new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                    new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                    new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
                ];

                return Promise.resolve(productsInCart);
            });
    
            const result = await cartDAO.getCustomerCarts('paoloCagliero');
    
            const productsInCart = [
                new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
            ];
          
            const expected = [
                new Cart("paoloCagliero", true, "2024-06-05", 4799.94, productsInCart)
            ];
            
            expect(result).toEqual(expected);
               
        });
        
        
        test('Get the history of the carts that have been paid for by the current user - the user has no carts', async () => {
            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                callback(null, []); 
                return {} as Database;
            });
    
            const result = await cartDAO.getCustomerCarts('robertoCandela');
            expect(result).toEqual([]);
        });
    }) 


    describe("Delete an instance of a product from the current cart of the logged in user", () => {
        
        test('Delete an instance of a product from the current cart of the logged in user - quantity is equal to 1', async () => {

            jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P001', arrivalDate: '2023-01-10', quantity: 1, sellingPrice: 699.99, details: 'Galaxy S21', category: 'Smartphone' });
                return {} as Database;
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, paid: 0, paymentDate: null, total: 4799.94, username: 'paoloCagliero' });
                return {} as Database;
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, model: 'P001', quantity: 1, category: 'Smartphone', sellingPrice: 699.99 });
                return {} as Database;
            });

            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as Database;
            });

            const result = await cartDAO.removeProductFromCart("paoloCagliero", 'P001');

            expect(result).toBe(true);

        });
        
        test('Delete an instance of a product from the current cart of the logged in user - quantity is greater than 1', async () => {

            jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P001', arrivalDate: '2023-01-10', quantity: 1, sellingPrice: 699.99, details: 'Galaxy S21', category: 'Smartphone' });
                return {} as Database;
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, paid: 0, paymentDate: null, total: 4799.94, username: 'paoloCagliero' });
                return {} as Database;
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, model: 'P001', quantity: 2, category: 'Smartphone', sellingPrice: 699.99 });
                return {} as Database;
            });

            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as Database;
            });

            const result = await cartDAO.removeProductFromCart("paoloCagliero", 'P001');

            expect(result).toBe(true);
           

        });
    
    
        test('Delete an instance of a product from the current cart of the logged in user - model represents a product that is not in the cart', async () => {
            
            jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P001', arrivalDate: '2023-01-10', quantity: 1, sellingPrice: 699.99, details: 'Galaxy S21', category: 'Smartphone' });
                return {} as Database;
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { id: 1, paid: 0, paymentDate: null, total: 4799.94, username: 'paoloCagliero' });
                return {} as Database;
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, null);
                return {} as Database;
            });

            await expect(cartDAO.removeProductFromCart('paoloCagliero', 'P004')).rejects.toThrow(ProductNotInCartError);
        });
    
    
        test('Delete an instance of a product from the current cart of the logged in user - there is no information about an unpaid cart for the user', async () => {

            jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P001', arrivalDate: '2023-01-10', quantity: 1, sellingPrice: 699.99, details: 'Galaxy S21', category: 'Smartphone' });
                return {} as Database;
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, null);
                return {} as Database;
            })

            await expect(cartDAO.removeProductFromCart('robertoCandela', 'P001')).rejects.toThrow(CartNotFoundError);
        });
    
    
        test('Delete an instance of a product from the current cart of the logged in user - model does not represent an existing product', async () => {
            
            jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, null);
                return {} as Database;
            })

            await expect(cartDAO.removeProductFromCart('paoloCagliero', 'P006')).rejects.toThrow(ProductNotFoundError);
        });
        
    }) 


    describe("Delete the current cart", () => {
        
        test('Delete the current cart', async () => {

            jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: 'P001', arrivalDate: '2023-01-10', quantity: 1, sellingPrice: 699.99, details: 'Galaxy S21', category: 'Smartphone' });
                return {} as Database;
            });

            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as Database;
            });
            
            const result = await cartDAO.clearCart('paoloCagliero');
          
            expect(result).toBe(true);
        
        });
        
        
        test('Delete the current cart - there is no information about an unpaid cart for the user', async () => {

            jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, null);
                return {} as Database;
            });
            
            await expect(cartDAO.clearCart('robertoCandela')).rejects.toThrow(CartNotFoundError);
        });
        
    }) 


    describe("Delete all existing carts of all users", () => {
        
        test('Delete all existing carts of all users', async () => {

            jest.spyOn(db, "run")
            .mockImplementation((sql, callback) => {
                callback(null)
                return {} as Database
            })
            ;
    
            const result = await cartDAO.deleteAllCarts();
          
            expect(result).toBe(true);
            
          });
        
    }) 

    
    describe("Get all carts of all users", () => {
        
        test('Get all carts of all users', async () => {

            jest.spyOn(db, "all")
            .mockImplementationOnce((sql, callback) => {
                callback(null, [
                    { id: 1, paid: 0, paymentDate: null, total: 4799.94, username: 'paoloCagliero' },
                    { id: 2, paid: 0, paymentDate: null, total: 0, username: 'anitaAscheri' },
                    { id: 3, paid: 0, paymentDate: null, total: 499.99, username: 'giorgioBongiovanni' },
                    { id: 4, paid: 1, paymentDate: '2024-06-05', total: 4799.94, username: 'paoloCagliero' }
                ]);
                return {} as Database;
            });

            // Mocking getProductsInCart method
            jest.spyOn(cartDAO, "getProductsInCart").mockImplementationOnce((cartId) => {
                const productsInCart = [
                    new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                    new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                    new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
                ];

                return Promise.resolve(productsInCart);
            })
            .mockImplementationOnce((cartId) => {
                const productsInCart: ProductInCart[]  = [];

                return Promise.resolve(productsInCart);
            })
            .mockImplementationOnce((cartId) => {
                const productsInCart = [
                    new ProductInCart('P005', 1, Category.APPLIANCE, 499.99)
                ];

                return Promise.resolve(productsInCart);
            })
            .mockImplementationOnce((cartId) => {
                const productsInCart = [
                    new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
                    new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
                    new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
                ];

                return Promise.resolve(productsInCart);
            });
            

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
              new Cart("anitaAscheri", false, null, 0, []),
              new Cart("giorgioBongiovanni", false, null, 499.99, productsInCartGiorgio),
              new Cart("paoloCagliero", true, "2024-06-05", 4799.94, productsInCartPaolo)
            ]
        
            let carts = await cartDAO.getAllCarts();
        
            expect(carts).toEqual(expected);
        });
        
    }) 


    describe("Get products in cart", () => {
        
        test('Get products in cart', async () => {

            const id = 1;

            jest.spyOn(db, "all")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [
                    { id: 1, model: 'P001', quantity: 1, category: 'Smartphone', sellingPrice: 699.99 },
                    { id: 1, model: 'P002', quantity: 1, category: 'Laptop', sellingPrice: 999.99 },
                    { id: 1, model: 'P003', quantity: 3, category: 'Appliance', sellingPrice: 799.99 }
                ]);
                return {} as Database;
            });

            const expected = [
              new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
              new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
              new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
            ];
        
            let productsInCart = await cartDAO.getProductsInCart(id);
        
            expect(productsInCart).toEqual(expected);
        });


        test('Get products in cart - empty cart', async () => {

            const id = 1;

            jest.spyOn(db, "all")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, []);
                return {} as Database;
            });

            const expected: ProductInCart[] = [];
        
            let productsInCart = await cartDAO.getProductsInCart(id);
        
            expect(productsInCart).toEqual(expected);
        });
        
    }) 

})   

















