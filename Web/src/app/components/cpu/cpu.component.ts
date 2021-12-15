import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { CpuServiceService } from 'src/app/services/cpu-service.service'; 

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.css']
})
export class CpuComponent implements OnInit {

  constructor(private cpuService: CpuServiceService, public _router: Router) { }

  porcentaje = 0

  data = [{
    name: "CPU",
    series: [
      {
        name:"inicio",
        value:0
      }
    ]
  }]

  view: [number, number] = [900, 400];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Tiempo';
  yAxisLabel: string = '% CPU';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  ngOnInit(): void {
    const obs$ = interval(2500);

    obs$.subscribe((d) => {
      this.getCpuInfo()
    })
  }

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  getCpuInfo(){
    this.cpuService.getInfoGraphic().subscribe((res:any)=>{
      this.porcentaje = Math.trunc((100 - res.porcentaje))
      console.log(this.porcentaje)
      var nuevo = {"name":this.getTime(), "value":this.porcentaje}
      //console.log("Insertando nuevo valor: ", nuevo)
      this.data[0].series.push(nuevo)
      this.data = [...this.data]
      //console.log(this.data)
    })
  }

  getTime(){
    var today = new Date()
    return (today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()).toString()
  }

}
