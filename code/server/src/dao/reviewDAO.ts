import db from "../db/db";
import { User } from "../components/user";
import { ProductReview } from "../components/review";
import {
  ExistingReviewError,
  NoReviewProductError,
} from "../errors/reviewError";
import {
  ProductNotFoundError,
  ProductAlreadyExistsError,
  ProductSoldError,
  EmptyProductStockError,
  LowProductStockError,
  UncorrectGroupingCategoryModelFilter,
} from "../errors/productError";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */



class ReviewDAO {
  addReview(review: ProductReview): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const query =
        "INSERT INTO review (user, model, score, date, comment) VALUES(?, ?, ?, ?, ?)";

      db.run(
        query,
        [review.user, review.model, review.score, review.date, review.comment],
        function (err: Error | null) {
          if (err) {
            // Se tento di inserire una review nella tabella review che ha una coppia user, model già presente in un altra tupla
            // viene lanciato questo errore.
            if (err.message.includes("UNIQUE constraint failed")) {
              reject(new ExistingReviewError());
            }
            // model è una chiave esterna che punta all'attributo model della tabella product pertanto
            // se tento di inserire una review nella tabella review che ha una chiave esterna model che non punta
            // a nessuna tupla della tabella product viene lanciato questo errore.
            else if (err.message.includes("FOREIGN KEY constraint failed")) {
              reject(new ProductNotFoundError());
            } else {
              reject(err);
            }
          } else {
            resolve();
          }
        }
      );
    });
  }

  getProductReviews(model: string): Promise<ProductReview[]> {
    return new Promise<ProductReview[]>((resolve, reject) => {
      try {
        const query = 'SELECT * FROM product WHERE model = ?';
        db.get(query, [model], (err: Error | null, row: any) => {
            if (err) {
                reject(err);
            }
            else if (!row) {
                reject(new ProductNotFoundError());
            }
        });
        
        let sql = "SELECT * FROM review WHERE model = ?";
        db.all(sql, [model], (err: Error | null, rows: any) => {
          if (err) {
            reject(err);
          }

          const reviews = rows.map((r: any) => {
            return new ProductReview(
              r.model,
              r.user,
              r.score,
              r.date,
              r.comment
            );
          });
          resolve(reviews);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteReview(model: string, user: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const query = "DELETE FROM review WHERE model = ? AND user = ?";
      db.run(query, [model, user], function (err: Error | null) {
        if (err) {
          reject(err);
        }
        // Se this.changes = 0 significa che non è stata eliminata nessun tupla perchè non è stata trovata
        else if (this.changes === 0) reject(new NoReviewProductError());
        else resolve();
      });
    });
  }

  deleteReviewsOfProduct(model: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const query = "DELETE FROM review WHERE model = ?";
      db.run(query, [model], function (err: Error | null) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new NoReviewProductError());
        } else {
          resolve();
        }
      });
    });
  }

  deleteAllReviews(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        let sql = "DELETE FROM review";
        db.run(sql, [], (err: Error | null) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default ReviewDAO;
