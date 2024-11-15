import db from '../db/db'
import { Product, Category } from '../components/product'
import { ProductNotFoundError, ProductAlreadyExistsError, ProductSoldError, EmptyProductStockError, LowProductStockError, UncorrectGroupingCategoryModelFilter } from '../errors/productError'
import { Utility, DateError } from '../utilities'
import dayjs from 'dayjs'

function mapRowToProduct(row: any): Product {
    return new Product(row.sellingPrice, row.model, row.category as Category, row.arrivalDate, row.details, row.quantity);
}

function mapRowsToProducts(rows: any[]): Product[] {
    return rows.map(row => new Product(row.sellingPrice, row.model, row.category as Category, row.arrivalDate, row.details, row.quantity));
}

/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {

    addProduct(product: Product): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const query = 'INSERT INTO product (model, category, quantity, details, sellingPrice, arrivalDate) VALUES(?, ?, ?, ?, ?, ?)'; 
                
            db.run(query, [product.model, product.category, product.quantity, product.details, product.sellingPrice, product.arrivalDate], function (err: Error | null) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new ProductAlreadyExistsError());
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve();
                }
            });
        });
    }


    increaseQuantity(model: string, newQuantity: number): Promise<void> {

        return new Promise<void>((resolve, reject) => {
            const query = 'UPDATE product SET quantity = quantity + ? WHERE model = ?';

            db.run(query, [newQuantity, model], function (err: Error | null) {
                if (err) {
                    reject(err);
                }
                else if (this.changes !== 1) {
                    reject(new ProductNotFoundError());
                } 
                else {

                    resolve();
                }
            });
        });

    }


    getProduct(model: string): Promise<Product> {

        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM product WHERE model = ?';
            db.get(query, [model], (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                }
                else if (!row) {
                    reject(new ProductNotFoundError());
                } 
                else {
                    resolve(mapRowToProduct(row));
                }
            });
        });
    }


    getProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            let query: string;

            if (!grouping && (category || model)) reject(new UncorrectGroupingCategoryModelFilter());
            else if (grouping === 'category' && (!category || model)) reject(new UncorrectGroupingCategoryModelFilter());
            else if (grouping === 'model' && (category || !model)) reject(new UncorrectGroupingCategoryModelFilter());

            // Se un query parameter non viene passato, avrà come valore undefined
            else if (!grouping && !category && !model) {
                query = 'SELECT * FROM product';
                db.all(query, [], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err);
                    } 
                    else {
                        const products = mapRowsToProducts(rows);
    
                        resolve(products);
                    }
                });
            }
            
            else if (grouping === 'category' && category && !model) {
                query = 'SELECT * FROM product WHERE category = ?';
                db.all(query, [category], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err);
                    } 
                    else {
                        const products = mapRowsToProducts(rows);
    
                        resolve(products);
                    }
                });
            }
            else if (grouping === 'model' && !category && model) {
                query = 'SELECT * FROM product WHERE model = ?';
                db.all(query, [model], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err);
                    } 
                    else {
                        if (rows.length === 0) {
                            reject(new ProductNotFoundError());
                            return
                        }
                        const products = mapRowsToProducts(rows);
    
                        resolve(products);
                    }
                });
            }
            
        });
    }


    getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            let query: string;

            if (!grouping && (category || model)) reject(new UncorrectGroupingCategoryModelFilter());
            else if (grouping === 'category' && (!category || model)) reject(new UncorrectGroupingCategoryModelFilter());
            else if (grouping === 'model' && (category || !model)) reject(new UncorrectGroupingCategoryModelFilter());
            else if (grouping && category && model) reject(new UncorrectGroupingCategoryModelFilter());
            // Se un query parameter non viene passato, avrà come valore undefined
            else if (!grouping && !category && !model) {
                query = 'SELECT * FROM product WHERE quantity > 0';
                db.all(query, [], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err);
                    } 
                    else {
                        const products = mapRowsToProducts(rows);
    
                        resolve(products);
                    }
                });
            }
            
            else if (grouping === 'category' && category && !model) {
                query = 'SELECT * FROM product WHERE category = ? AND quantity > 0';
                db.all(query, [category], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err);
                    } 
                    else {
                        const products = mapRowsToProducts(rows);
    
                        resolve(products);
                    }
                });
            }
            else if (grouping === 'model' && !category && model) {
                query = 'SELECT * FROM product WHERE model = ? AND quantity > 0';
                db.all(query, [model], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err);
                    } 
                    else {
                        const products = mapRowsToProducts(rows);
    
                        resolve(products);
                    }
                });
            }
            
        });
    }


    deleteProduct(model: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            const query = 'DELETE FROM product WHERE model = ?';
            db.run(query, [model], function (err: Error | null) {
                if (err) {
                    reject(err);
                } 
                // Se this.changes = 0 significa che non è stata eliminata nessun tupla perchè non è stata trovata
                else
                if (this.changes === 0) reject(new ProductNotFoundError());
                else resolve(true);
            });
        });
    };


    deleteProducts(): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            const query = 'DELETE FROM product';
            db.run(query, [], function (err: Error | null) {
                if (err) {
                    reject(err);
                } 
                // Se this.changes = 0 significa che non è stata eliminata nessun tupla perchè non è stata trovata
                else {
                    resolve(this.changes > 0 ? true : false);
                }
            });
        });
    };



}

export default ProductDAO