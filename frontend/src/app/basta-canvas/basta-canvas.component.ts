import { Component, EventEmitter, Output } from '@angular/core';
import { oblik } from '../models/oblik';
@Component({
  selector: 'app-basta-canvas',
  templateUrl: './basta-canvas.component.html',
  styleUrls: ['./basta-canvas.component.css']
})
export class BastaCanvasComponent {
  @Output() changeOblik=new EventEmitter<oblik[]>()

  canvas:HTMLCanvasElement|undefined;
  ctx: CanvasRenderingContext2D|undefined|null;
  allOblik:oblik[]=[]
  selectedOblik:string|null=null;
  selectedOption:string|null=null;
  selectedColor:string="#000000"
  selectedSize:number=0;
  rotation:boolean=true;
  constructor(){}
  ngAfterViewInit(){
    this.canvas=document.getElementById('bastaCanvas') as HTMLCanvasElement
    this.ctx=this.canvas.getContext('2d')

  }

  undo(){
    this.allOblik.pop()
    this.reDrawCanvas()
    this.changeOblik.emit(this.allOblik)
  }

  onFileSelected(event:any){
    const file=event.target.files[0]
    if(file){
      const ext=file.name
      if(ext.endsWith('.json')){
        console.log("OK")
        const reader=new FileReader()

        reader.onload=()=>{
          try{
          const jsonObl=JSON.parse(reader.result as string)
          console.log(jsonObl)
          this.allOblik=jsonObl;
          console.log(this.allOblik)
          this.reDrawCanvas()
        }catch(error){
          console.error(error)
        }
      }
      reader.readAsText(file);

      }
    }
  }

  onOblikChange(oblik:string){
    this.selectedOption=oblik
    if(oblik=='zelenilo'){
      this.selectedColor="#2c855d"
      this.selectedSize=50
      this.selectedOblik="kvadrat"
      return;
    }
    if(oblik=='bazen'){
      this.selectedColor="#518ded"
      this.selectedSize=150
      this.selectedOblik="pravougaonik"
      return
    }
    if(oblik=='fontana'){
      this.selectedColor="#3765ad"
      this.selectedSize=50
      this.selectedOblik="krug"

      return
    }
    if(oblik=='sto'){
      this.selectedColor="#a85511"
      this.selectedSize=25
      this.selectedOblik="krug"

      return
    }
    if(oblik=='stolice'){
      this.selectedColor="#8a7f76"
      this.selectedSize=50
      this.selectedOblik="pravougaonik"

      return
    }
  }
  ponisti(){
    this.selectedOblik=''
    this.reDrawCanvas();
  }

