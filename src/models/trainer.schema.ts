import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export type TrainerDocument = Trainer & Document;

@Schema()
export class Trainer {

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  heroesList: string[];

  static async comparePassword(password: string, oldPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, oldPassword);
  }

  static generateAccessToken(trainer: Trainer): string {
    const { firstName, lastName, email } = trainer;
    const payload = { firstName, lastName, email };
    const secretKey = 'secret'; // todo: Replace with actual secret key in production
    return jwt.sign(payload, secretKey);
  }
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);
TrainerSchema.pre<ITrainer>('save', async function (next) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(this.password, saltRounds);
  this.password = hashedPassword;
  next();
});
export interface ITrainer extends TrainerDocument {
   comparePassword(password: string, oldPassword: string): Promise<boolean>;
   generateAccessToken(trainer: Trainer): string;
}



