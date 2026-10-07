import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HoagieDocument = Hoagie & Document;

export interface Ingredient {
  name: string;
  quantity: string;
}

@Schema({ timestamps: true })
export class Hoagie {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ name: String, quantity: String }], default: [] })
  ingredients: Ingredient[];

  @Prop()
  pictureUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  collaborators: Types.ObjectId[];

  @Prop({ default: 0 })
  commentCount: number;
}

export const HoagieSchema = SchemaFactory.createForClass(Hoagie);