  drawOblik(figura:oblik){
    if(this.ctx){
      this.ctx.fillStyle=figura.color
      if(figura.tip=='kvadrat'){
        this.ctx.fillRect(figura.x, figura.y, figura.stranica!, figura.stranica!);
      }
      else if(figura.tip=='pravougaonik'){
        this.ctx.fillRect(figura.x, figura.y, figura.sirina!, figura.visina!);
      }
      else if(figura.tip=='krug'){
        this.ctx.beginPath();
        this.ctx.arc(figura.x, figura.y, figura.pprecnik!, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }
  }

  reDrawCanvas(){
    if(this.ctx){
      this.ctx.clearRect(0,0,this.canvas!.width,this.canvas!.height)
      this.allOblik.forEach(oblikk=>this.drawOblik(oblikk))
    }
  }

  onMouseClick(event:MouseEvent){
    if(this.selectedOblik && this.ctx){
      const cnvs=this.canvas!.getBoundingClientRect()
      const xcoord=event.offsetX
      const ycoord=event.offsetY
      let oblik:oblik
      if(this.selectedOblik=='kvadrat'){
        if(xcoord<this.selectedSize/2 || ycoord<this.selectedSize/2 || xcoord+this.selectedSize/2>cnvs.width || ycoord+this.selectedSize/2>cnvs.height){return}
        oblik={tip:'kvadrat',x:xcoord-this.selectedSize/2,y:ycoord-this.selectedSize/2,stranica:this.selectedSize,color:this.selectedColor}
      }
      else if(this.selectedOblik=='pravougaonik'){
        if(!this.rotation){
        if(xcoord<this.selectedSize||ycoord<this.selectedSize/2||xcoord+this.selectedSize>cnvs.width||ycoord+this.selectedSize/2>cnvs.height){return}
        oblik={tip:"pravougaonik",x:xcoord-this.selectedSize,y:ycoord-this.selectedSize/2,sirina:this.selectedSize*2,visina:this.selectedSize,color:this.selectedColor}
        }
        else{
          if(xcoord<this.selectedSize/2||ycoord<this.selectedSize||xcoord+this.selectedSize/2>cnvs.width||ycoord+this.selectedSize>cnvs.height){return}
        oblik={tip:"pravougaonik",x:xcoord-this.selectedSize/2,y:ycoord-this.selectedSize,sirina:this.selectedSize,visina:this.selectedSize*2,color:this.selectedColor}
        }
      }
      else if(this.selectedOblik=='krug'){
        if(xcoord<this.selectedSize||ycoord<this.selectedSize || xcoord+this.selectedSize>cnvs.width || ycoord+ this.selectedSize >cnvs.height){return}
        oblik={tip:'krug',x:xcoord,y:ycoord,pprecnik:this.selectedSize,color:this.selectedColor}
      }
      else
        return;

      if(this.noOverlap(oblik)){
        this.allOblik.push(oblik)
        this.drawOblik(oblik)
        this.changeOblik.emit(this.allOblik)
      }
      else{
      }
    }
  }
  

  noOverlap(oblik:oblik){
    for(const obj of this.allOblik){
      if(this.collides(obj,oblik))
        return false;
    }
    return true;
  }

    shapeChecks:Record<string,(a:oblik,b:oblik)=>boolean> = {
    'krug-krug': (a:oblik, b:oblik) => this.checkKrugKrugCollide(a, b),
    'pravougaonik-pravougaonik': (a:oblik, b:oblik) => this.checkPravougaonikPravougaonikCollide(a, b),
    'kvadrat-kvadrat': (a:oblik, b:oblik) => this.checkKvadratKvadratCollide(a, b),
    'krug-pravougaonik': (a:oblik, b:oblik) => this.checkPravougaonikKrugCollide(b,a),
    'pravougaonik-krug': (a:oblik, b:oblik) => this.checkPravougaonikKrugCollide(a,b),
    'krug-kvadrat': (a:oblik, b:oblik) => this.checkKvadratKrugCollide(b,a),
    'kvadrat-krug': (a:oblik, b:oblik) => this.checkKvadratKrugCollide(a,b),
    'pravougaonik-kvadrat': (a:oblik, b:oblik) => this.checkKvadratPravougaonikCollide(b,a),
    'kvadrat-pravougaonik': (a:oblik, b:oblik) => this.checkKvadratPravougaonikCollide(a,b)
  };
  
    shapePairs = [
    ['krug', 'krug'],
    ['pravougaonik', 'pravougaonik'],
    ['kvadrat', 'kvadrat'],
    ['krug', 'pravougaonik'],
    ['pravougaonik', 'krug'],
    ['krug', 'kvadrat'],
    ['kvadrat', 'krug'],
    ['pravougaonik', 'kvadrat'],
    ['kvadrat', 'pravougaonik']
  ];

  collides(o1:oblik,o2:oblik):boolean{
    const f1=o1.tip
    const f2=o2.tip
    const key=`${f1}-${f2}`
    if(key in this.shapeChecks){
      return this.shapeChecks[key](o1,o2);
    }
    console.error("KAKO BRATE");
    return true;
  }

  checkKrugKrugCollide(o1:oblik,o2:oblik):boolean{
    const dx = Math.abs(o1.x - o2.x);
    const dy = Math.abs(o1.y - o2.y);
    const radiusSum = o1.pprecnik! + o2.pprecnik!;

  return dx <= radiusSum && dy <= radiusSum;
  }

  checkKvadratKvadratCollide(kvadrat1: oblik, kvadrat2: oblik): boolean {
    const dx = Math.abs(kvadrat1.x - kvadrat2.x);
    const dy = Math.abs(kvadrat1.y - kvadrat2.y);
    
    const halfSide1 = kvadrat1.stranica! ;
    const halfSide2 = kvadrat2.stranica! ;
  
    return dx <= halfSide1 && dy <= halfSide1 || 
           dx <= halfSide2 && dy <= halfSide2;
  }

  checkPravougaonikPravougaonikCollide(pravougaonik1: oblik, pravougaonik2: oblik): boolean {
    if (
      pravougaonik1.x < pravougaonik2.x + pravougaonik2.sirina! &&
      pravougaonik1.x + pravougaonik1.sirina! > pravougaonik2.x &&
      pravougaonik1.y < pravougaonik2.y + pravougaonik2.visina! &&
      pravougaonik1.y + pravougaonik1.visina! > pravougaonik2.y
    ){
      return true
    }
  
    return false
  }

  checkKvadratPravougaonikCollide(kvadrat: oblik, pravougaonik: oblik): boolean {
   if(kvadrat.x<pravougaonik.x+pravougaonik.sirina! && 
      kvadrat.x+kvadrat.stranica!>pravougaonik.x &&
      kvadrat.y<pravougaonik.y + pravougaonik.visina! &&
      kvadrat.y+kvadrat.stranica!>pravougaonik.y)
      {
        return true
      }
    return false;
  }

  checkKvadratKrugCollide(kvadrat: oblik, krug: oblik): boolean {
    const dx = Math.abs(krug.x-kvadrat.x -kvadrat.stranica!/2);
    const dy = Math.abs(krug.y-kvadrat.y -kvadrat.stranica!/2);
  
    if(dx>(kvadrat.stranica!/2+krug.pprecnik!)) return false;
    if(dy>(kvadrat.stranica!/2+krug.pprecnik!)) return false;

    if(dx<kvadrat.stranica!/2) return true;
    if(dy<kvadrat.stranica!/2) return true;

    const ds=dx-kvadrat.stranica!/2
    const dv=dx-kvadrat.stranica!/2
    return (ds*ds+dv*dv)<=(krug.pprecnik!*krug.pprecnik!)
  }

   checkPravougaonikKrugCollide(pravougaonik: oblik, krug: oblik): boolean {
    const dx = Math.abs(krug.x-pravougaonik.x -pravougaonik.sirina!/2);
    const dy = Math.abs(krug.y-pravougaonik.y -pravougaonik.visina!/2);
  
    if(dx>(pravougaonik.sirina!/2+krug.pprecnik!)) return false;
    if(dy>(pravougaonik.visina!/2+krug.pprecnik!)) return false;

    if(dx<pravougaonik.sirina!/2) return true;
    if(dy<pravougaonik.visina!/2) return true;

    const ds=dx-pravougaonik.sirina!/2
    const dv=dx-pravougaonik.visina!/2
    return ((ds*ds+dv*dv))>(krug.pprecnik!*krug.pprecnik!)
  }

  flipRotation(){
    this.rotation=!this.rotation
  }

  onMouseMove(event: MouseEvent): void {
    if (this.selectedOblik && this.ctx) {
      const x = event.offsetX 
      const y = event.offsetY 

      this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
      this.allOblik.forEach(obl => this.drawOblik(obl));

      this.ctx.fillStyle = this.selectedColor;
      if (this.selectedOblik === 'kvadrat') {
        this.ctx.fillRect(x - this.selectedSize / 2, y - this.selectedSize / 2, this.selectedSize, this.selectedSize);
      } else if (this.selectedOblik === 'pravougaonik') {
        if(!this.rotation)
        this.ctx.fillRect(x - this.selectedSize, y - this.selectedSize / 2, this.selectedSize * 2, this.selectedSize);
        else
        this.ctx.fillRect(x - this.selectedSize/2, y - this.selectedSize, this.selectedSize , this.selectedSize*2);

        }
       else if (this.selectedOblik === 'krug') {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.selectedSize , 0, 2 * Math.PI);
        this.ctx.fill();
       }
      }
    }
}

