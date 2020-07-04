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
    if (err.name && err.name === 'ValidationError') {
        const errRes = {
            code: 400,
            message: 'Validation Error',
            data: {
                message: err.message,
                stack: err.stack,
            }
        };

        res.status(errRes.code).send(errRes);
        return;
    }

    next(err);
}
