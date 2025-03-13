import { Component } from '@angular/core';
import * as L from 'leaflet'
import { Korisnik } from '../models/Korisnik';
import { korisnikService } from '../services/korisnik.service';
import { Firma } from '../models/Firma';
import { FirmaService } from '../services/firma.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-firma',
  templateUrl: './admin-firma.component.html',
  styleUrls: ['./admin-firma.component.css']
})
export class AdminFirmaComponent {
  usluge: { nazivUsluge: string, cena: number }[] = [{ nazivUsluge: '', cena: 0 }]
  naziv: string = ''
  telefon: string = ''
  adresa: string = ''
  private map: L.Map | undefined;
  selectMap: { lat: number, lng: number } = { lat: 0, lng: 0 }
  marker: L.Marker<any> | null = null
  dekoratori: Korisnik[] = []
  newDekorator: Korisnik = new Korisnik()
  leaveStart: string = ''
  leaveEnd: string = ''
  errorString: string = ''
  constructor(private service: korisnikService, private firmaService: FirmaService, private router: Router) { }
  addService() {
    this.usluge.push({ nazivUsluge: '', cena: 0 });
  }

  logout() {
    localStorage.removeItem('logged')
    localStorage.removeItem('type')
    this.router.navigate(['/login'])
  }
  removeService(index: number) {
    if (this.usluge.length > 1)
      this.usluge.splice(index, 1);
  }
  addDekor() {
    this.dekoratori.push(new Korisnik())
  }
  removeDekor(index: number) {
    this.dekoratori.splice(index, 1);
  }
  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  private phonePattern = /^\+\d{10,12}$/ 
  private passwordPattern = /^(?=[A-Za-z])(?=(?:.*[a-z]){3})(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@#$!%*?&]{6,10}$/

  submitForm() {
    this.errorString = ''
    const allFieldsNotEmpty = this.naziv && this.adresa && this.telefon && this.leaveEnd && this.leaveStart
    if (!allFieldsNotEmpty) {
      this.errorString = 'Popunite sva polja'
      return
    }
    this.usluge.forEach(usl=>{usl.nazivUsluge=usl.nazivUsluge.toLowerCase()})

    if (!this.usluge.some(usl => (usl.nazivUsluge) === 'odrzavanje')) {
      this.errorString = 'Firma mora imati uslugu odrzavanja.';
      return
    }
    this.usluge.forEach(usl => {
      if (usl.nazivUsluge == '') {
        this.errorString = "Popunite polja novih usluga"
        return
      }
    })
    if ((this.selectMap.lat == 0 && this.selectMap.lng == 0)) {
      this.errorString = "Unesite lokaciju na mapi."
      return
    }

    if (!this.phonePattern.test(this.telefon)) {
      this.errorString = "Neodgovarajuc broj telefona."
      return
    }
    if (this.dekoratori.length < 2) {
      this.errorString = "Morate registrovati bar 2 dekoratora u firmi."
      return
    }

    const uniqueUser = new Set(this.dekoratori.map(item => item.username))
    console.log(uniqueUser)
    if (!(uniqueUser.size == this.dekoratori.length)) {
      this.errorString = 'Korisnicka imena dekoratora moraju biti razlicita'
      return
    }
    const uniqueMail = new Set(this.dekoratori.map(item => item.email))
    console.log(uniqueMail)
    if (!(uniqueMail.size == this.dekoratori.length)) {
      this.errorString = 'Email adrese dekoratora moraju biti razlicite'
      return
    }

    const total = this.dekoratori.length
    let finishedReg = 0

    const onComplete = () => {
      if (finishedReg === total) {
        this.registerDekori()
      }
    }

    this.dekoratori.forEach(dekor => {
      const allFieldsNotEmpty =
        dekor.username &&
        dekor.password &&
        dekor.name &&
        dekor.lastname &&
        dekor.gender &&
        dekor.address &&
        dekor.phone &&
        dekor.email

      if (!allFieldsNotEmpty) {
        this.errorString = 'Popunite sva polja dodatih dekoratora.';
        return;
      }

      if (!this.emailPattern.test(dekor.email)) {
        this.errorString = 'Nekorektna Email adresa dekoratora ' + dekor.username;
        return;
      }

      if (!this.phonePattern.test(dekor.phone)) {
        this.errorString = 'Lose unet broj telefona dekoratora ' + dekor.username;
        return;
      }

      if (!this.passwordPattern.test(dekor.password)) {

        this.errorString = "Sifra dekoratora " + dekor.username + " ne ispunjava uslove. Mora poceti slovom, sadrzati bar jedno veliko i tri mala slova,bar jednu cifru,bar jedan specijalni karakter i biti dugacka 6-10 karaktera.";
        dekor.password = ''
        return;
      }

      this.service.findByUsername(dekor.username).subscribe(data => {
        if (data) {
          this.errorString = 'Korisisnicko ime ' + dekor.username + ' je zauzeto.'
          return
        }
        else {
          this.service.findByMail(dekor.email).subscribe(data => {
            if (data) {
              this.errorString = 'Email dekoratora ' + dekor.username + ' je vec zauzet.'
              return
            }
            else {

              finishedReg++
              onComplete()
            }

          }

          )

        }

      })
    })

  }

  registerDekori(){
    const num=this.dekoratori.length
        let brojac=0

        const onregister=()=>{
          if(num==brojac){
            this.registerFirm()
          }
        }

        this.dekoratori.forEach(dekor=>{
          let dekorater = new Korisnik()
                      dekorater.username = dekor.username.toLowerCase()
                      dekorater.address = dekor.address
                      dekorater.phone = dekor.phone
                      dekorater.name = dekor.name
                      dekorater.lastname = dekor.lastname;
                      dekorater.gender = dekor.gender
                      dekorater.email = dekor.email.toLowerCase()
                      dekorater.password = dekor.password;
                      dekorater.type = 'dekorater'
                      dekorater.status = 'aktivan'
                      dekorater.firma = ''
                      this.service.register(dekorater, null).subscribe(data => {
                        if (!data) {
                          console.error("GRESKA KOD REGISTRACIJE")
                          return;
                        }
                        else{
                          brojac++;
                          onregister();

                        }
        })
      })
    
    }

  registerFirm() {


    let firma = new Firma()
    firma.adresa = this.adresa
    firma.naziv = this.naziv
    firma.telefon = this.telefon
    firma.usluge = this.usluge
    firma.koordinate = this.selectMap
    firma.ocena = '0'
    firma.odmorStart = this.leaveStart
    firma.odmorEnd = this.leaveEnd
    firma.brojKomentara = 0
    this.dekoratori.forEach(dekor => {
      firma.dekoratori.push({ user: dekor.username.toLowerCase() })
    })
    this.firmaService.registerFirma(firma).subscribe(
      data => {
        let num = 0
        const numDekor = this.dekoratori.length
        const complete = () => {
          if (num == numDekor) {
            this.finish()
          }
        }
        if (data) {
          this.dekoratori.forEach(dekor => {
            console.log(dekor.username)
            this.service.updateInfoDekor(
              dekor.username.toLowerCase(),
              dekor.name,
              dekor.lastname,
              dekor.address,
              dekor.phone,
              dekor.email.toLowerCase(),
              dekor.firma = data._id
            ).subscribe(data => {
              if (data) {
                num++;
                complete()

              }
              else {
                alert("neuspeh dodavanja.")
                return;
              }
            })
          })
        }
      }
    )
  }

  finish() {
    alert("uspesno dodata firma.")
  }


  datesCheck() {
    if (this.leaveStart != '') {
      const startDate = new Date(this.leaveStart);
      const endDate = new Date(this.leaveEnd);

      if (endDate < startDate) {
        this.errorString = "Datum zavrsetka odmora mora biti nakon datuma pocetka."
        this.leaveEnd = ''
      }
    }
  }
  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    const center = L.latLng(44.805, 20.452);
    const renderer = L.canvas()
    this.map = L.map('map', { renderer: renderer }).setView(center, 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c'],
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.selectMap = { lat, lng }

      if (this.marker) {
        this.map!.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lng]).addTo(this.map!).bindPopup(`Lokacija: ${lat}, ${lng}`).openPopup();
      console.log(this.selectMap)
    });
  }


}
