import mongoose, { Schema } from 'mongoose';

export interface IImage {
  fileName: string,
  originalName: string
}

export interface IProduct {
  title: String,
  image: IImage,
  category: String,
  description: String,
  price?: Number
}

const imageSchema = new Schema<IImage>({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
}, { _id: false });

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
    required: [true, 'Поле "title" должно быть заполнено'],
    unique: true,
  },
  image: {
    type: imageSchema,
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
