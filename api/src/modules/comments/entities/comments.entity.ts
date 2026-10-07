import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Hoagie', required: true })
  hoagie: Types.ObjectId;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
