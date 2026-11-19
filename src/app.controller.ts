import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Parkolohely } from './parkolohely.js';
import type { ParkolohelyDto } from './parkolohelyDto.dto.js';
import { isBooleanObject } from 'util/types';
import { error } from 'console';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private async getparkolohelyek(): Promise<Parkolohely[]>{
    return (await this.appService.getData())
    .toSorted((a, b) => b.idotartam - a.idotartam)
  }

  @Get()
  @Render('index')
  async getParkolohely() {

    return {
      parkolohelyek: await this.getparkolohelyek(),
      errors: []
    }
  }

  @Post()
  @Render('index')
  async addNewParkolohely(@Body() body: ParkolohelyDto){
    var errors: string[] = []

    const rendszamRegx = /^[A-Z]{2} [A-Z]{2}-[0-9]{3}$/
    if(!rendszamRegx.test(body.rendszam)){
      errors.push("Nem megfelelo rendszam")
    }

    const tulajRegx = /^[a-zA-ZéáűőúöüóíÉÁŰŐÚÖÜÓÍ]{6,}$/
    if(!tulajRegx.test(body.tulajdonos)){
      errors.push("Nem megfelelo tulajdonos nev")
    }

    const idotartamRegx = /^([0-9]|1[0-9]|2[0-4])$/
    if(!idotartamRegx.test(body.idotartam)){
      errors.push("Nem megfelelo idotartam")
    }

    const fizetes = body.fizetve === "on" ? true : false

    if(!(typeof (fizetes) === "boolean") ){
       errors.push("Fizetesi logika hiba")
       console.log(fizetes)
    }

    if(errors.length > 0){
      return{
        parkolohelyek: await this.getparkolohelyek(),
        errors: errors
      }
    }else{
      this.appService.parkolohelyHozzadasa(body)
      return{
        parkolohelyek: await this.getparkolohelyek(),
        errors: ["Sikeres felvetel"]
      }
    }

  }
}
