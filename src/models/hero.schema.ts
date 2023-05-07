import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeroDocument = Hero & Document;

@Schema()
export class Hero {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['attacker', 'defender'], required: true })
  ability: string;

  @Prop({ required: true })
  guid: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  suitColors: string[];

  @Prop({ required: true })
  startingPower: number;

  @Prop({ required: true })
  currentPower: number;

  @Prop({ required: true })
  trainingDate: Date;

  @Prop({ required: true })
  trainingCount: number;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
