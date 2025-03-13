import { Component, IterableDiffers } from '@angular/core';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { korisnikService } from '../services/korisnik.service';
import { Korisnik } from '../models/Korisnik';

import{Chart,registerables} from 'chart.js'
import { Router } from '@angular/router';

Chart.register(...registerables)

@Component({
  selector: 'app-dekorator-statistika',
  templateUrl: './dekorator-statistika.component.html',
  styleUrls: ['./dekorator-statistika.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

  ]
})
export class DekoratorStatistikaComponent {
  loggedKorisnik:Korisnik=new Korisnik()
  dataMeseci:{mesec:string,broj:number}[]=[]
  dataDnevno:{dan:string,broj:number}[]=[]
  dataDekoratori:{dekorator:string,broj:number}[]=[]
  constructor(private zakazivanjeServis:ZakazivanjeService,private korisnikServis:korisnikService,private router:Router){}
  ngOnInit(){
    let ls=localStorage.getItem("logged")
    if(ls)
    this.korisnikServis.findByUsername(ls).subscribe(
      kor=>{
        if(kor){
          this.loggedKorisnik=kor
          this.zakazivanjeServis.getMonthlyJobsByUser(this.loggedKorisnik.username).subscribe(
              data=>{
                if(data){
                  this.dataMeseci=data
                  this.zakazivanjeServis.getJobsPerWeekday().subscribe(data=>{
                    if(data){
                      this.dataDnevno=data
                      this.zakazivanjeServis.getJobsPerDecoratorInFirma(this.loggedKorisnik.firma!).subscribe(
                        data=>{
                          if(data){
                            this.dataDekoratori=data;
                            this.chartFunkcija();
                          }
  })}})}})}})}

  chartFunkcija(){

    this.createBarChart();
    this.createPieChart();
    this.createHistogram();

  }

  logout(){
    localStorage.removeItem('logged')
    localStorage.removeItem('type')
    this.router.navigate(['/login'])
  }

  createBarChart(){
    const meseci=this.dataMeseci.map(item=>item.mesec)
    const num=this.dataMeseci.map(item=>item.broj)

    new Chart('barChart',{
      type: 'bar',
      data: {
        labels: meseci,
        datasets: [{
          label: 'Broj poslova korisnika po mesecima',
          data: num,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  createPieChart(){
    const dekoratori=this.dataDekoratori.map(item=>item.dekorator)
    const num=this.dataDekoratori.map(item=>item.broj)

    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: dekoratori,
        datasets: [{
          data: num,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display:true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Raspored poslova po dekorateru u firmi'
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw;
              }
            }
          }
        }
      }
    })
  }

  createHistogram(){
    const dani=['Pon','Uto','Sre','Cet','Pet','Sub','Ned']
    const num=this.dataDnevno.map(item=>item.broj)
    new Chart('histogramChart', {
      type: 'bar',
      data: {
        labels: dani,
        datasets: [{
          label: 'Broj poslova po danu nedelje u poslednje 2 godine.',
          data: num,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

}

