import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface Material {
  idMaterial: number;
  nombreMaterial: string;
  tipo: 'Fibra Optica' | 'HFC';
  unidadMedida: string;
  stockMinimo: number;
  stockActual: number;
  ubicacion: string;
  proveedor: string;
  costoUnitario: number;
}

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private http = inject(HttpClient);

  listar(): Observable<Material[]> {
    return this.http.get<Material[]>(`${environment.apiUrl}/materiales`);
  }

  obtenerPorId(id: number): Observable<Material> {
    return this.http.get<Material>(`${environment.apiUrl}/materiales/${id}`);
  }

  actualizar(material: Material): Observable<Material> {
    return this.http.put<Material>(`${environment.apiUrl}/materiales/${material.idMaterial}`, material);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/materiales/${id}`);
  }
}
