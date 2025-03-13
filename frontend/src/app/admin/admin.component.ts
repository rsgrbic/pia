import { Component } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { Firma } from '../models/Firma';
import { FirmaService } from '../services/firma.service';
import { korisnikService } from '../services/korisnik.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

  ]
})
export class AdminComponent {
  allKorisnici: Korisnik[] = []
  allVlasnici: Korisnik[] = []
  allDekorateri: Korisnik[] = []
  registeredVlasnici: Korisnik[] = []
  newVlasnici: Korisnik[] = []
  allFirme: Firma[] = []
  selectedUser: Korisnik = new Korisnik()
  modalKorisnikBool: boolean = false
  modalDekoratorBool: boolean = false
  errorString: string = ''
  usedmail: string = ''
  firmaModalBool:boolean=false;
  selectedFirma:Firma=new Firma()

  constructor(private korisnikService: korisnikService, private firmaService: FirmaService,private router:Router) { }
  ngOnInit() {
    this.allDekorateri=[]
    this.allVlasnici=[]
    this.registeredVlasnici=[]
    this.newVlasnici=[]

    this.korisnikService.getAll().subscribe(
      data => {
        if (data)
          this.allKorisnici = data
        this.allKorisnici.forEach(kor => {
          if (kor.type === 'vlasnik' && kor.status!='odbijen') {
            if (kor.status == 'obrada') {
              if (!this.newVlasnici.find(item => item.username === kor.username)) {

                this.newVlasnici.push(kor);
              }
            }
            else {
              if (!this.registeredVlasnici.find(item => item.username === kor.username)) {
                const index = this.newVlasnici.findIndex(item => item.username === kor.username);

                if (index !== -1) {
                  this.newVlasnici.splice(index, 1); 
                }

                this.registeredVlasnici.push(kor);
              }
            }
          } else if (kor.type === 'dekorater') {
            if (!this.allDekorateri.find(item => item.username === kor.username)) {
              this.allDekorateri.push(kor);
            }
          }
        });

      }
    )
    this.firmaService.getAll().subscribe(
      data => {
        if (data) {
          this.allFirme = data
        }
      }
    )
  }
  deny(kor:Korisnik){
    this.korisnikService.deny(kor.username).subscribe(
      data=>{
        if(data){
          this.ngOnInit(
          )
        }
      }
    )
  }

  unblock(kor: Korisnik) {
    this.korisnikService.unblock(kor.username).subscribe(
      data => {
        if (data) {
          this.ngOnInit()
          
        }
      }
    )
  }

  promenaLoz(){
    this.router.navigate(['/promenalozinke'])
  }

  deactivate(kor: Korisnik) {
    this.korisnikService.deactivate(kor.username).subscribe(
      data => {
        if (data) {
          this.ngOnInit()
          alert("korisnik deaktiviran.")
        }
      }
    )
  }
  openModalKorisnik(vlasnik: Korisnik) {
    this.selectedUser = JSON.parse(JSON.stringify(vlasnik));
    this.usedmail = vlasnik.email
    this.modalKorisnikBool = true
  }
  closeModalKorisnik() {
    this.modalKorisnikBool = false
  }

  logout(){
    localStorage.removeItem('logged')
    localStorage.removeItem('type')
    this.router.navigate(['/login'])
  }
  openModalDekorator(vlasnik: Korisnik) {
    this.selectedUser = JSON.parse(JSON.stringify(vlasnik));
    this.usedmail = vlasnik.email
    this.modalDekoratorBool = true
  }
  closeModalDekorator() {
    this.modalDekoratorBool = false

  }

  openModalFirma(firma: Firma) {
    this.firmaModalBool = true
    this.selectedFirma=firma
  }
  firmaModalClose() {
    this.firmaModalBool = false
    this.ngOnInit();

  }

