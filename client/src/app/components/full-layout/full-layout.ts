import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,

    // Módulos do Material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './full-layout.html',
  styleUrls: ['./full-layout.scss']
})
export class FullLayoutComponent {

  // Injetando serviços (forma moderna)
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  /**
   * Realiza o logout do usuário e o redireciona para o login.
   */
  logout(): void {
    this.authService.logout();
    this.notificationService.showSuccess('Você foi desconectado.');
    this.router.navigate(['/login']);
  }
}
