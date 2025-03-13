import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Firma } from '../models/Firma';
import { Zakazivanje } from '../models/zakazivanje';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { oblik } from '../models/oblik';

@Component({
  selector: 'app-zakazivanje',
  templateUrl: './zakazivanje.component.html',
  styleUrls: ['./zakazivanje.component.css']
})
export class ZakazivanjeComponent {
  oblici:oblik[]=[]
  step: number = 1;
  isPrivateGarden: boolean = true;
  errorString:string=''
  selectedOptions:{nazivUsluge:string,cena:number}[]=[]
  options:{nazivUsluge:string,cena:number}[]=[]
  formState:{[key:string]:boolean}={}
  @Input() receivedData:Firma=new Firma();
  
  updateOblik(obj:oblik[]){
    this.oblici=obj;
  }

  ngOnInit(){
    this.options=this.receivedData.usluge
    this.options.forEach(opt=>{
      this.formState[opt.nazivUsluge]=false;
    })
  }

  
  constructor(private zakazivanjeServis:ZakazivanjeService){}
  
  toggleCheckbox(id:string){
    this.formState[id]=!this.formState[id]
    this.selectedOptions = this.options.filter(opt => opt.nazivUsluge in this.formState && this.formState[opt.nazivUsluge]);
  }

  formData = {
    datumVreme: '',
    povrsinaBasta: '',
    gardenType: 'private', 
    povrsinaBazen: '',
    povrsinaZelenilo: '',
    povrsinaLoza: '',
    povrsinaFontana: '',
    stolovi: '',
    stolice: '',
    dodatniZahtevi: '',
    uslugeFirme:'',
    krajDatum:''
  };

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
    if(this.step==1){
      this.formData.povrsinaZelenilo=''
      this.formData.povrsinaBazen=''
      this.formData.povrsinaFontana=''
      this.formData.povrsinaLoza=''
      this.formData.stolice=''
      this.formData.stolovi=''
      this.formData.dodatniZahtevi=''
    }
  }

  endCheck(){
    const selectedDate=new Date(this.formData.datumVreme)
    const endDate=new Date(this.formData.krajDatum)
    if(endDate<selectedDate){
      this.errorString='Datum kraja radova mora biti nakon pocetka radova.'
      this.formData.krajDatum=''
    }
    else{
      this.errorString=''
    }
  }

  checkDate(){
    const selectedDate=new Date(this.formData.datumVreme)
    const startOdmor=new Date(this.receivedData.odmorStart)
    const endOdmor=new Date(this.receivedData.odmorEnd)
    const currDate=new Date()

    const selectedMonthDay = `${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    const odmorStartMonthDay = `${startOdmor.getMonth()}-${startOdmor.getDate()}`;
    const odmorEndMonthDay = `${endOdmor.getMonth()}-${endOdmor.getDate()}`;
    let vremeOdmora:boolean=false
    if(selectedDate<currDate){
      this.errorString="Vreme mora biti u buducnosti."
      this.formData.datumVreme=''
    }
    else{
      if(odmorStartMonthDay<=odmorEndMonthDay){
          vremeOdmora=selectedMonthDay>=odmorStartMonthDay && selectedMonthDay<=odmorEndMonthDay
        }
        else{
          vremeOdmora=selectedMonthDay>=odmorStartMonthDay || selectedMonthDay<=odmorEndMonthDay
        }
        if(vremeOdmora){
          this.errorString='Firma je na odmoru u to vreme!'
          this.formData.datumVreme=''
        }
        else{
          this.errorString=''
        }
      }
    }

  onGardenTypeChange() {
    this.isPrivateGarden = this.formData.gardenType === 'private';
  }

  onSubmit() {
    this.errorString=""
    
    const check1=this.formData.datumVreme && this.formData.povrsinaBasta 
    if(!check1){
      this.errorString="Popunite pocetna polja."
      this.step=1;
      return;
    }
    this.checkDate();
    const checkPrivate= this.formData.povrsinaBazen && this.formData.povrsinaLoza && this.formData.povrsinaZelenilo
    if(this.isPrivateGarden && !checkPrivate){
      this.errorString="Popunite sve informacije o privatnoj basti."
      this.step=2;
      return;
    }
    const checkRestoraunt=this.formData.povrsinaFontana && this.formData.povrsinaZelenilo && this.formData.stolice && this.formData.stolovi
    if(!this.isPrivateGarden && !checkRestoraunt){
      this.errorString="Popunite sve informacije o restoranskoj basti."
      this.step=2;
      return
    }
    if(this.isPrivateGarden){
      if(this.formData.povrsinaBasta<this.formData.povrsinaBazen+this.formData.povrsinaZelenilo+this.formData.povrsinaLoza){
        this.errorString="Kvadrature se ne uklapaju. Proverite ponovo."
        this.step=2;
        return;
      }
    }
    else{
      if(this.formData.povrsinaBasta<this.formData.povrsinaFontana+this.formData.povrsinaZelenilo){
        this.errorString="Kvadrature se ne uklapaju. Proverite ponovo."
        this.step=2;
        return;
      }
    }


    if(this.formData.krajDatum==''){
      this.errorString="Popunite ocekivani kraj radova"
      return
    }
    
    
    let zakazivanje = new Zakazivanje()
    zakazivanje.firma=this.receivedData._id;
    const loggedUser = localStorage.getItem("logged");
    zakazivanje.user = loggedUser !== null ? loggedUser : "BAD";
    zakazivanje.datumVreme = this.formData.datumVreme;
    zakazivanje.povrsinaBasta = parseInt(this.formData.povrsinaBasta, 10);
    zakazivanje.tip = this.formData.gardenType;
    zakazivanje.povrsinaBazen = this.formData.povrsinaBazen ? parseInt(this.formData.povrsinaBazen, 10) : 0;
    zakazivanje.povrsinaZelenilo = this.formData.povrsinaZelenilo ? parseInt(this.formData.povrsinaZelenilo, 10) : 0;
    zakazivanje.povrsinaLoza = this.formData.povrsinaLoza ? parseInt(this.formData.povrsinaLoza, 10) : 0;
    zakazivanje.povrsinaFontana = this.formData.povrsinaFontana ? parseInt(this.formData.povrsinaFontana, 10) : 0;
    zakazivanje.stolovi = this.formData.stolovi ? parseInt(this.formData.stolovi, 10) : 0;
    zakazivanje.stolice = this.formData.stolice ? parseInt(this.formData.stolice, 10) : 0;
    zakazivanje.dodatniZahtevi = this.formData.dodatniZahtevi;
    zakazivanje.krajDatum = this.formData.krajDatum;
    zakazivanje.uslugeFirme=this.selectedOptions;
    zakazivanje.status="obrada";
    zakazivanje.commentLeft="false"; 
    zakazivanje.basta=this.oblici;
    zakazivanje.datumVremeTrenutno= new Date().toLocaleString()
    this.zakazivanjeServis.createNew(zakazivanje).subscribe(data=>{
      if(data){
        alert("Uspesna rezervacija.")
        this.prevStep()
        this.prevStep()
      }
      else{
        this.errorString="Neuspesna rezervacija."
      }

    });
  }
}

