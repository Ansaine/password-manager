import { Router } from "express";
import controllers from "../controllers/controllers.js";

const routes = Router();
// all routes are protected using jwt auth middleware

// DB - crud apis
routes.post('/addData', controllers.authenticateToken,controllers.addData );
routes.get('/fetchAllData',controllers.authenticateToken, controllers.fetchAllData);
routes.delete('/deletePassword',controllers.authenticateToken,controllers.deletePassword);

// Authentication - Login and registration
routes.post('/register',controllers.authenticateToken, controllers.register );
routes.post('/login', controllers.authenticateToken,controllers.login );
routes.get('/protectionTest', controllers.authenticateToken, controllers.protectionTest );




export default routes;


