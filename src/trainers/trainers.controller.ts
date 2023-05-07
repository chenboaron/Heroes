import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { ITrainer, Trainer } from '../models/trainer.schema';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post('signup')
  async signup(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string
  ): Promise<ITrainer> {
    return await this.trainersService.createTrainer(
      firstName,
      lastName,
      email,
      password
    );
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ): Promise<{ accessToken: string }> {
    const trainer = await this.trainersService.validateTrainer(email, password);
    if(trainer){
      const accessToken = Trainer.generateAccessToken(trainer);
      return { accessToken };
    }
  }
}

