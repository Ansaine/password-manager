import { Router } from "express";
import controllers from "../controllers/controllers.js";

const routes = Router();

// DB - crud apis
routes.post('/addData', controllers.addData );
routes.get('/fetchAllData', controllers.fetchAllData);
routes.delete('/deletePassword',controllers.deletePassword);

// Authentication - Login and registration
routes.post('/register', controllers.register );
routes.post('/login', controllers.login );
routes.get('/protectionTest', controllers.authenticateToken, controllers.protectionTest );




export default routes;


