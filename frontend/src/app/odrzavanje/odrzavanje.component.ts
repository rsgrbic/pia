import { Component } from '@angular/core';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { FirmaService } from '../services/firma.service';
import { Zakazivanje } from '../models/zakazivanje';
import { Firma } from '../models/Firma';
import { Odrzavanje } from '../models/odrzavanje';
import { Router } from '@angular/router';

@Component({
  selector: 'app-odrzavanje',
  templateUrl: './odrzavanje.component.html',
  styleUrls: ['./odrzavanje.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

  ]
})
export class OdrzavanjeComponent {
  gotoviPoslovi:Zakazivanje[]=[]
  activeUser:string=''
  selectedZakaz:Zakazivanje|null=null
  activeOdrzavanja:Odrzavanje[]=[]
  activeZakaz:Zakazivanje[]=[]
  declinedOdr:Odrzavanje[]=[]
  modalOpen:boolean=false;
  firma:Firma|null=null
  odrzavanjeDate:string=''
  errorString:string=''
  constructor(private zakazivanjeServis:ZakazivanjeService,private firmaServis:FirmaService,private router:Router){}

  ngOnInit(){
    const ls=localStorage.getItem("logged")
    this.activeUser=ls?ls:''
    this.zakazivanjeServis.getGotovi(this.activeUser).subscribe(data=>{
      if(data){
        this.gotoviPoslovi=data
        
      }
    })
    
    this.zakazivanjeServis.getAktivnaOdrzavanja(this.activeUser).subscribe(data=>{
      if(data){
        this.activeOdrzavanja=data;
      }
    })

    this.zakazivanjeServis.getOdbijenaOdrzavanja(this.activeUser).subscribe(
      data=>{
        if(data){
          this.declinedOdr=data;
        }
      }
    )
  }

  logout(){
    localStorage.removeItem('logged')
    localStorage.removeItem('type')
    this.router.navigate(['/login'])
  }

  countWater(zakaz:Zakazivanje){
    return zakaz.basta.filter(oblik=>oblik.color ==='#518ded'|| oblik.color=='#3765ad').length
  }

  checkDate(){
    const selectedDate=new Date(this.odrzavanjeDate)
    const startOdmor=new Date(this.firma!.odmorStart)
    const endOdmor=new Date(this.firma!.odmorEnd)
    const currDate=new Date()

    const selectedMonthDay = `${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    const odmorStartMonthDay = `${startOdmor.getMonth()}-${startOdmor.getDate()}`;
    const odmorEndMonthDay = `${endOdmor.getMonth()}-${endOdmor.getDate()}`;
    let vremeOdmora:boolean=false
    if(selectedDate<currDate){
      this.errorString="Vreme mora biti u buducnosti."
      this.odrzavanjeDate=''
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
          this.odrzavanjeDate=''
        }
        else{
          this.errorString=''
        }
      }
  }

  provera6Meseci(zakaz:Zakazivanje){
    let today=new Date()
    let timer=new Date()
    if(zakaz.odrzavanoDatum==''){
       timer=new Date(zakaz.krajDatum)
    }
    else{
       timer=new Date(zakaz.odrzavanoDatum)
    }
    const MsDiff=today.getTime()-timer.getTime()
    const months=MsDiff/(1000*60*60*24*30)
    console.log(months)
    return months>=6

  }

  openModal(zakaz:Zakazivanje){
    this.selectedZakaz=zakaz
    this.modalOpen=true;
    this.firmaServis.getById(this.selectedZakaz.firma).subscribe(data=>{
      this.firma=data;
    })
  }
  
  closeModal(){
    this.odrzavanjeDate=''
    this.selectedZakaz=null
    this.modalOpen=false
  }

  odrzavanje(){
    if(this.selectedZakaz && this.firma){
    let zakazivanje = new Odrzavanje()
    zakazivanje.firma = this.selectedZakaz.firma
    zakazivanje.user = this.selectedZakaz.user

    zakazivanje.datumVreme = this.odrzavanjeDate
    for(let usluga of this.firma.usluge){
      if(usluga.nazivUsluge=='odrzavanje'){
         let usl={
          nazivUsluge:usluga.nazivUsluge,
          cena:usluga.cena
        }
        zakazivanje.uslugeFirme.push(usl)
        break;
      }
    }
    zakazivanje.status = "obrada";
    zakazivanje.zakaz=this.selectedZakaz._id
    zakazivanje.datumVremeTrenutno = new Date().toLocaleString();
    this.zakazivanjeServis.createOdrzavanje(zakazivanje).subscribe(
      data=>
      {
        if(data){
          let currentDate = new Date(this.odrzavanjeDate);
          let sixMonthsLater = new Date(currentDate.setMonth(currentDate.getMonth() + 6));
          this.zakazivanjeServis.updateOdrzavanje(this.selectedZakaz!._id,sixMonthsLater.toLocaleDateString()).subscribe(
            res=>{
              if(res){
                alert("Uspesno!")
                this.closeModal()
                this.ngOnInit()
              }
            } 
          )

        }
      }
    )
    }

    }
}
