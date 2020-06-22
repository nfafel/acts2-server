import { Request, Response } from 'express';

export default async function(req: Request, res: Response): Promise<void> {
  const errRes = {
    code: 404,
    message: 'Not Found',
  };
  res.status(errRes.code).send(errRes);
}
