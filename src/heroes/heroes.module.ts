import { Module } from '@nestjs/common';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { HeroSchema } from 'src/models/hero.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainersModule } from 'src/trainers/trainers.module';

@Module({
  imports:[TrainersModule, MongooseModule.forFeature([{ name: 'Hero', schema:  HeroSchema }])],
  controllers: [HeroesController],
  providers: [HeroesService]
})
export class HeroesModule {}
