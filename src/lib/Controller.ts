import { Router } from 'express';

export default abstract class Controller {
  public readonly router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;
}
