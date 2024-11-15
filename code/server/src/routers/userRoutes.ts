import express, { Router } from "express"
import Authenticator from "./auth"
import { body, check, param, validationResult } from "express-validator"
import { Role, User } from "../components/user"
import ErrorHandler from "../helper"
import UserController from "../controllers/userController"
import { UnauthorizedUserError, UserNotAdminError } from "../errors/userError"
import { DateError } from "../utilities"

/**
 * Represents a class that defines the routes for handling users.
 */
class UserRoutes {
    private router: Router
    private authService: Authenticator
    private errorHandler: ErrorHandler
    private controller: UserController

    /**
     * Constructs a new instance of the UserRoutes class.
     * @param authenticator The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authService = authenticator
        this.router = express.Router()
        this.errorHandler = new ErrorHandler()
        this.controller = new UserController()
        this.initRoutes()
    }

    /**
     * Get the router instance.
     * @returns The router instance.
     */
    getRouter(): Router {
        return this.router
    }

    /**
     * Initializes the routes for the user router.
     * 
     * @remarks
     * This method sets up the HTTP routes for creating, retrieving, updating, and deleting user data.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     */
    initRoutes() {
        /**
         * Route for creating a user.
         * It does not require authentication.
         * It requires the following body parameters:
         * - username: string. It cannot be empty and it must be unique (an existing username cannot be used to create a new user)
         * - name: string. It cannot be empty.
         * - surname: string. It cannot be empty.
         * - password: string. It cannot be empty.
         * - role: string (one of "Manager", "Customer", "Admin")
         * It returns a 200 status code.
         */
        this.router.post(
            "/",
            [
                check("username").isString().trim().isLength({ min: 1}).withMessage("Username non valido"),
                check("name").isString().trim().isLength({ min: 1}).withMessage("Nome non valido"),
                check("surname").isString().trim().isLength({ min: 1}).withMessage("Cognome non valido"),
                check("password").isString().trim().isLength({ min: 1}).withMessage("Password non valida"),
                check("role").isString().isIn(["Customer", "Manager", "Admin"]).withMessage("Ruolo non valido")
            ],
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array()[0]["msg"] });
                }

                this.controller.createUser(req.body.username.trim(), req.body.name.trim(), req.body.surname.trim(), req.body.password.trim(), req.body.role.trim())
                .then(() => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
            }
        )

        /**
         * Route for retrieving all users.
         * It requires the user to be logged in and to be an admin.
         * It returns an array of users.
         */
        this.router.get(
            "/",
            (req: any, res: any, next: any) => this.authService.isLoggedIn(req, res, next),
            (req: any, res: any, next: any) => this.authService.isAdmin(req, res, next),
            (req: any, res: any, next: any) => this.controller.getUsers()
                .then((users: any /**User[] */) => res.status(200).json(users))
                .catch((err) => next(err))
        )

        /**
         * Route for retrieving all users of a specific role.
         * It requires the user to be logged in and to be an admin.
         * It expects the role of the users in the request parameters: the role must be one of ("Manager", "Customer", "Admin").
         * It returns an array of users.
         */
        this.router.get(
            "/roles/:role",
            [
                check("role").isString().isIn(["Customer", "Manager", "Admin"]).withMessage("Errore: ruolo non valido")
            ],
            (req: any, res: any, next: any) => this.authService.isLoggedIn(req, res, next),
            (req: any, res: any, next: any) => this.authService.isAdmin(req, res, next),
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array()[0]["msg"] });  //Prendo il campo "msg", che contiene il messaggio di errore
                }

                const user = req.user
                const role = req.params.role.trim()

                this.controller.getUsersByRole(role)
                .then((users: any /**User[] */) => res.status(200).json(users))
                .catch((err) => next(err))
            }
        )

        /**
         * Route for retrieving a user by its username.
         * It requires the user to be authenticated: users with an Admin role can retrieve data of any user, users with a different role can only retrieve their own data.
         * It expects the username of the user in the request parameters: the username must represent an existing user.
         * It returns the user.
         */
        this.router.get(
            "/:username",
            (req: any, res: any, next: any) => this.authService.isLoggedIn(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user
                const username = req.params.username.trim()

                if(user.role == Role.ADMIN || user.username == username) {
                    this.controller.getUserByUsername(username)
                    .then((user: any /**User */) => res.status(200).json(user))
                    .catch((err) => next(err))
                }
                else{
                    throw new UnauthorizedUserError()
                }
            }
        )

        /**
         * Route for deleting a user.
         * It requires the user to be authenticated: users with an Admin role can delete the data of any user (except other Admins), users with a different role can only delete their own data.
         * It expects the username of the user in the request parameters: the username must represent an existing user.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/:username",
            (req: any, res: any, next: any) => this.authService.isLoggedIn(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user
                const username = req.params.username.trim()
                
                if(user.role == Role.ADMIN || user.username == username) {
                    this.controller.deleteUser(username)
                    .then(() => res.status(200).end())
                    .catch((err: any) => next(err))
                }
                else{
                    throw new UnauthorizedUserError()
                }
            }
        )

        /**
         * Route for deleting all users.
         * It requires the user to be logged in and to be an admin.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/",
            (req: any, res: any, next: any) => this.authService.isLoggedIn(req, res, next),
            (req: any, res: any, next: any) => this.authService.isAdmin(req, res, next),
            (req: any, res: any, next: any) => {
                const user = req.user

                this.controller.deleteAll()
                .then(() => res.status(200).end())
                .catch((err: any) => next(err))
            }
        )

        /**
         * Route for updating the information of a user.
         * It requires the user to be authenticated.
         * It expects the username of the user to edit in the request parameters: if the user is not an Admin, the username must match the username of the logged in user. Admin users can edit other non-Admin users.
         * It requires the following body parameters:
         * - name: string. It cannot be empty.
         * - surname: string. It cannot be empty.
         * - address: string. It cannot be empty.
         * - birthdate: date. It cannot be empty, it must be a valid date in format YYYY-MM-DD, and it cannot be after the current date
         * It returns the updated user.
         */
        this.router.patch(
            "/:username",
            [
                check("username").isString().trim().isLength({ min: 1}).withMessage("Username non valido"),
                check("name").isString().trim().isLength({ min: 1}).withMessage("Nome non valido"),
                check("surname").isString().trim().isLength({ min: 1}).withMessage("Cognome non valido"),
                check("address").isString().trim().isLength({ min: 1}).withMessage("Indirizzo non valido"),
                check("birthdate").isString().trim().isLength({ min: 1}).withMessage("Data di nascita non valida"),
            ],
            (req: any, res: any, next: any) => this.authService.isLoggedIn(req, res, next),
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array()[0]["msg"] });
                }

                const user = req.user
                const username = req.params.username.trim()
                const name = req.body.name.trim()
                const surname = req.body.surname.trim()
                const address = req.body.address.trim()
                const birthdate = req.body.birthdate.trim()

                if(user.role == Role.ADMIN || user.username == username) {
                    if(birthdate != null) {
                        if(this.isValidDate(birthdate)) {
                            var q = new Date();
                            var m = q.getMonth()+1;
                            var d = q.getDay();
                            var y = q.getFullYear();
    
                            var currentDate = new Date(y,m,d);
                            var convertedBirthDate=new Date(birthdate);
    
                            if(convertedBirthDate <= currentDate) {
                                this.controller.updateUserInfo(user, name, surname, address, birthdate, username)
                                .then((user: any /**User */) => res.status(200).json(user))
                                .catch((err: any) => next(err))
                            }
                            else {
                                throw new DateError()
                            }
                        }
                        else {
                            res.status(422).json({error: "Errore: formato della data non corretto"})
                        }
                    }
                    else {
                        res.status(422).json({error: "Errore: parametri non validi"})
                    }
                }
                else {
                    throw new UnauthorizedUserError()
                }
            }
        )
    }

    //Check if the date is in format YYYY-MM-DD
    isValidDate(dateString: string) {
        if(dateString != null) {
            var regEx = /^\d{4}-\d{2}-\d{2}$/;
            if(!dateString.match(regEx)) return false;  // Invalid format
            var d = new Date(dateString);
            var dNum = d.getTime();
            if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
            return d.toISOString().slice(0,10) === dateString;
        }
        else {
            return false
        }
      }
}

