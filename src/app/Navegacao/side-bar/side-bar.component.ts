import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { MatIconButton, MatIconAnchor, MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Authentication/auth.service';
import $ from 'jquery';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatOptionModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  isProfessor: boolean = false;
  isAluno: boolean = false;
  showSidebar: boolean = true;
  isMobile: boolean = false;
  menuExpanded: boolean = false;


  constructor(
    private router: Router,
    private authService: AuthService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.updateNavbarVisibility();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    // Monitora as mudanças de rota
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !(event.url.includes('/login') || event.url.includes('/resetar-senha'));
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  updateNavbarVisibility(): void {
    const userType = this.authService.getUserType();
    this.isProfessor = userType === 'professor';
    this.isAluno = userType === 'aluno';
  }

  ngAfterViewInit(): void {
    this.initializeBlobAnimation();
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('userData'); // Limpa os dados do usuário
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  private initializeBlobAnimation(): void {
    const height = window.innerHeight;
    let x = 0, y = height / 2;

    $(window).on('mousemove', (e) => {
      x = e.pageX;
      y = e.pageY;
    });

    $('.hamburger, .menu-inner').on('mouseenter', () => {
      this.menuExpanded = true;
      $('#menu').addClass('expanded');
    });

    $('.menu-inner').on('mouseleave', () => {
      this.menuExpanded = false;
      $('#menu').removeClass('expanded');
    });
  }


}
