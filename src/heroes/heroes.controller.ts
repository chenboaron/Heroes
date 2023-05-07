import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { Hero } from '../models/hero.schema';
import { JwtAuthGuard } from 'src/trainers/auth/jwt-auth.guard';


@Controller('heroes')
export class HeroesController {
  constructor(private heroesService: HeroesService) { }


  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any): Promise<Hero[]> {
    return this.heroesService.findAll(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any): Promise<Hero> {
    return this.heroesService.findOne(id, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() hero: Hero, @Req() req: any): Promise<Hero> {
    return this.heroesService.create(hero, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() hero: Hero, @Req() req: any): Promise<Hero> {
    return this.heroesService.update(id, hero, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any): Promise<any> {
    return this.heroesService.delete(id, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/training')
  async training(@Body() guidList: string[], @Req() req: any): Promise<Hero[]> {
    return this.heroesService.training(guidList, req.user.email);
  }

}
