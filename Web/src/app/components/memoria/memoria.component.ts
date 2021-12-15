import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { MemoServiceService } from 'src/app/services/memo-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { interval } from 'rxjs'

@Component({
  selector: 'app-memoria',
  templateUrl: './memoria.component.html',
  styleUrls: ['./memoria.component.css']
})
export class MemoriaComponent implements OnInit {

  totalram = 0
  cache = 0
  en_uso = 0
  porcentaje = 0

  data = [{
    name: "RAM",
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
  yAxisLabel: string = '% RAM';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private memoService: MemoServiceService, public _router: Router) { }

  ngOnInit(): void {
    const obs$ = interval(5000);

    obs$.subscribe((d) => {
      this.getRamInfo()
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

  getRamInfo(){
    this.memoService.getRam().subscribe((res:any)=>{
      // calcular memoria utilizada
      // en_uso = total - (free + buffers + cache)
      this.totalram = res.totalram
      console.log(this.totalram, '--', res.freeram, '--', res.cache)
      //this.en_uso = this.totalram - (res.freeram + res.cache)+ res.bufferram
      this.en_uso = this.totalram - res.freeram - res.cache + res.sharedram + res.bufferram
      this.porcentaje = (this.en_uso/this.totalram)*100
      var nuevo = {"name":this.getTime(), "value":this.porcentaje}
      console.log("Insertando nuevo valor: ", nuevo)
      this.data[0].series.push(nuevo)
      this.data = [...this.data]
      //console.log(this.data)
    })
  }

  getTime(){
    var today = new Date()
    return (today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()).toString()
  }

  get single(){
    return this.data
  }
}
