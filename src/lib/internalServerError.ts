import { NextFunction, Request, Response } from 'express';

/**
 * Note all 4 parameters are required for the typings to detect this as the
 * express error handler
 */
export default async function(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const errRes = {
    code: 500,
    message: 'Internal Server Error',
    data: {
      message: err.message,
      stack: err.stack,
    }
  };

  res.status(errRes.code).send(errRes);
}
