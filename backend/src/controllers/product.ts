import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import ConflictError from '../errors/Conflict';
import BadRequestError from '../errors/BadRequestError';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((products) => res.status(200).send({ items: products }))
  .catch(next);

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const {
    title, description, category, price, image,
  } = req.body;
  try {
    const product = await Product.create({
      title, description, category, price, image,
    });
    return res.status(201).send({ product });
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};
