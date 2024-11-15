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


describe('cartDAO', () => {

  const initializationScript = 
  `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;
    DELETE FROM users;


    INSERT INTO users (username, name, surname, role, password, salt) VALUES 
    ('paoloCagliero', 'Paolo', 'Cagliero', 'Customer', 'Cucumela22!', 'salt_value'),
    ('robertoCandela', 'Roberto', 'Candela', 'Customer', 'Cucumela22!', 'salt_value'),
    ('anitaAscheri', 'Anita', 'Ascheri', 'Customer', 'Cucumela22!', 'salt_value'),
    ('giorgioBongiovanni', 'Giorgio', 'Bongiovanni', 'Customer', 'Cucumela22!', 'salt_value');

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
    DELETE FROM users;
  `;

  const userDAO = new UserDAO();
  const cartDAO = new CartDAO();
  const productDAO = new ProductDAO();

  beforeEach(() => {
    db.exec(initializationScript);
    
  });

  afterEach(() => {
    db.exec(initializationScriptAfterEach);
    
  });


  test('Get current cart of the logged in user', async () => {
      const usernameTest = "paoloCagliero";
      const cart = await cartDAO.getCart(usernameTest);

      const productsInCart = [
        new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
        new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
        new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
      ];

      const expected = new Cart(usernameTest, false, null, 4799.94, productsInCart);
    
      expect(cart).toEqual(expected);
  });


  test('Get current cart of the logged in user - there is no information about an unpaid cart', async () => {
    const usernameTest = "robertoCandela";
    const cart = await cartDAO.getCart(usernameTest);

    const expected = new Cart(usernameTest, false, null, 0, []);
  
    expect(cart).toEqual(expected);
  });

  
  test('Get current cart of the logged in user - there is an unpaid cart with no products', async () => {
    const usernameTest = "anitaAscheri";
    const cart = await cartDAO.getCart(usernameTest);

    const expected = new Cart(usernameTest, false, null, 0, []);
  
    expect(cart).toEqual(expected);
  });


  test('Add a product instance', async () => {
    const usernameTest = "paoloCagliero";
    const userTest = await userDAO.getUserByUsername(usernameTest)
    const result = await cartDAO.addToCart(userTest, 'P004');
  
    expect(result).toBe(true);

    // Recupera il carrello attuale dell'utente
    const cart = await cartDAO.getCart(usernameTest);

    // Cerca il prodotto nel carrello
    const productInCart = cart.products.find(product => product.model === 'P004');
    expect(productInCart).toBeDefined();
    expect(cart.total).toBeCloseTo(5499.93, 2);

  });

  test('Add a product instance - there is already at least one instance of the product in the cart', async () => {
    const usernameTest = "paoloCagliero";
    const userTest = await userDAO.getUserByUsername(usernameTest)
    const result = await cartDAO.addToCart(userTest, 'P001');

    expect(result).toBe(true);

    // Recupera il carrello attuale dell'utente
    const cart = await cartDAO.getCart(usernameTest);

    // Cerca il prodotto nel carrello
    const productInCart = cart.products.find(product => product.model === 'P001');
    
    // Verifica che la quantità del prodotto sia aumentata di 1 (dovrebbe essere 2)
    expect(productInCart).toBeDefined();
    expect(productInCart.quantity).toBe(2);
    expect(cart.total).toBeCloseTo(5499.93, 2);
  });


  test('Add a product instance - there is no information about the current unpaid cart of the user', async () => {
    const usernameTest = "robertoCandela";
    const userTest = await userDAO.getUserByUsername(usernameTest)
    const result = await cartDAO.addToCart(userTest, 'P001');
  
    expect(result).toBe(true);

    const cart = await cartDAO.getCart(usernameTest);
    expect(cart).toBeDefined();
    const productInCart = cart.products.find(product => product.model === 'P001');
    expect(productInCart).toBeDefined();
    expect(cart.total).toBeCloseTo(699.99, 2);
  });


  test('Add a product instance - model does not represent an existing product', async () => {
    const usernameTest = "paoloCagliero";
    const userTest = await userDAO.getUserByUsername(usernameTest)
  
    await expect(cartDAO.addToCart(userTest, 'P006')).rejects.toThrow(ProductNotFoundError);
  });

  test('Add a product instance - model represents a product whose available quantity is 0', async () => {
    const usernameTest = "paoloCagliero";
    const userTest = await userDAO.getUserByUsername(usernameTest)
  
    await expect(cartDAO.addToCart(userTest, 'P005')).rejects.toThrow(EmptyProductStockError);
  });


  test('Payment for the current cart of the logged in user', async () => {
    const usernameTest = "paoloCagliero";
    
    const result = await cartDAO.checkoutCart(usernameTest);

    expect(result).toBe(true);

    let updatedProduct = await productDAO.getProduct('P001');
    expect(updatedProduct.quantity).toBe(0);
    updatedProduct = await productDAO.getProduct('P002');
    expect(updatedProduct.quantity).toBe(1);
    updatedProduct = await productDAO.getProduct('P003');
    expect(updatedProduct.quantity).toBe(0);
    
  });


  test('Payment for the current cart of the logged in user - there is no information about an unpaid cart in the database', async () => {
    const usernameTest = "robertoCandela";

    await expect(cartDAO.checkoutCart(usernameTest)).rejects.toThrow(CartNotFoundError);
  });

  
  test('Payment for the current cart of the logged in user - there is information about an unpaid cart but the cart contains no product', async () => {
    const usernameTest = "anitaAscheri";

    await expect(cartDAO.checkoutCart(usernameTest)).rejects.toThrow(EmptyCartError);
  });

  test('Payment for the current cart of the logged in user - there is at least one product in the cart whose available quantity in the stock is 0', async () => {
    const usernameTest = "giorgioBongiovanni";

    await expect(cartDAO.checkoutCart(usernameTest)).rejects.toThrow(LowProductStockError);
  });


  test('Get the history of the carts that have been paid for by the current user', async () => {
    const usernameTest = "paoloCagliero";
    const carts = await cartDAO.getCustomerCarts(usernameTest);

    const productsInCart = [
      new ProductInCart('P001', 1, Category.SMARTPHONE, 699.99), 
      new ProductInCart('P002', 1, Category.LAPTOP, 999.99), 
      new ProductInCart('P003', 3, Category.APPLIANCE, 799.99)
    ];

    const expected = [
      new Cart("paoloCagliero", true, "2024-06-05", 4799.94, productsInCart)
    ];
  
    expect(carts).toEqual(expected);
  });


  test('Get the history of the carts that have been paid for by the current user - the user has no carts', async () => {
    const usernameTest = "robertoCandela";
    const carts = await cartDAO.getCustomerCarts(usernameTest);
  
    expect(carts).toHaveLength(0);
  });
  

  test('Delete an instance of a product from the current cart of the logged in user - quantity is equal to 1', async () => {
    const usernameTest = "paoloCagliero";
    
    const result = await cartDAO.removeProductFromCart(usernameTest, 'P001')
  
    expect(result).toBe(true);

    const cartAfterDeletion = await cartDAO.getCart(usernameTest);
    const productStillPresentAfterDeletion = cartAfterDeletion.products.find(product => product.model === 'P001');
    expect(productStillPresentAfterDeletion).toBeUndefined();
  });


  test('Delete an instance of a product from the current cart of the logged in user - quantity is greater than 1', async () => {
    const usernameTest = "paoloCagliero";
    
    const result = await cartDAO.removeProductFromCart(usernameTest, 'P003')
  
    expect(result).toBe(true);
  });


  test('Delete an instance of a product from the current cart of the logged in user - model represents a product that is not in the cart', async () => {
    const usernameTest = "paoloCagliero";
  
    await expect(cartDAO.removeProductFromCart(usernameTest, 'P004')).rejects.toThrow(ProductNotInCartError);
  });


  test('Delete an instance of a product from the current cart of the logged in user - there is no information about an unpaid cart for the user', async () => {
    const usernameTest = "robertoCandela";
  
    await expect(cartDAO.removeProductFromCart(usernameTest, 'P001')).rejects.toThrow(CartNotFoundError);
  });


  test('Delete an instance of a product from the current cart of the logged in user - there are no products in the cart', async () => {
    const usernameTest = "anitaAscheri";
  
    await expect(cartDAO.removeProductFromCart(usernameTest, 'P001')).rejects.toThrow(ProductNotInCartError);
  });


  test('Delete an instance of a product from the current cart of the logged in user - model does not represent an existing product', async () => {
    const usernameTest = "paoloCagliero";
  
    await expect(cartDAO.removeProductFromCart(usernameTest, 'P006')).rejects.toThrow(ProductNotFoundError);
  });


  test('Delete the current cart', async () => {
    const usernameTest = "paoloCagliero";
    
    const result = await cartDAO.clearCart(usernameTest);
  
    expect(result).toBe(true);

    const cartAfterDeletion = await cartDAO.getCart(usernameTest);
    expect(cartAfterDeletion.total).toBe(0);
  });


  test('Delete the current cart - there is no information about an unpaid cart for the user', async () => {
    const usernameTest = "robertoCandela";
  
    await expect(cartDAO.clearCart(usernameTest)).rejects.toThrow(CartNotFoundError);
  });

  
  test('Get all carts of all users', async () => {

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

    let carts = await cartDAO.getAllCarts();

    expect(carts.length).toBe(expected.length);

    carts = carts.sort((e1, e2) => e1.customer.localeCompare(e2.customer));
    expected = expected.sort((e1, e2) => e1.customer.localeCompare(e2.customer));
    expect(carts).toEqual(expected);
  });


  test('Delete all existing carts of all users', async () => {
    
    const result = await cartDAO.deleteAllCarts();
  
    expect(result).toBe(true);

    const cartsAfterDeletion = await cartDAO.getAllCarts();
    expect(cartsAfterDeletion.length).toBe(0);
    
  });

  });