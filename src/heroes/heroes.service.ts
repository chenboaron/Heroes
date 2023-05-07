import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hero, HeroDocument } from '../models/hero.schema';
import { TrainersService } from 'src/trainers/trainers.service';

@Injectable()
export class HeroesService {

  constructor(
    @InjectModel(Hero.name) private heroModel: Model<HeroDocument>,
    private readonly trainersService: TrainersService,
  ) { }

  async findAll(email: string): Promise<Hero[]> {
    const trainer = await this.findTrainer(email);
    const heroes: Hero[] = await this.getMyHeroes(trainer);
    return heroes.sort((a, b) => b.currentPower - a.currentPower);
  }

  async findOneByGuid(guid: string): Promise<Hero> {
    return this.heroModel.findOne({ guid }).exec();
  }

  async findOne(guid: string, email: string): Promise<Hero> {
    const trainer = await this.findTrainer(email);
    const str = trainer.heroesList.find(g => g === guid);
    if (!str) {
      throw new NotFoundException(`Hero with guid ${guid} not found`);
    }
    const hero = await this.findOneByGuid(guid);
    return hero;
  }

  async create(hero: Hero, email: string): Promise<Hero> {
    const trainer = await this.findTrainer(email);
    trainer.heroesList.push(hero.guid)
    const updateTrainer = await this.trainersService.updateTrainer(trainer.id, trainer);
    updateTrainer.save();
    const createdHero = new this.heroModel(hero);
    return createdHero.save();
  }

  async update(guid: string, hero: Hero, email: string): Promise<Hero> {
    const trainer = await this.findTrainer(email);
    const str = trainer.heroesList.find(g => g === guid);
    if (!str) {
      throw new NotFoundException(`Hero with guid ${guid} not found`);
    }
    return this.heroModel.findOneAndUpdate({ guid }, hero, { new: true }).exec();
  }

  async delete(guid: string, email: string): Promise<any> {
    const trainer = await this.findTrainer(email);
    const str = trainer.heroesList.find(g => g === guid);
    if (!str) {
      throw new NotFoundException(`Hero with guid ${guid} not found`);
    }
    return this.heroModel.findOneAndDelete({ guid }).exec();
  }

  private async findTrainer(email: string) {
    const trainer = await this.trainersService.findTrainerByEmail(email);
    if (!trainer) {
      throw new NotFoundException(`Trainer with email ${email} not found`);
    }
    return trainer
  }


  private async getMyHeroes(trainer): Promise<Hero[]> {
    const heroes: Hero[] = [];
    for (const guid of trainer.heroesList) {
      const hero = await this.findOneByGuid(guid);
      if (hero) {
        heroes.push(hero)
      }
    }
    return heroes;
  }

  async training(guidList: string[], email: any) {
    const trainer = await this.findTrainer(email)
    const updatedHeroes: Hero[] = [];
    if (guidList.every(r => trainer.heroesList.includes(r))) {
      for (const guid of guidList) {
        const hero = await this.findOneByGuid(guid);
        if (hero) {
          const flag = this.isToday(hero.trainingDate);
          if (!flag) {
            hero.trainingDate = new Date();
            hero.trainingCount = 0;
          }
          if (hero.trainingCount >= 5) {
            throw new BadRequestException(`Hero with guid ${hero.guid} has already trained 5 times today`);
          }
          const randomGrowth = Math.random() * 0.1;
          const newPower = hero.currentPower * (1 + randomGrowth);
          hero.currentPower = newPower;
          hero.trainingCount++;
          const updatedHero = await this.update(hero.guid, hero, email);
          updatedHeroes.push(updatedHero)
        }
      }
      return updatedHeroes;
    } else {
      throw new NotFoundException(`One or more guids were not found as your heroes`);
    }
  }


  isToday(date: Date) {
    const now = new Date()
    return date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
  }



}
