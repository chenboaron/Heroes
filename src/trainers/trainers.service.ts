import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITrainer, Trainer } from '../models/trainer.schema';

@Injectable()
export class TrainersService {
  constructor(@InjectModel('Trainer') private trainerModel: Model<ITrainer>) { }

  async createTrainer(firstName: string, lastName: string, email: string, password: string): Promise<ITrainer> {
    const newTrainer = new this.trainerModel({ firstName, lastName, email, password });
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestException(`The password does not meet criteria`);
    }
    return await newTrainer.save();
  }

  async findTrainerByEmail(email: string): Promise<ITrainer> {
    return await this.trainerModel.findOne({ email }).exec();
  }

  async validateTrainer(email: string, password: string): Promise<ITrainer> {
    const trainer = await this.findTrainerByEmail(email);
    if (!trainer) {
      throw new NotFoundException(`Trainer with email ${email} not found`);
    }
    const isPasswordValid = await Trainer.comparePassword(password, trainer.password);
    if (!isPasswordValid) {
      throw new BadRequestException(`The password or the user are incorrect`);
    }
    return trainer;
  }


  async updateTrainer(id: string, trainer: Trainer): Promise<ITrainer> {
    return this.trainerModel.findByIdAndUpdate(id, trainer, { new: true }).exec();
  }
}
