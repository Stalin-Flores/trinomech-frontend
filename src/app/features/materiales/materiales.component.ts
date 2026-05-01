import { Component, OnInit, computed, inject, signal } from '@angular/core';
import Swal from 'sweetalert2';

import { Material, MaterialService } from '../dashboard/services/material.service';

@Component({
  selector: 'app-materiales',
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <div class="border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 py-3 text-xs text-slate-500 flex items-center gap-2">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            TrinoMech
          </span>
          <span>/</span>
          <span class="text-slate-900 font-medium">Materiales</span>
          <span>/</span>
          <span>Gestión del inventario</span>
        </div>
      </div>

      <header class="border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
        <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              Gestión de materiales
            </div>
            <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Materiales registrados</h1>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="cargarMateriales()"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-3-6.7" />
                <path d="M21 3v6h-6" />
              </svg>
              Recargar
            </button>

            <a
              routerLink="/dashboard"
              class="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Volver al dashboard
            </a>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 py-6 pb-10">
        @if (loading()) {
          <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 flex items-center gap-3 shadow-sm">
            <span class="w-8 h-8 rounded-full bg-cyan-500/15 text-cyan-600 flex items-center justify-center animate-pulse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-3-6.7" />
              </svg>
            </span>
            Cargando materiales...
          </div>
        }

        @if (errorMsg()) {
          <div class="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {{ errorMsg() }}
          </div>
        }

        <section class="rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.10)] overflow-hidden">
          <div class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between bg-slate-50/90">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Planes de material</h2>
              <p class="text-sm text-slate-500">Búsqueda, filtros y acciones en una vista limpia y compacta.</p>
            </div>

            <div class="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
              <label class="relative w-full lg:w-[320px]">
                <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="search"
                  [value]="searchQuery()"
                  (input)="onSearch(($any($event.target)).value)"
                  placeholder="Buscar por material, proveedor o ubicación..."
                  class="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                />
              </label>

              <div class="flex items-center gap-2">
                <select
                  [value]="tipoFiltro()"
                  (change)="onFiltroTipo(($any($event.target)).value)"
                  class="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/10"
                >
                  <option value="Todos">Todos</option>
                  <option value="Fibra Optica">Fibra Optica</option>
                  <option value="HFC">HFC</option>
                </select>

                <button
                  type="button"
                  (click)="limpiarFiltros()"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                  </svg>
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto bg-white">
            @if (materialesPaginados().length === 0) {
              <div class="px-6 py-16 text-center text-slate-500 bg-white">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 7h18" /><path d="M5 7l1 14h12l1-14" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 7V4h6v3" />
                  </svg>
                </div>
                <p class="text-sm font-medium text-slate-900">No se encontraron materiales con esos filtros.</p>
                <p class="mt-1 text-sm text-slate-500">Prueba limpiando la búsqueda o cambiando el tipo.</p>
              </div>
            } @else {
              <table class="min-w-[1180px] w-full text-sm bg-white">
                <thead class="sticky top-0 z-10 bg-slate-50 text-slate-600">
                  <tr class="text-left text-[11px] uppercase tracking-[0.2em]">
                    <th class="px-5 py-4 border-b border-slate-200">Nombre</th>
                    <th class="px-5 py-4 border-b border-slate-200">Tipo</th>
                    <th class="px-5 py-4 border-b border-slate-200">Unidad</th>
                    <th class="px-5 py-4 border-b border-slate-200">Stock actual</th>
                    <th class="px-5 py-4 border-b border-slate-200">Stock minimo</th>
                    <th class="px-5 py-4 border-b border-slate-200">Ubicación</th>
                    <th class="px-5 py-4 border-b border-slate-200">Proveedor</th>
                    <th class="px-5 py-4 border-b border-slate-200">Costo unitario</th>
                    <th class="px-5 py-4 border-b border-slate-200 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                  @for (m of materialesPaginados(); track m.idMaterial) {
                    <tr class="group transition-colors hover:bg-slate-50">
                      <td class="px-5 py-4">
                        <div class="flex flex-col gap-0.5">
                          <span class="whitespace-nowrap font-medium text-slate-900 group-hover:text-cyan-700 transition-colors">{{ m.nombreMaterial }}</span>
                        </div>
                      </td>
                      <td class="px-5 py-4 text-slate-700">
                        <span
                          [ngClass]="m.tipo === 'Fibra Optica' ? 'bg-cyan-100 text-cyan-700' : 'bg-violet-100 text-violet-700'"
                          class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide bg-slate-100 text-slate-700"
                        >
                          {{ m.tipo }}
                        </span>
                      </td>
                      <td class="px-5 py-4 text-slate-700">{{ m.unidadMedida }}</td>
                      <td class="px-5 py-4 text-slate-900">{{ m.stockActual }}</td>
                      <td class="px-5 py-4 text-slate-700">{{ m.stockMinimo }}</td>
                      <td class="px-5 py-4 text-slate-700">{{ m.ubicacion }}</td>
                      <td class="px-5 py-4 text-slate-700">{{ m.proveedor }}</td>
                      <td class="px-5 py-4 text-slate-900 font-medium">S/ {{ m.costoUnitario | number:'1.2-2' }}</td>
                      <td class="px-5 py-4">
                        <div class="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            (click)="verMaterial(m)"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 transition hover:bg-cyan-500 hover:text-white shadow-sm"
                            aria-label="Ver material"
                            title="Ver"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            (click)="abrirEdicion(m)"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 transition hover:bg-amber-500 hover:text-white shadow-sm"
                            aria-label="Editar material"
                            title="Editar"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            (click)="confirmarEliminar(m)"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700 transition hover:bg-rose-500 hover:text-white shadow-sm"
                            aria-label="Eliminar material"
                            title="Eliminar"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200 bg-gradient-to-r from-slate-50 via-white to-cyan-50/40 px-5 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-600 shadow-sm">
              <span class="h-2 w-2 rounded-full bg-cyan-500"></span>
              Mostrando {{ totalRegistrosPaginaInicio() }} - {{ totalRegistrosPaginaFin() }} de {{ materialesFiltrados().length }} resultados
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
              <label class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Mostrar por página</span>
                <select
                  [value]="pageSize()"
                  (change)="cambiarTamanoPagina(($any($event.target)).value)"
                  class="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                >
                  <option [value]="4">4</option>
                  <option [value]="10">10</option>
                  <option [value]="20">20</option>
                </select>
              </label>

              <div class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <button
                  type="button"
                  (click)="paginaAnterior()"
                  [disabled]="paginaActual() === 1"
                  class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Anterior
                </button>
                <span class="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3.5 py-2 font-semibold text-cyan-700 shadow-sm">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Página {{ paginaActual() }} de {{ totalPaginas() }}
                </span>
                <button
                  type="button"
                  (click)="paginaSiguiente()"
                  [disabled]="paginaActual() === totalPaginas()"
                  class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                >
                  Siguiente
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        @if (selectedMaterial()) {
          <section class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-md">
            <div class="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(2,6,23,0.18)]">
              <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Detalle del material</p>
                  <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ selectedMaterial()!.nombreMaterial }}</h2>
                </div>
                <button
                  type="button"
                  (click)="cerrarDetalle()"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                  aria-label="Cerrar detalle"
                  title="Cerrar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 gap-3 p-6 md:grid-cols-2 text-sm text-slate-600">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div class="text-xs uppercase tracking-wider text-slate-500">Tipo</div>
                  <div class="mt-1 font-semibold text-slate-900">{{ selectedMaterial()!.tipo }}</div>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div class="text-xs uppercase tracking-wider text-slate-500">Unidad</div>
                  <div class="mt-1 font-semibold text-slate-900">{{ selectedMaterial()!.unidadMedida }}</div>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div class="text-xs uppercase tracking-wider text-slate-500">Stock actual</div>
                  <div class="mt-1 font-semibold text-slate-900">{{ selectedMaterial()!.stockActual }}</div>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div class="text-xs uppercase tracking-wider text-slate-500">Costo unitario</div>
                  <div class="mt-1 font-semibold text-slate-900">S/ {{ selectedMaterial()!.costoUnitario | number:'1.2-2' }}</div>
                </div>
              </div>
            </div>
          </section>
        }

        @if (editingMaterial(); as materialEdit) {
          <section class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-md">
            <div class="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(2,6,23,0.18)]">
              <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/90">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Editar material</p>
                  <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ materialEdit.nombreMaterial }}</h2>
                </div>
                <button
                  type="button"
                  (click)="cancelarEdicion()"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                  aria-label="Cerrar edición"
                  title="Cerrar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 gap-4 p-6 text-sm md:grid-cols-2">
                <label class="grid gap-1.5">
                  <span class="font-medium text-slate-700">Nombre</span>
                  <input #nombreEdit class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" [value]="materialEdit.nombreMaterial" />
                </label>

                <label class="grid gap-1.5">
                  <span class="font-medium text-slate-700">Tipo</span>
                  <select #tipoEdit class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10">
                    <option value="Fibra Optica" [selected]="materialEdit.tipo === 'Fibra Optica'">Fibra Optica</option>
                    <option value="HFC" [selected]="materialEdit.tipo === 'HFC'">HFC</option>
                  </select>
                </label>

                <label class="grid gap-1.5">
                  <span class="font-medium text-slate-700">Unidad</span>
                  <input #unidadEdit class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" [value]="materialEdit.unidadMedida" />
                </label>

                <label class="grid gap-1.5">
                  <span class="font-medium text-slate-700">Stock minimo</span>
                  <input #stockMinimoEdit type="number" class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" [value]="materialEdit.stockMinimo" />
                </label>

                <label class="grid gap-1.5">
                  <span class="font-medium text-slate-700">Stock actual</span>
                  <input #stockActualEdit type="number" class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" [value]="materialEdit.stockActual" />
                </label>

                <label class="grid gap-1.5">
                  <span class="font-medium text-slate-700">Costo unitario</span>
                  <input #costoUnitarioEdit type="number" step="0.01" class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" [value]="materialEdit.costoUnitario" />
                </label>

                <label class="grid gap-1.5 md:col-span-2">
                  <span class="font-medium text-slate-700">Ubicacion</span>
                  <input #ubicacionEdit class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" [value]="materialEdit.ubicacion" />
                </label>

                <label class="grid gap-1.5 md:col-span-2">
                  <span class="font-medium text-slate-700">Proveedor</span>
                  <input #proveedorEdit class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-cyan-400/40 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" [value]="materialEdit.proveedor" />
                </label>
              </div>

              <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  (click)="cancelarEdicion()"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  (click)="guardarEdicion(nombreEdit.value, tipoEdit.value, unidadEdit.value, stockMinimoEdit.value, stockActualEdit.value, costoUnitarioEdit.value, ubicacionEdit.value, proveedorEdit.value)"
                  class="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-400"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </section>
        }
      </main>
    </div>
  `,
})
export class MaterialesComponent implements OnInit {
  private materialService = inject(MaterialService);

  loading = signal(true);
  errorMsg = signal<string | null>(null);
  materiales = signal<Material[]>([]);
  selectedMaterial = signal<Material | null>(null);
  editingMaterial = signal<Material | null>(null);
  searchQuery = signal('');
  tipoFiltro = signal<'Todos' | 'Fibra Optica' | 'HFC'>('Todos');
  paginaActual = signal(1);
  pageSize = signal(10);

  totalMateriales = computed(() => this.materiales().length);

  materialesFiltrados = computed(() => {
    const term = this.searchQuery().trim().toLowerCase();
    const tipo = this.tipoFiltro();

    return this.materiales().filter((material) => {
      const coincideTipo = tipo === 'Todos' || material.tipo === tipo;
      const haystack = [
        material.nombreMaterial,
        material.tipo,
        material.unidadMedida,
        material.ubicacion,
        material.proveedor,
        String(material.stockActual),
        String(material.stockMinimo),
        String(material.costoUnitario),
      ]
        .join(' ')
        .toLowerCase();

      return coincideTipo && (!term || haystack.includes(term));
    });
  });

  totalPaginas = computed(() => Math.max(1, Math.ceil(this.materialesFiltrados().length / this.pageSize())));

  materialesPaginados = computed(() => {
    const start = (this.paginaActual() - 1) * this.pageSize();
    return this.materialesFiltrados().slice(start, start + this.pageSize());
  });

  totalRegistrosPaginaInicio = computed(() => {
    if (this.materialesFiltrados().length === 0) {
      return 0;
    }

    return (this.paginaActual() - 1) * this.pageSize() + 1;
  });

  totalRegistrosPaginaFin = computed(() => {
    return Math.min(this.paginaActual() * this.pageSize(), this.materialesFiltrados().length);
  });

  materialesStockBajo = computed(() =>
    this.materiales().filter((material) => (material.stockActual ?? 0) < (material.stockMinimo ?? 0)).length
  );

  valorInventario = computed(() =>
    this.materiales().reduce((total, material) => total + (material.costoUnitario ?? 0) * (material.stockActual ?? 0), 0)
  );

  ngOnInit(): void {
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.sincronizarMateriales({ resetVista: true, mostrarCarga: true });
  }

  private sincronizarMateriales(opciones: { resetVista?: boolean; mostrarCarga?: boolean } = {}): void {
    const { resetVista = false, mostrarCarga = false } = opciones;

    if (mostrarCarga) {
      this.loading.set(true);
    }

    this.errorMsg.set(null);

    this.materialService.listar().subscribe({
      next: (data) => {
        this.materiales.set(data ?? []);
        this.selectedMaterial.set(null);
        this.editingMaterial.set(null);
        if (resetVista) {
          this.searchQuery.set('');
          this.tipoFiltro.set('Todos');
          this.paginaActual.set(1);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('No se pudo listar materiales desde el backend.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.paginaActual.set(1);
  }

  onFiltroTipo(value: string): void {
    this.tipoFiltro.set(value as 'Todos' | 'Fibra Optica' | 'HFC');
    this.paginaActual.set(1);
  }

  limpiarFiltros(): void {
    this.searchQuery.set('');
    this.tipoFiltro.set('Todos');
    this.paginaActual.set(1);
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 1) {
      this.paginaActual.set(this.paginaActual() - 1);
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.set(this.paginaActual() + 1);
    }
  }

  cambiarTamanoPagina(value: string): void {
    const nuevoTamano = Number(value);

    if (![4, 10, 20].includes(nuevoTamano)) {
      return;
    }

    this.pageSize.set(nuevoTamano);
    this.paginaActual.set(1);
  }

  verMaterial(material: Material): void {
    this.selectedMaterial.set(material);
  }

  cerrarDetalle(): void {
    this.selectedMaterial.set(null);
  }

  abrirEdicion(material: Material): void {
    this.editingMaterial.set({ ...material });
  }

  cancelarEdicion(): void {
    this.editingMaterial.set(null);
  }

  guardarEdicion(
    nombreMaterial: string,
    tipo: string,
    unidadMedida: string,
    stockMinimo: string,
    stockActual: string,
    costoUnitario: string,
    ubicacion: string,
    proveedor: string,
  ): void {
    const material = this.editingMaterial();

    if (!material) {
      return;
    }

    const payload: Material = {
      ...material,
      nombreMaterial: nombreMaterial.trim(),
      tipo: tipo as Material['tipo'],
      unidadMedida: unidadMedida.trim(),
      stockMinimo: Number(stockMinimo),
      stockActual: Number(stockActual),
      costoUnitario: Number(costoUnitario),
      ubicacion: ubicacion.trim(),
      proveedor: proveedor.trim(),
    };

    if ([payload.stockMinimo, payload.stockActual, payload.costoUnitario].some((value) => Number.isNaN(value))) {
      this.errorMsg.set('Revisa los valores numéricos antes de guardar.');
      return;
    }

    this.errorMsg.set(null);

    this.materialService.actualizar(payload).subscribe({
      next: (updated) => {
        Swal.fire({
          title: '¡Guardado!',
          text: `${payload.nombreMaterial} ha sido actualizado.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        this.sincronizarMateriales();
        this.editingMaterial.set(null);
        this.selectedMaterial.set(null);
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el material.',
          icon: 'error',
        });
        this.errorMsg.set('No se pudo actualizar el material.');
        console.error(err);
      },
    });
  }

  confirmarEliminar(material: Material): void {
    Swal.fire({
      title: '¿Eliminar material?',
      html: `¿Estás seguro de eliminar <strong>${material.nombreMaterial}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.errorMsg.set(null);

      this.materialService.eliminar(material.idMaterial).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Eliminado!',
            text: `${material.nombreMaterial} ha sido eliminado.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          this.sincronizarMateriales();
          if (this.selectedMaterial()?.idMaterial === material.idMaterial) {
            this.selectedMaterial.set(null);
          }

          if (this.editingMaterial()?.idMaterial === material.idMaterial) {
            this.editingMaterial.set(null);
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el material.',
            icon: 'error',
          });
          this.errorMsg.set('No se pudo eliminar el material.');
          console.error(err);
        },
      });
    });
  }
}
