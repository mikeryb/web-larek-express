import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import orderRouteValidator from './middlewares/orderValidate';
import errorHandler from './middlewares/errorHandler';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

app.use(requestLogger);
app.use('/product', productRouter);
app.use('/order', orderRouteValidator, orderRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(3000, () => {});
