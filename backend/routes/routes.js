import { Router } from "express";
import controllers from "../controllers/controllers.js";

const routes = Router();

routes.post('/addData', controllers.addData );
routes.get('/fetchAllData', controllers.fetchAllData);
routes.delete('/deletePassword',controllers.deletePassword);

export default routes;


