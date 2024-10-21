import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconButton, MatIconAnchor, MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
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
  userSession: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateNavbarVisibility();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // Redireciona para login se não estiver autenticado
    }
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
    const hamburger = $('.hamburger');

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

    const easeOutExpo = (currentIteration: number, startValue: number, changeInValue: number, totalIterations: number): number => {
      return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
    };

    const svgCurve = () => {
      if ((curveX > x - 1) && (curveX < x + 1)) {
        xitteration = 0;
      } else {
        if (menuExpanded) {
          targetX = 0;
        } else {
          xitteration = 0;
          if (x > 150) {
            targetX = 0;
          } else {
            targetX = -(((60 + 20) / 100) * (x - 150));
          }
        }
        xitteration++;
      }

      if ((curveY > y - 1) && (curveY < y + 1)) {
        yitteration = 0;
      } else {
        yitteration++;
      }

      curveX = easeOutExpo(xitteration, curveX, targetX - curveX, 100);
      curveY = easeOutExpo(yitteration, curveY, y - curveY, 100);

      const anchorDistance = 200;
      const curviness = anchorDistance - 40;

      const newCurve2 = `M60,${height}H0V0h60v${(curveY - anchorDistance)}c0,${curviness},${curveX},${curviness},${curveX},${anchorDistance}S60,${curveY},60,${(curveY + (anchorDistance * 2))}V${height}z`;

      blobPath.attr('d', newCurve2);
      blob.width(curveX + 60);
      hamburger.css('transform', `translate(${curveX}px, ${curveY}px)`);
      $('h2').css('transform', `translateY(${curveY}px)`);
      window.requestAnimationFrame(svgCurve);
    };

    window.requestAnimationFrame(svgCurve);
  }
}
