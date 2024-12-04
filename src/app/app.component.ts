import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { GoogleAnalyticsService } from './pages/Utils/google-analytics.service';
import { SharedServices } from './services/sharedServices.shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private googleAnalytics: GoogleAnalyticsService, private sharedServices: SharedServices) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // (<any>window).ga('set', 'page', this.router.url);
      // (<any>window).ga('send', 'pageview');
      this.googleAnalytics.cambioDeRuta(this.router.url);
      this.sharedServices.updateNotifications();
    });
  }

  title = 'YouVet';
}
window.addEventListener("scroll", function () {
  // Obtener el elemento del encabezado
  const header = document.querySelector("header");

  // Agregar o quitar la clase "abajo" según la posición de desplazamiento
  // header.classList.toggle("abajo", window.scrollY > 0);
});