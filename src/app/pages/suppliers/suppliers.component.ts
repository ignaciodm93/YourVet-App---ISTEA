import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SuppliersService } from 'src/app/services/suppliers.service';

@Component({
  selector: 'suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit, OnDestroy {

  constructor(private suppliersService: SuppliersService,
    private router: Router) { }


  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  public redirect(destination: string): void {
    this.router.navigate(['suppliers/'.concat(destination)]);
  }
}
