import { Component, OnInit, Input } from '@angular/core';

import { CpuServiceService } from 'src/app/services/cpu-service.service';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit {

  @Input() proceso: any
  id:any
  constructor(private cpuService: CpuServiceService) { }

  ngOnInit(): void {
    //this.id = this.proceso.pid
    this.id = 0
  }

  killProcess(){
    this.cpuService.kill(this.proceso.pid).subscribe((res:any)=>{
      if(res.status == 200){
        alert("Proceso eliminado correctamente")
      }else{
        alert("No se pudo eliminar el proceso")
      }
    })
  }

}
