import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './Authentication/auth.service';
import { SideBarComponent } from './Navegacao/side-bar/side-bar.component';
import { FooterComponent } from "./Navegacao/footer/footer.component";;
import { filter } from 'rxjs';
import { AnalyticsService } from './services/Speed-Insights/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterOutlet, RouterLink, RouterLinkActive, SideBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showFooter = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private analytics: AnalyticsService  // Injetar o serviço
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkFooterVisibility();
        this.analytics.pageView(this.router.url); // Rastrear visualizações de página
      });
  }

  private checkFooterVisibility() {
    const currentRoute = this.router.url;
    this.showFooter = currentRoute.includes('/informacao');
  }

  // METODO VERIFICAR SEURANÇA E LOGIN DO SITE
  public getAuthService(): AuthService {
    return this.authService;
  }
}
