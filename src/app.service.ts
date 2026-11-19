import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise'
import 'dotenv/config'
import { Parkolohely } from './parkolohely.js';
import { ParkolohelyDto } from './parkolohelyDto.dto.js';

const mysqlConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

@Injectable()
export class AppService {

  async getData(){
    const[result] = await mysqlConnection.execute(
      "SELECT * FROM parkolas"
    )
    const rows = result as Parkolohely[]
    return rows
  }

  async parkolohelyHozzadasa(parkolohely: ParkolohelyDto){
    const[rows] = await mysqlConnection.execute(
      "SELECT MAX(id) + 1 as newID from parkolas"
    )

    const newId = (rows as any[])[0].newID ?? 1;

    const[result] = await mysqlConnection.execute(
      "INSERT INTO parkolas (id, rendszam, tulajdonos, idotartam, fizetve) VALUES(?, ?, ?, ?, ?)",
      [newId, parkolohely.rendszam, parkolohely.tulajdonos, parkolohely.idotartam, parkolohely.fizetve ? 1: 0]
    )
    return result
  }
}
