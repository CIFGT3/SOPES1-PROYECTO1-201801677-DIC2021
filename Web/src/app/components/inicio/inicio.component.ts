import { Component, OnInit } from '@angular/core';
import { interval, BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { CpuServiceService } from 'src/app/services/cpu-service.service';

import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';


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

  // arbol de procesos
  nestedTreeControl: NestedTreeControl<any>
  nestedDataSource: MatTreeNestedDataSource<any>
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  constructor(private cpuService: CpuServiceService) { 
    this.nestedTreeControl = new NestedTreeControl<any>(this._getHijos);
    this.nestedDataSource = new MatTreeNestedDataSource()

    this.dataChange.subscribe(data => this.nestedDataSource.data = data)

  }

  private _getHijos = (node: any) => {return observableOf(node.hijos); } 

  hasNestedChild = (_: number, nodeData:any) => {
    //console.log(nodeData.hijos)
    if (nodeData.hijos == undefined){
      return false
    }
    return true}

  ngOnInit(): void {
    const obs$ = interval(2000);

    obs$.subscribe((d) => {
      this.getInfo()
    })
    //this.dataChange.next(arreglo)
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
        if(this.showArbol){
          this.dataChange.next(this.listaProcesos)
        }
        //console.log(this.listaProcesos[0].process)
      }
      
    })
  }

  changeView(){
    this.showLista = this.showArbol
    this.showArbol = !this.showLista
  }
}
