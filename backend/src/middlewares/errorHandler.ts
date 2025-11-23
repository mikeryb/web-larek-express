import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status = err.statusCode || 500;

  res.status(status).send({
    message: status === 500
      ? 'На сервере произошла ошибка'
      : err.message,
  });
};

export default errorHandler;
