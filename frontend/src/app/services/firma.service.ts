import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firma } from '../models/Firma';
@Injectable({
  providedIn: 'root'
})
export class FirmaService {
  url:string="http://localhost:4000/firme"
  constructor(private http:HttpClient) { }

  getByName(naziv:string){
    return this.http.post<Firma>(`${this.url}/getByName`,{name:naziv})
  }
  getAll(){
    return this.http.get<Firma[]>(`${this.url}/getAll`)
  }
  search(naziv:string,adresa:string){
    return this.http.post<Firma[]>(`${this.url}/search`,{naziv:naziv,adresa:adresa})
  }
  getById(id:string){
    return this.http.post<Firma>(`${this.url}/getById`,{id:id})
  }
  addKomentar(autor:string,val:number,text: string,idFirm:string,idZakaz:string){
    return this.http.post<any>(`${this.url}/addKomentar`,{autor:autor,val:val,text:text,idFirm:idFirm,idZakaz:idZakaz})

  }
  addDekor(user:string,firma:string){
    return this.http.post<any>(`${this.url}/addDekor`,{user:user,firma:firma})
  }

  getKomentar(idZakaz:string,idFirm:string){
    return this.http.post<{autor:string,zakaz:string,val:number,text: string}>(`${this.url}/getKomentar`,{idZakaz:idZakaz,idFirm:idFirm})
  }

  registerFirma(firma:Firma){
    return this.http.post<any>(`${this.url}/registerFirma`,{firma:firma})
  }
}
