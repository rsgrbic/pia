import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Korisnik } from '../models/Korisnik';

@Injectable({
  providedIn: 'root'
})
export class korisnikService {
  url = "http://localhost:4000/korisnici"
  constructor(private http: HttpClient) { }

  register(vlasnik: Korisnik, file: File | null) {
    const formData = new FormData();
    formData.append('vlasnik', JSON.stringify(vlasnik))

    if (file) {
      formData.append('profilePhoto', file)
    }

    return this.http.post<String>(`${this.url}/register`, formData)
  }
  findByUsername(name: string) {
    return this.http.post<Korisnik>(`${this.url}/findByUsername`, { username: name })
  }
  deactivate(user: string) {
    return this.http.post<any>(`${this.url}/deactivateUser`, { user: user })
  }
  unblock(user: string) {
    return this.http.post<any>(`${this.url}/unblockUser`, { user: user })
  }
  deny(user:string){
    return this.http.post<any>(`${this.url}/denyUser`, { user: user })

  }

  getAll() {
    return this.http.get<Korisnik[]>(`${this.url}/getAll`)
  }

  findByMail(email: string) {
    return this.http.post<Korisnik>(`${this.url}/findByEmail`, { email: email })
  }
  login(username: string, password: string) {
    return this.http.post<Korisnik>(`${this.url}/login`, { username: username, password: password })
  }
  captchaCheck(text: string) {
    return this.http.post<string>(`${this.url}/captchaCheck`, { data: text })
  }

  updatePhoto(username: string, file: File | null) {
    const formData = new FormData();
    formData.append('username', JSON.stringify(username))
    if (file) {
      formData.append('profilePhoto', file)
    }
    return this.http.post<String>(`${this.url}/updatePhoto`, formData)
  }
  getDekoratoriByFirmaId(id: string) {
    return this.http.post<Korisnik[]>(`${this.url}/getDekoratoriByFirmaId`, { id: id })
  }

  updateInfo(username: string,
    name: string,
    lastname: string,
    address: string,
    phone: string,
    email: string,
    creditCard: string
  ) {
    let user = {
      username: username,
      name: name,
      lastname: lastname,
      address: address,
      phone: phone,
      email: email,
      creditCard: creditCard
    };
    return this.http.post<String>(`${this.url}/updateInfo`, user)
  }

  updateInfoDekor(username: string,
    name: string,
    lastname: string,
    address: string,
    phone: string,
    email: string,
    firma: string
  ) {
    let user = {
      username: username,
      name: name,
      lastname: lastname,
      address: address,
      phone: phone,
      email: email,
      firma: firma
    };
    return this.http.post<String>(`${this.url}/updateInfoDekor`, user)
  }

  changePassword(username: string, old: string, newpwd: string) {
    let data = {
      username: username,
      password: old,
      newpwd: newpwd
    }
    return this.http.post<String>(`${this.url}/changePassword`, data)
  }

  blokiraj(username: string) {
    return this.http.post<String>(`${this.url}/blockUser`, { username: username })
  }
} 
