import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import {map} from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})

export class CpuServiceService{

  constructor(private http: HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type':'application/json',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'*'
  })

  // obtener la informacion de los procesos
  getInfo(){
    const url = 'http://localhost:8080/getCpu';
    return this.http.get(url,{headers: this.headers}).pipe(map(data=>data))
  }

  getInfoGraphic(){
    const url = 'http://localhost:8080/getCpuGraphic';
    return this.http.get(url,{headers: this.headers}).pipe(map(data=>data))
  }

  // post para eliminar un proceso recibiendo su pid
  kill(pid:string){
    const url = 'http://localhost:8080/killProcess';
    return this.http.post(url, {
      "Pid":pid
    }, {headers: this.headers}).pipe(map(data=>data))
  }
}