/**
 * Represents a class that defines the authentication routes for the application.
 */
class AuthRoutes {
    private router: Router
    private errorHandler: ErrorHandler
    private authService: Authenticator

    /**
     * Constructs a new instance of the UserRoutes class.
     * @param authenticator - The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authService = authenticator
        this.errorHandler = new ErrorHandler()
        this.router = express.Router();
        this.initRoutes();
    }

    getRouter(): Router {
        return this.router
    }

    /**
     * Initializes the authentication routes.
     * 
     * @remarks
     * This method sets up the HTTP routes for login, logout, and retrieval of the logged in user.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     */
    initRoutes() {

        /**
         * Route for logging in a user.
         * It does not require authentication.
         * It expects the following parameters:
         * - username: string. It cannot be empty.
         * - password: string. It cannot be empty.
         * It returns an error if the username represents a non-existing user or if the password is incorrect.
         * It returns the logged in user.
         */
        this.router.post(
            "/",
            [
                check("username").isString().trim().isLength({ min: 1 }).withMessage("Username non valido"),
                check("password").isString().trim().isLength({ min: 1 }).withMessage("Password non valida")
            ],
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array()[0]["msg"] });
                }
                this.authService.login(req, res, next)
                    .then((user: User) => res.status(200).json(user))
                    .catch((err: any) => { res.status(401).json(err) })
            }
        )

        /**
         * Route for logging out the currently logged in user.
         * It expects the user to be logged in.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/current",
            (req: any, res: any, next: any) => this.authService.isLoggedIn(req, res, next),
            (req, res, next) => this.authService.logout(req, res, next)
                .then(() => res.status(200).end())
                .catch((err: any) => {next(err)})
        )

        /**
         * Route for retrieving the currently logged in user.
         * It expects the user to be logged in.
         * It returns the logged in user.
         */
        this.router.get(
            "/current",
            (req: any, res: any, next: any) => this.authService.isLoggedIn(req, res, next),
            (req: any, res: any) => res.status(200).json(req.user)
        )
    }
}

export { UserRoutes, AuthRoutes }