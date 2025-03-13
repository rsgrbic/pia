import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Zakazivanje } from '../models/zakazivanje';
import { Odrzavanje } from '../models/odrzavanje';
import { Firma } from '../models/Firma';

@Injectable({
  providedIn: 'root'
})
export class ZakazivanjeService {

  constructor(private http:HttpClient) { }
  url:string=("http://localhost:4000/zakazivanja")

  getActiveByUsername(user:string){
    return this.http.post<Zakazivanje[]>(`${this.url}/getActiveByUsername`,{username:user})
  }
  getAllGotova(){
    return this.http.get<Zakazivanje[]>(`${this.url}/getAllDone`)
  }
  getMainPageInfo(){
    return this.http.get<any>(`${this.url}/getMainPageInfo`)
  }

  getArchiveByUsername(user:string){
    return this.http.post<Zakazivanje[]>(`${this.url}/getArchiveByUsername`,{username:user})
  }
  getGotovi(user:string){
    return this.http.post<Zakazivanje[]>(`${this.url}/getFinished`,{username:user})
  }

  createNew(data:Zakazivanje){
      return this.http.post<String>(`${this.url}/createNew`,{new:data})
  }
  otkazi(_id:string){
    return this.http.post<String>(`${this.url}/cancel`,{_id:_id})
  }
  createOdrzavanje(data:Odrzavanje){
    return this.http.post<String>(`${this.url}/createOdrzavanje`,{new:data})

  }
  updateOdrzavanje(id:string,datum:string){
    return this.http.post<String>(`${this.url}/updateOdrzavanje`,{id:id,datum:datum})
  }

  getAktivnaOdrzavanja(id:string){
    return this.http.post<Odrzavanje[]>(`${this.url}/getActiveOdrzavanja`,{user:id})
  }
  getOdbijenaOdrzavanja(id:string){
    return this.http.post<Odrzavanje[]>(`${this.url}/getDeclinedOdrzavanja`,{user:id})

  }

  getNeodobrenaOdrzavanjaByFirma(id:string){
    return this.http.post<Odrzavanje[]>(`${this.url}/getNeodobrenaOdrzavanjaByFirma`,{firma:id})
  }

  getOdobrenaAktivnaOdrzavanjaByFirma(id:string){
    return this.http.post<Odrzavanje[]>(`${this.url}/getOdobrenaAktivnaOdrzavanjaByFirma`,{firma:id})
  }


  getById(id:string){
    return this.http.post<Zakazivanje>(`${this.url}/getById`,{id:id})
  }

  getNeodobrenaByFirmaId(id:string){
    return this.http.post<Zakazivanje[]>(`${this.url}/getNeodobrenaByFirmaId`,{id:id})
  }
  assignJob(user:string,id:string){
    return this.http.post<String>(`${this.url}/assignJob`,{id:id,user:user})
  }

  postPhoto(id:string,file:File){
    const formData=new FormData()
    formData.append('id',id)
    formData.append('photo',file)
    return this.http.post<String>(`${this.url}/postPhoto`,formData)
  }
  declineJob(id:string,comment:string){
    return this.http.post<String>(`${this.url}/declineJob`,{id:id,comment:comment})
  }
  declineOdrzavanje(id:string,comment:string){
    return this.http.post<String>(`${this.url}/declineOdrzavanje`,{id:id,comment:comment})
  }
  acceptOdrzavanje(id:string,user:string,date:string){
    return this.http.post<String>(`${this.url}/acceptOdrzavanje`,{id:id,user:user,date:date})
  }

  getMonthlyJobsByUser(user:string){
    return this.http.post<any>(`${this.url}/getMonthlyJobsByUser`,{user:user})
  }

  getJobsPerDecoratorInFirma(id:string){
    return this.http.post<any>(`${this.url}/getJobsPerDecoratorInFirma`,{id:id})
  }

  getJobsPerWeekday()
    {
      return this.http.get<any>(`${this.url}/getJobsPerWeekday`)
    }
  }
