import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderService } from 'src/app/components/template/header/header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  teste : string;
  constructor(private headerService: HeaderService,
    private cdref: ChangeDetectorRef) {
    headerService.HeaderData = {
      title: 'Início',
      icone: 'home',
      routeUrl: '/home'
    }
   }

  ngOnInit(): void {
 
  }

  ngAfterViewInit(){
    this.cdref.detectChanges();
  }


}
