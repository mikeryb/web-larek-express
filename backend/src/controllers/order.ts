import { NextFunction, Request, Response } from 'express';
import { Types, Error as MongooseError } from 'mongoose';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/BadRequestError';

interface IOrder {
  payment: 'card' | 'online',
  email: String,
  phone: String,
  address: String,
  total: Number,
  items: string[]
}

async function validateOrder(order: IOrder) {
  const itemsIds = order.items;
  const products = await Product.find({
    _id: { $in: itemsIds.map(id => String(id)) },  // передаём raw-строки
    price: { $ne: null },
  }).exec().catch(() => {
    throw new BadRequestError('некорректные товары в заказе');
  });

  if (products.length != order.items.length) {
    throw new BadRequestError('некорректные товары в заказе');
  }
}

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const order = req.body;
  try {
    await validateOrder(order);
    const id = faker.database.mongodbObjectId();
    return res.status(201).send({ id, total: order.total });
  } catch (error: any) {
    if (error instanceof BadRequestError) {
      return next(error);
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};

export default postOrder;