  updateDekorator() {
    this.errorString = ''
    const allFieldsNotEmpty =
      this.selectedUser.name &&
      this.selectedUser.lastname &&
      this.selectedUser.address &&
      this.selectedUser.phone &&
      this.selectedUser.email

    if (!allFieldsNotEmpty) {
      this.errorString = 'Popunite sva polja.';
      return;
    }

    if (!this.emailPattern.test(this.selectedUser.email)) {
      this.errorString = 'Nekorektna Email adresa.';
      return;
    }

    if (!this.phonePattern.test(this.selectedUser.phone)) {
      this.errorString = 'Lose unet broj telefona.';
      return;
    }

    this.korisnikService.findByUsername(this.selectedUser.username).subscribe(data => {
      if (!data) {
        this.errorString = 'Korisnik NEKIM CUDOM NE POSTOJI'
      }
      else {
        this.korisnikService.findByMail(this.selectedUser.email).subscribe(data => {
          if (data && data.email != this.usedmail) {
            this.errorString = 'Email je vec zauzet.'
          }
          else {
            this.errorString = ''
            console.log(this.selectedUser.lastname)
            this.korisnikService.updateInfoDekor(this.selectedUser.username,
              this.selectedUser.name,
              this.selectedUser.lastname,
              this.selectedUser.address,
              this.selectedUser.phone,
              this.selectedUser.email,
              this.selectedUser.firma ? this.selectedUser.firma : '').subscribe(data => {
                if (data) {
                  this.closeModalDekorator()
                  this.ngOnInit();
                  alert("uspesno azurirano")
                }
                else {
                  this.errorString = 'Neuspesno azuriranje informacija.'
                }
              })
          }
        })

      }
    })
  }
  updateKorisnik() {
    this.checkCCNumber()
    this.errorString = ''
    const allFieldsNotEmpty =
      this.selectedUser.name &&
      this.selectedUser.lastname &&
      this.selectedUser.address &&
      this.selectedUser.phone &&
      this.selectedUser.email &&
      this.selectedUser.creditCard;

    if (!allFieldsNotEmpty) {
      this.errorString = 'Popunite sva polja.';
      return;
    }

    if (!this.emailPattern.test(this.selectedUser.email)) {
      this.errorString = 'Nekorektna Email adresa.';
      return;
    }

    if (!this.phonePattern.test(this.selectedUser.phone)) {
      this.errorString = 'Lose unet broj telefona.';
      return;
    }


    if (this.cardType == 'diners' && this.selectedUser.creditCard.length != 15) {
      this.errorString = 'Molimo unesite vazecu karticu.'
      return;
    }
    if (this.cardType == 'mastercard' && this.selectedUser.creditCard.length != 16) {
      this.errorString = 'Molimo unesite vazecu karticu.'
      return;
    }
    if (this.cardType == 'visa' && this.selectedUser.creditCard.length != 16) {
      this.errorString = 'Molimo unesite vazecu karticu.'
      return;
    }
    if (this.cardType == '') {
      this.errorString = 'Molimo unesite broj kartice.'
      return;
    }

    this.korisnikService.findByUsername(this.selectedUser.username).subscribe(data => {
      if (!data) {
        this.errorString = 'Korisnik NEKIM CUDOM NE POSTOJI'
      }
      else {
        this.korisnikService.findByMail(this.selectedUser.email).subscribe(data => {
          if (data && data.email != this.usedmail) {
            this.errorString = 'Email je vec zauzet.'
          }
          else {
            this.errorString = ''
            this.korisnikService.updateInfo(this.selectedUser.username,
              this.selectedUser.name,
              this.selectedUser.lastname,
              this.selectedUser.address,
              this.selectedUser.phone,
              this.selectedUser.email,
              this.selectedUser.creditCard).subscribe(data => {
                if (data) {
                  this.closeModalKorisnik()
                  this.ngOnInit();
                  alert("uspesno azurirano")
                }
                else {
                  this.errorString = 'Neuspesno azuriranje informacija.'
                }
              })
          }
        })

      }
    })
  }

  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  private phonePattern = /^\+\d{10,12}$/  

  cardType: string = ''

  checkCCNumber() {
    const dinersRegex = /^(300|301|302|303|36|38)/;
    const masterCardRegex = /^(51|52|53|54|55)/;
    const visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)/;

    if (dinersRegex.test(this.selectedUser.creditCard)) {
      this.cardType = 'diners';
    } else if (masterCardRegex.test(this.selectedUser.creditCard)) {
      this.cardType = 'mastercard';
    } else if (visaRegex.test(this.selectedUser.creditCard)) {
      this.cardType = 'visa';
    } else {
      this.cardType = ''
    }
  }
}

