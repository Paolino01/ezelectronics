import { ProductReview } from "../components/review";
import { User } from "../components/user";
import ReviewDAO from "../dao/reviewDAO";
import dayjs from "dayjs";
import ProductDAO from "../dao/productDAO";

class ReviewController {
  private dao: ReviewDAO;
  private productDao: ProductDAO;

  constructor() {
    this.dao = new ReviewDAO();
    this.productDao = new ProductDAO();
  }

  /**
   * Adds a new review for a product
   * @param model The model of the product to review
   * @param user The username of the user who made the review
   * @param score The score assigned to the product, in the range [1, 5]
   * @param comment The comment made by the user
   * @returns A Promise that resolves to nothing
   */
  async addReview(
    model: string,
    user: User,
    score: number,
    comment: string
  ): Promise<void> {
    const review = new ProductReview(
      model,
      user.username,
      score,
      dayjs().format("YYYY-MM-DD"),
      comment
    );
    return this.dao.addReview(review);
  }

  /**
   * Returns all reviews for a product
   * @param model The model of the product to get reviews from
   * @returns A Promise that resolves to an array of ProductReview objects
   */
  async getProductReviews(model: string): Promise<ProductReview[]> {
    return this.dao.getProductReviews(model);
  }

  /**
   * Deletes the review made by a user for a product
   * @param model The model of the product to delete the review from
   * @param user The user who made the review to delete
   * @returns A Promise that resolves to nothing
   */
  async deleteReview(model: string, user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      (async () => {
        try {
          const product = await this.productDao.getProduct(model);
          await this.dao.deleteReview(model, user.username);
          resolve();
        } catch (error) {
          reject(error);
        }
      })(); // questa funzione async viene chiamata subito dopo essere stata definita.
      // Questo trucco mi serve per avere a disposizione una funzione async all'interno della quale poter usare la await.
    });
  }

  /**
   * Deletes all reviews for a product
   * @param model The model of the product to delete the reviews from
   * @returns A Promise that resolves to nothing
   */
  async deleteReviewsOfProduct(model: string): Promise<void> {
    // return new Promise<void>((resolve, reject) => {
    //     (async () => {
    //         try {
    //           const product = await this.productDao.getProduct(model);
    //           await this.dao.deleteReviewsOfProduct(model);
    //           resolve();
    //         }
    //         catch (error) {
    //           reject(error);
    //         }
    //     })(); // questa funzione async viene chiamata subito dopo essere stata definita.
    //     // Questo trucco mi serve per avere a disposizione una funzione async all'interno della quale poter usare la await.

    // });

    return this.dao.deleteReviewsOfProduct(model);
  }

  /**
   * Deletes all reviews of all products
   * @returns A Promise that resolves to nothing
   */
  async deleteAllReviews(): Promise<void> {
    return this.dao.deleteAllReviews();
  }
}

export default ReviewController;
