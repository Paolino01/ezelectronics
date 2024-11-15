import { test, expect, jest, describe, beforeEach, afterEach, beforeAll, afterAll, it } from "@jest/globals"
import { Role, User } from "../../src/components/user"
import { Category, Product } from "../../src/components/product"
import { Cart, ProductInCart } from "../../src/components/cart"
import { ProductNotFoundError, ProductAlreadyExistsError, ProductSoldError, EmptyProductStockError, LowProductStockError, UncorrectGroupingCategoryModelFilter } from "../../src/errors/productError"
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError } from "../../src/errors/cartError"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import ProductDAO from "../../src/dao/productDAO"
import ReviewDAO from "../../src/dao/reviewDAO"
import { ExistingReviewError, NoReviewProductError} from "../../src/errors/reviewError";

describe('reviewDAO', () => {

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
  
    const reviewDAO = new ReviewDAO();
    // const productDAO = new ProductDAO();
  
    beforeEach(() => {
      db.exec(initializationScript);
      
    });
  
    afterEach(() => {
      db.exec(initializationScriptAfterEach);
      
    });

    const sampleReview1 = {
        model: 'P001',
        user: 'robertoCandela',
        score: 5,
        date: '2024-06-15',
        comment: 'Great product!',
      };
      const sampleReview2 = {
        model: 'P001',
        user: 'anitaAscheri',
        score: 5,
        date: '2024-06-14',
        comment: 'Great!',
      };
    
      describe('addReview', () => {
        it('should add a new review', async () => {
          await reviewDAO.addReview(sampleReview1)

          // Controlla che la recensione sia stata aggiunta correttamente nel database
          const reviews = await reviewDAO.getProductReviews('P001');

          expect(reviews).toHaveLength(1);
          expect(reviews[0]).toMatchObject(sampleReview1);
          await reviewDAO.deleteReview(sampleReview1.model,sampleReview1.user);
        });
    
        it('should reject adding duplicate review', async () => {
          await reviewDAO.addReview(sampleReview1); // Aggiunge la recensione una prima volta
    
          // Tentativo di aggiungere la stessa recensione di nuovo
          await expect(reviewDAO.addReview(sampleReview1)).rejects.toThrow(ExistingReviewError);
          await reviewDAO.deleteReview(sampleReview1.model,sampleReview1.user);
        });
    
        it('should reject adding review for non-existing product', async () => {
          const invalidReview = { ...sampleReview1, model: 'NonExistingModel' };
    
          // Tentativo di aggiungere una recensione per un prodotto non esistente
          await expect(reviewDAO.addReview(invalidReview)).rejects.toThrow(ProductNotFoundError);
        });
      });
    
      describe('getProductReviews', () => {
        beforeEach(async () => {
          // Aggiungi alcune recensioni di esempio nel database
          await reviewDAO.addReview(sampleReview1);
          await reviewDAO.addReview(sampleReview2);
        });
        afterEach(async () => {
          await reviewDAO.deleteReview(sampleReview1.model,sampleReview1.user);
          await reviewDAO.deleteReview(sampleReview2.model,sampleReview2.user);
        });
    
        it('should get reviews for a product', async () => {
          const reviews = await reviewDAO.getProductReviews('P001');
          expect(reviews).toHaveLength(2);
          expect(reviews).toMatchObject([sampleReview1,sampleReview2]);
        });
    
        it('should return error for non-existing product', async () => {
          await expect(reviewDAO.getProductReviews('NonExistingModel')).rejects.toThrow(ProductNotFoundError)
        });
      });
    
      describe('deleteReview', () => {
        beforeEach(async () => {
          // Aggiungi una recensione di esempio nel database
          await reviewDAO.addReview(sampleReview1);
        });
    
        it('should delete a review', async () => {
          await expect(reviewDAO.deleteReview(sampleReview1.model, sampleReview1.user)).resolves.toBeUndefined();
    
          //Controlla che la recensione sia stata eliminata correttamente dal database
          const reviews = await reviewDAO.getProductReviews(sampleReview1.model);
          expect(reviews).toHaveLength(0);
        });
    
        it('should reject deleting non-existing review not existing model and suer', async () => {
          //Tentativo di eliminare una recensione che non esiste nel database
          await expect(reviewDAO.deleteReview('ModelNotExisting', 'testUser')).rejects.toThrow(NoReviewProductError);
        });
        it('should reject deleting non-existing review not existing user', async () => {
            //Tentativo di eliminare una recensione che non esiste nel database
            await expect(reviewDAO.deleteReview(sampleReview1.model, 'testUser')).rejects.toThrow(NoReviewProductError);
        });
        it('should reject deleting non-existing review not existing model', async () => {
            //Tentativo di eliminare una recensione che non esiste nel database
            await expect(reviewDAO.deleteReview('ModelNotExisting', sampleReview1.user)).rejects.toThrow(NoReviewProductError);
          });
      });
    
      describe('deleteReviewsOfProduct', () => {
        beforeEach(async () => {
          // Aggiungi alcune recensioni di esempio nel database
          await reviewDAO.addReview(sampleReview1);
          await reviewDAO.addReview(sampleReview2);
        });
    
        it('should delete all reviews of a product', async () => {
          await expect(reviewDAO.deleteReviewsOfProduct(sampleReview1.model)).resolves.toBeUndefined();
    
          // Controlla che tutte le recensioni per il prodotto siano state eliminate
          const reviews = await reviewDAO.getProductReviews(sampleReview1.model);
          expect(reviews).toHaveLength(0);
        });
      });
    
      describe('deleteAllReviews', () => {
        beforeEach(async () => {
          // Aggiungi alcune recensioni di esempio nel database
          await reviewDAO.addReview(sampleReview1);
          await reviewDAO.addReview(sampleReview2);
        });
    
        it('should delete all reviews', async () => {
          await expect(reviewDAO.deleteAllReviews()).resolves.toBeUndefined();
    
          // Controlla che tutte le recensioni nel database siano state eliminate
          const reviews = await reviewDAO.getProductReviews(sampleReview1.model);
          expect(reviews).toHaveLength(0);
        });
      });
    });
