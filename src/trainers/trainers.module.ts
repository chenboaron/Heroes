import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { TrainerSchema } from 'src/models/trainer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Trainer', schema: TrainerSchema }]),
    PassportModule,
  ],
  controllers: [TrainersController],
  providers: [TrainersService, JwtStrategy],
  exports: [TrainersService]
})
export class TrainersModule { }
