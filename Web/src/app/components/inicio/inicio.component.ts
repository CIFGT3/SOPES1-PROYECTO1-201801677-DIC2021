import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { CpuServiceService } from 'src/app/services/cpu-service.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  ejecucion = 0
  suspendidos = 0
  detenidos = 0
  zombie = 0
  ininterrumpido = 0
  desconocido = 0
  total = 0

  listaProcesos: any

  showLista = true
  showArbol = false

  constructor(private cpuService: CpuServiceService) { }

  ngOnInit(): void {
    const obs$ = interval(2000);

    obs$.subscribe((d) => {
      this.getInfo()
    })
    //this.getInfo()
  }


  getInfo(){
    //console.log("Obtiendo informacion principal")
    this.cpuService.getInfo().subscribe((res:any)=>{
      //console.log(res)
      if (res.status == 200) {
        this.ejecucion = res.running
        this.detenidos = res.stopped 
        this.suspendidos = res.sleeping 
        this.ininterrumpido = res.uninterruptible
        this.zombie = res.zombie 
        this.desconocido = res.desconocido 
        this.total = res.total
        this.listaProcesos = res.procesos
        //console.log(this.listaProcesos[0].process)
      }
      
    })
  }

  changeView(){
    this.showLista = this.showArbol
    this.showArbol = !this.showLista
  }
}
