import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { Material, MaterialService } from './services/material.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  private auth = inject(AuthService);
  private materials = inject(MaterialService);
  private router = inject(Router);

  user = this.auth.user;

  loading = signal(true);
  errorMsg = signal<string | null>(null);
  materiales = signal<Material[]>([]);

  totalMateriales = computed(() => this.materiales().length);

  totalStock = computed(() =>
    this.materiales().reduce((acc, m) => acc + (m.stockActual ?? 0), 0)
  );

  stockBajo = computed(() =>
    this.materiales().filter((m) => (m.stockActual ?? 0) < (m.stockMinimo ?? 0)).length
  );

  ngOnInit(): void {
    this.materials.listar().subscribe({
      next: (data) => {
        this.materiales.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('No se pudieron cargar los materiales');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }

  goTo(path: string): void {
    this.router.navigate([path]).catch(() => {
      alert(`Modulo "${path}" en construccion`);
    });
  }
}
