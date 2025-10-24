import { Router } from "express";
import ExpertController from "./expertProfile.controller";

class ExpertRouter {
  router = Router();
  private expertController: ExpertController;

  constructor() {
    this.expertController = new ExpertController();
    this.initRoutes();
  }

  private initRoutes() {}
}

export default ExpertRouter;
