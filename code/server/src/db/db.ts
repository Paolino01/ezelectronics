"use strict"

/**
 * Example of a database connection if using SQLite3.
 */

import { Database } from "sqlite3";

const sqlite = require("sqlite3")

// The environment variable is used to determine which database to use.
// If the environment variable is not set, the development database is used.
// A separate database needs to be used for testing to avoid corrupting the development database and ensuring a clean state for each test.

//The environment variable is set in the package.json file in the test script.
let env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "development"

// The database file path is determined based on the environment variable.
let dbFilePath = env === "test" ? "./src/db/testdb.db" : "./src/db/db.db"
/* Per usare il database di test testdb.db sostituisco la precedente riga con le seguenti 2 righe: */

// The database is created and the foreign keys are enabled.
const db: Database = new sqlite.Database(dbFilePath, (err: Error | null) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})

export default db;