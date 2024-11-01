import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    MatIconButton,
    MatIconAnchor,
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
  showSidebar: boolean = true; // nova variável para controlar a visibilidade da sidebar

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateNavbarVisibility();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    // Verifica a rota atual para definir a visibilidade da sidebar
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !event.url.includes('/login'); // Oculta a sidebar na rota de login
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeBlobAnimation();
  }

  updateNavbarVisibility(): void {
    const userType = this.authService.getUserType();
    this.isProfessor = userType === 'professor';
    this.isAluno = userType === 'aluno';
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
    let curveX = 10, curveY = 0, targetX = 0;
    let xitteration = 0, yitteration = 0;
    let menuExpanded = false;

    const blob = $('#blob');
    const blobPath = $('#blob-path');

    $(window).on('mousemove', (e) => {
      x = e.pageX;
      y = e.pageY;
    });

    $('.hamburger, .menu-inner').on('mouseenter', function() {
      $(this).parent().addClass('expanded');
      menuExpanded = true;
    });

    $('.menu-inner').on('mouseleave', function() {
      menuExpanded = false;
      $(this).parent().removeClass('expanded');
    });
  }
}
