import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
} from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import db from "../../src/db/db";
import { Category, Product } from "../../src/components/product";
import { response } from "express";

const runExec = (sql: string) => {
  return new Promise<void>((resolve, reject) => {
    db.exec(sql, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const postUser = async (userInfo: any) => {
  await request(app).post(`/ezelectronics/users`).send(userInfo).expect(200);
};

//Helper function that logs in a user and returns the cookie
//Can be used to log in a user before the tests or in the tests
const login = async (userInfo: any) => {
  return new Promise<string>((resolve, reject) => {
    request(app)
      .post(`/ezelectronics/sessions`)
      .send(userInfo)
      .expect(200)
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.header["set-cookie"][0]);
      });
  });
};

const initializationScriptBeforeAll = `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;
    DELETE FROM users;
    `;

const initializationScriptBeforeAll2 = `
    INSERT INTO product (model, arrivalDate, quantity, sellingPrice, details, category) VALUES
    ('P001', '2023-01-10', 1, 699.99, 'Galaxy S21', 'Smartphone'),
    ('P002', '2023-02-20', 2, 999.99, 'Laptop 16GB RAM, 512GB SSD', 'Laptop'),
    ('P003', '2023-03-15', 3, 799.99, 'Fotocamera digitale EOS 200D', 'Appliance'),
    ('P004', '2023-04-05', 4, 699.99, 'Apple Watch', 'Appliance'),
    ('P005', '2023-05-10', 0, 499.99, 'Televisore 4K UHD da 55 pollici Bravia X90J', 'Appliance');`;

const initializationScriptAfterEach = `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;

  INSERT INTO product (model, arrivalDate, quantity, sellingPrice, details, category) VALUES
  ('P001', '2023-01-10', 1, 699.99, 'Galaxy S21', 'Smartphone'),
  ('P002', '2023-02-20', 2, 999.99, 'Laptop 16GB RAM, 512GB SSD', 'Laptop'),
  ('P003', '2023-03-15', 3, 799.99, 'Fotocamera digitale EOS 200D', 'Appliance'),
  ('P004', '2023-04-05', 4, 699.99, 'Apple Watch', 'Appliance'),
  ('P005', '2023-05-10', 0, 499.99, 'Televisore 4K UHD da 55 pollici Bravia X90J', 'Appliance');`;

const initializationScriptAfterAll = `
    DELETE FROM productInCart;
    DELETE FROM review;
    DELETE FROM cart;
    DELETE FROM product;
    DELETE FROM users;
  `;

const routePath = "/ezelectronics/reviews"; //Base route path for the API

const admin = {
  username: "admin",
  name: "admin",
  surname: "admin",
  password: "admin",
  role: "Admin",
};
const manager = {
  username: "manager",
  name: "manager",
  surname: "manager",
  password: "manager",
  role: "Manager",
};
const customer = {
  username: "customer",
  name: "customer",
  surname: "customer",
  password: "customer",
  role: "Customer",
};

let adminCookie: string;
let managerCookie: string;
let customerCookie: string;

beforeAll(() => {
  return runExec(initializationScriptBeforeAll)
    .then(() => postUser(admin))
    .then(() => login({ username: admin.username, password: admin.password }))
    .then((cookie) => {
      adminCookie = cookie;
      return postUser(manager);
    })
    .then(() =>
      login({ username: manager.username, password: manager.password })
    )
    .then((cookie) => {
      managerCookie = cookie;
      return postUser(customer);
    })
    .then(() =>
      login({ username: customer.username, password: customer.password })
    )
    .then((cookie) => {
      customerCookie = cookie;
      return runExec(initializationScriptBeforeAll2);
    });
});

afterAll(() => {
  db.exec(initializationScriptAfterAll);
});

describe("Review route integration tests", () => {
  describe("Insert review", () => {
    test("Insert new review", async () => {
      const sampleReview1 = {
        model: "P001",
        user: "robertoCandela",
        score: 5,
        date: "2024-06-15",
        comment: "Great product!",
      };

      const response = await request(app)
        .post(`${routePath}/${sampleReview1.model}`)
        .send(sampleReview1)
        .set("Cookie", customerCookie);

      expect(response.status).toBe(200);
    });
  });
  describe("Get a review", () => {
    test("Get a review", async () => {
      const sampleReview1 = {
        model: "P001",
        user: "robertoCandela",
        score: 5,
        date: "2024-06-15",
        comment: "Great product!",
      };

      const responseAddReview = await request(app)
        .post(`${routePath}/${sampleReview1.model}`)
        .send(sampleReview1)
        .set("Cookie", customerCookie);

      const responseGetReview = await request(app)
        .get(`${routePath}/${sampleReview1.model}`)
        .set("Cookie", customerCookie);

      expect(responseGetReview.status).toBe(200);
    });
  });
  describe("Delete a review", () => {
    test("Delete a review", async () => {
      const sampleReview1 = {
        model: "P001",
        user: "robertoCandela",
        score: 5,
        date: "2024-06-15",
        comment: "Great product!",
      };

      const responseAddReview = await request(app)
        .post(`${routePath}/${sampleReview1.model}`)
        .send(sampleReview1)
        .set("Cookie", customerCookie);

      const responseDeleteReview = await request(app)
        .delete(`${routePath}/${sampleReview1.model}`)
        .set("Cookie", customerCookie);

      expect(responseDeleteReview.status).toBe(200);
    });
  });

  describe("Delete all reviews for a product", () => {
    const sampleReview1 = {
      model: "P001",
      user: "robertoCandela",
      score: 5,
      date: "2024-06-15",
      comment: "Great product!",
    };
    const sampleReview2 = {
      model: "P001",
      user: "robertoCandela",
      score: 5,
      date: "2024-06-15",
      comment: "Great product!",
    };
    test("Delete all review for a product adminCookie", async () => {
      const responseAddReview = await request(app)
        .post(`${routePath}/${sampleReview1.model}`)
        .send(sampleReview1)
        .set("Cookie", customerCookie);
      const responseAddReview2 = await request(app)
        .post(`${routePath}/${sampleReview2.model}`)
        .send(sampleReview2)
        .set("Cookie", customerCookie);

      const responseDeleteReview = await request(app)
        .delete(`${routePath}/${sampleReview1.model}/all`)
        .set("Cookie", adminCookie);

      expect(responseDeleteReview.status).toBe(200);
    });
    test("Delete all review for a product managerCookie", async () => {
      const responseAddReview = await request(app)
        .post(`${routePath}/${sampleReview1.model}`)
        .send(sampleReview1)
        .set("Cookie", customerCookie);
      const responseCustomerDeleteReview = await request(app)
        .delete(`${routePath}/${sampleReview1.model}/all`)
        .set("Cookie", managerCookie);

      expect(responseCustomerDeleteReview.status).toBe(200);
    });
    test("Delete all review for a product customerCookie", async () => {
      const responseAddReview = await request(app)
        .post(`${routePath}/${sampleReview1.model}`)
        .send(sampleReview1)
        .set("Cookie", customerCookie);
      const responseCustomerDeleteReview = await request(app)
        .delete(`${routePath}/${sampleReview1.model}/all`)
        .set("Cookie", customerCookie);

      expect(responseCustomerDeleteReview.status).toBe(401);
    });
  });
  describe("Delete all reviews", () => {
    const sampleReview1 = {
      model: "P001",
      user: "robertoCandela",
      score: 5,
      date: "2024-06-15",
      comment: "Great product!",
    };
    const sampleReview2 = {
      model: "P001",
      user: "robertoCandela",
      score: 5,
      date: "2024-06-15",
      comment: "Great product!",
    };
    test("Delete all review adminCookie", async () => {
      const responseAddReview = await request(app)
        .post(`${routePath}/${sampleReview1.model}`)
        .send(sampleReview1)
        .set("Cookie", customerCookie);
      const responseAddReview2 = await request(app)
        .post(`${routePath}/${sampleReview2.model}`)
        .send(sampleReview2)
        .set("Cookie", customerCookie);

      const responseDeleteReview = await request(app)
        .delete(`${routePath}/`)
        .set("Cookie", adminCookie);

      expect(responseDeleteReview.status).toBe(200);
    });
    test("Delete all review managerCookie", async () => {
      const responseCustomerDeleteReview = await request(app)
        .delete(`${routePath}/`)
        .set("Cookie", managerCookie);

      expect(responseCustomerDeleteReview.status).toBe(200);
    });
    test("Delete all review customerCookie", async () => {
      const responseCustomerDeleteReview = await request(app)
        .delete(`${routePath}/`)
        .set("Cookie", customerCookie);

      expect(responseCustomerDeleteReview.status).toBe(401);
    });
  });
});
