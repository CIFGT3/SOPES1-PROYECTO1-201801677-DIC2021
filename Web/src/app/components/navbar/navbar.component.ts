import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public _router: Router) { }

  ngOnInit(): void {
  }

  goToMemoria(){
    this._router.navigateByUrl('/memoria')
  }

  goToCpu(){
    this._router.navigateByUrl('/cpu')
  }

}
