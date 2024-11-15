import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../errors/productError"
import db from "../db/db"
import { User } from "../components/user"
import { Cart, ProductInCart } from "../components/cart"
import { CartNotFoundError, EmptyCartError, ProductNotInCartError } from "../errors/cartError"

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {
    addToCart(user: User, product: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                var sql = "SELECT * FROM product WHERE model=?"
                db.get(sql, product, (err: Error | null, row: any) => {
                    if(err) {
                        reject(err)
                        return
                    }
                    if(!row) {
                        reject(new ProductNotFoundError())
                        return
                    }
                    if(row.quantity <= 0) {
                        reject(new EmptyProductStockError())
                        return
                    }
                    const sellingPrice = row.sellingPrice
                    const category = row.category
                    sql = "SELECT * FROM cart WHERE username=? AND paid=false"
                    db.get(sql, user.username, (err: Error | null, row: any) => {
                        if(err) {
                            reject(err)
                            return
                        }
                        if(!row) {          //L'utente non ha un carrello. Da testare se ROWID funziona
                            sql = "INSERT INTO cart (paid, paymentDate, total, username) VALUES (false, null, ?, ?)"
                            db.run(sql, [sellingPrice, user.username], (err: Error | null) => {
                                if(err) {
                                    reject(err)
                                    return
                                }
                                /**
                                 * TODO: check last_insert_rowid()
                                 */
                                sql = "INSERT INTO productInCart (model, quantity, category, sellingPrice, id) VALUES (?, 1, ?, ?, last_insert_rowid())"
                                db.run(sql, [product, category, sellingPrice], (err: Error | null) => {
                                    if(err) {
                                        reject(err)
                                        return
                                    }
                                    resolve(true)
                                })
                            })
                        }
                        else {
                            const id = row.id
                            sql = "SELECT * FROM productInCart WHERE model=? AND id=?"
                            db.get(sql, [product, id], (err: Error | null, row: any) => {
                                if(err) {
                                    reject(err)
                                    return
                                }
                                if(!row) {  //Il prodotto non è ancora nel carrello
                                    sql = "INSERT INTO productInCart (model, quantity, category, sellingPrice, id) VALUES (?, 1, ?, ?, ?)"
                                    db.run(sql, [product, category, sellingPrice, id], (err: Error | null) => {
                                        if(err) {
                                            reject(err)
                                            return
                                        }
                                        sql = "UPDATE cart SET total=total+? WHERE id=?"
                                        db.run(sql, [sellingPrice, id], (err: Error | null) => {
                                            if(err) {
                                                reject(err)
                                                return
                                            }
                                            resolve(true)
                                        })
                                    })
                                }
                                else {      //Il prodotto è già nel carrello
                                    sql = "UPDATE productInCart SET quantity=quantity+1 WHERE model=? AND id=?"
                                    db.run(sql, [product, id], (err: Error | null) => {
                                        if(err) {
                                            reject(err)
                                            return
                                        }
                                        sql = "UPDATE cart SET total=total+? WHERE id=?"
                                        db.run(sql, [sellingPrice, id], (err: Error | null) => {
                                            if(err) {
                                                reject(err)
                                                return
                                            }
                                            resolve(true)
                                        })
                                    })
                                }
                            })
                        }
                    })
                })
            }
            catch(error) {
                reject(error)
            }
        })
    }

    getCart(username: string): Promise<Cart> {
        return new Promise<Cart>((resolve, reject) => {
            try {
                var sql = "SELECT * FROM cart WHERE username = ? AND paid = false"
                db.get(sql, username, (err: Error | null, row: any) => {
                    if(err) {
                        reject(err)
                        return
                    }
                    if(!row) {
                        resolve(new Cart(username, false, null, 0, []))
                    }
                    else {
                        const quantity = row.quantity
                        const id = row.id
                        const total = row.total
                        sql = "SELECT * FROM productInCart WHERE id = ?"
                        db.all(sql, id, (err: Error | null, rows: any) => {
                            const productsInCart = rows.map((p: any) => new ProductInCart(p.model, p.quantity, p.category, p.sellingPrice))
                            resolve(new Cart(username, false, null, total, productsInCart))
                        })
                    }
                })
            }
            catch(error) {
                reject(error)
            }
        })
    }

    checkoutCart(username: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                var sql = "SELECT * FROM cart WHERE username = ? AND paid = false"
                db.get(sql, username, (err: Error | null, row: any) => {
                    if(err) {
                        reject(err)
                        return
                    }
                    if(!row) {      //Controlla se il carrello esiste
                        reject(new CartNotFoundError())
                        return
                    }
                    const id = row.id
                    sql = "SELECT * FROM productInCart WHERE id = ?"
                    db.all(sql, id, async (err: Error | null, rows: any) => {
                        if(err) {
                            reject(err)
                            return
                        }
                        if(rows.length === 0) { //Controlla che nel carrello sia presente almeno un prodotto
                            reject(new EmptyCartError())
                            return
                        }
                        var error = false
                        for (var p of rows) {
                            await this.checkProductQuantity(p.model).then((q) => {if(q < p.quantity) { reject(new LowProductStockError()); error=true; return }}).catch((e) => { reject(e); return })
                            if(error) return
                        }
                        rows.forEach((p: any) => {        //Se tutti i controlli precedenti sono andati a buon fine, posso segnare il carrello come pagato. Vengono aggiornate le quantità dei prodotti e, successivamente, si imposta il carrello come pagato e la data di pagamento viene settata alla data odierna
                            sql = "UPDATE product SET quantity=quantity-? WHERE model=?"
                            db.run(sql, [p.quantity, p.model], (err: Error | null, row: any) => {
                                if(err) {
                                    reject(err)
                                    return
                                }
                            })
                        })
                        sql="UPDATE cart SET paid=true, paymentDate=DATE('now') WHERE id = ?"
                        db.run(sql, id, (err: Error | null, rows: any) => {
                            if(err) {
                                reject(err)
                                return
                            }
                            resolve(true)
                        })
                    })
                })
            }
            catch(error) {
                reject(error)
            }
        })
    }

    checkProductQuantity(model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "SELECT quantity FROM product WHERE model=?"
            db.get(sql, model, (err: Error | null, row: any) => {
                if(err) {
                    reject(err)
                    return
                }
                resolve(row.quantity)
            })
        })
    }
    getCustomerCarts(username: string): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            try {
                var sql = "SELECT * FROM cart WHERE username = ? AND paid = true"
                db.all(sql, username, async (err: Error | null, rows: any) => {
                    if(err) {
                        reject(err)
                        return
                    }
                    var carts: Cart[] = []
                    if(rows.length === 0) {             //If the user has no carts with paid = true, we return an empty list
                        resolve(carts)
                    }
                    else {
                        carts = await Promise.all(rows.map(async (c: any) => {
                            var productsInCart: ProductInCart[] = []
                            await this.getProductsInCart(c.id).then((p) => {
                                p.forEach((product) => {
                                    productsInCart.push(product)
                                })
                            }).catch((error: any) => {
                                reject(error)
                                return
                            })
                            return new Cart(username, true, c.paymentDate, c.total, productsInCart)
                        }))
                        resolve(carts)
                    }
                })
            }
            catch(error) {
                reject(error)
            }
        })
    }

    removeProductFromCart(username: string, product: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                var sql = "SELECT * FROM product WHERE model=?"
                db.get(sql, product, (err: Error | null, row: any) => {
                    if(err) {
                        reject(err)
                        return
                    }
                    if(!row) {
                        reject(new ProductNotFoundError())
                        return
                    }
                    const sellingPrice = row.sellingPrice
                    sql = "SELECT * FROM cart WHERE username=? AND paid=false"
                    db.get(sql, username, (err: Error | null, row: any) => {
                        if(err) {
                            reject(err)
                            return
                        }
                        if(!row) {          //L'utente non ha un carrello
                            reject(new CartNotFoundError())
                            return
                        }
                        else {
                            const id = row.id
                            sql = "SELECT * FROM productInCart WHERE model=? AND id=?"
                            db.get(sql, [product, id], (err: Error | null, row: any) => {
                                if(err) {
                                    reject(err)
                                    return
                                }
                                if(!row) {  //Il prodotto non è nel carrello
                                    reject(new ProductNotInCartError())
                                    return
                                }
                                else {      //Il prodotto è nel carrello
                                    if(row.quantity == 1) {     //Se il prodotto ha quantità 1, elimino l'intera riga dalla tabella productInCart
                                        sql = "DELETE FROM productInCart WHERE model=? AND id=?";
                                        db.run(sql, [product, id], (err: Error | null) => {
                                            if(err) {
                                                reject(err)
                                                return
                                            }
                                            sql = "UPDATE cart SET total=total-? WHERE id=?";
                                            db.run(sql, [sellingPrice, id], (err: Error | null) => {
                                                if(err) {
                                                    reject(err)
                                                    return
                                                }
                                                resolve(true)
                                            })
                                        })
                                    }
                                    else {
                                        sql = "UPDATE productInCart SET quantity=quantity-1 WHERE model=? AND id=?";
                                        db.run(sql, [product, id], (err: Error | null) => {
                                            if(err) {
                                                reject(err)
                                                return
                                            }
                                            sql = "UPDATE cart SET total=total-? WHERE id=?";
                                            db.run(sql, [sellingPrice, id], (err: Error | null) => {
                                                if(err) {
                                                    reject(err)
                                                    return
                                                }
                                                resolve(true)
                                            })
                                        })
                                    }
                                }
                            })
                        }
                    })
                })
            }
            catch(error) {
                reject(error)
            }
        })
    }

    clearCart(username: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                var sql = "SELECT * FROM cart WHERE username=? AND paid=false"
                db.get(sql, username, (err: Error | null, row: any) => {
                    if(err) {
                        reject(err)
                        return
                    }
                    if(!row) {          //L'utente non ha un carrello
                        reject(new CartNotFoundError())
                        return
                    }
                    else {
                        const id = row.id
                        sql = "DELETE FROM productInCart WHERE id=?"
                        db.run(sql, id, (err: Error | null) => {
                            if(err) {
                                reject(err)
                                return
                            }
                            sql = "UPDATE cart SET total=0 WHERE id=?"
                            db.run(sql, id, (err: Error | null) => {
                                if(err) {
                                    reject(err)
                                    return
                                }
                                resolve(true)
                            })
                        })
                    }
                })
            }
            catch(error) {
                reject(error)
            }
        })
    }

    deleteAllCarts(): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                let sql = "DELETE FROM productInCart"
                db.run(sql, (err: Error | null) => {
                    if(err) {
                        reject(err)
                        return
                    }
                    sql = "DELETE FROM cart"
                    db.run(sql, (err: Error | null) => {
                        if(err) {
                            reject(err)
                            return
                        }
                        resolve(true)
                    })
                })
            }
            catch(error) {
                reject(error)
            }
        })
    }

    getAllCarts(): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            try {
                var sql = "SELECT * FROM cart"
                db.all(sql, async (err: Error | null, rows: any) => {
                    if(err) {
                        reject(err)
                        return
                    }
                    var carts: Cart[] = []
                    if(rows.length === 0) {             //If the user has no carts, we return an empty list
                        resolve(carts)
                    }
                    else {
                        carts = await Promise.all(rows.map(async (c: any) => {
                            var productsInCart: ProductInCart[] = []
                            await this.getProductsInCart(c.id).then((p) => {
                                p.forEach((product) => {
                                    productsInCart.push(product)
                                })
                            }).catch((error: any) => {
                                reject(error)
                                return
                            })
                            return new Cart(c.username, c.paid === 1, c.paymentDate, c.total, productsInCart)
                        }))
                        resolve(carts)
                    }
                })
            }
            catch(error) {
                reject(error)
            }
        })
    }

    getProductsInCart(id: number): Promise<ProductInCart[]> {
        return new Promise<ProductInCart[]>((resolve, reject) => {
            var sql = "SELECT * FROM productInCart WHERE id = ?"
            var productsInCart: ProductInCart[] = []
            db.all(sql, id, (err: Error | null, rows: any) => {
                if(err) {
                    reject(err)
                    return
                }
                productsInCart = rows.map((p: any) => new ProductInCart(p.model, p.quantity, p.category, p.sellingPrice))
                resolve(productsInCart)
            })
        })
    }
}

export default CartDAO