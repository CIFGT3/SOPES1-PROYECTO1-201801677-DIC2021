import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class MemoServiceService {

  constructor(private http: HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type':'application/json',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'*'
  })

  getRam(){
    const url = 'http://localhost:8080/getRam';
    return this.http.get(url,{headers: this.headers}).pipe(map(data=>data))
  }
  
}
