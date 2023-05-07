import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroesModule } from './heroes/heroes.module';
import { TrainersModule } from './trainers/trainers.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest'),TrainersModule, HeroesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
