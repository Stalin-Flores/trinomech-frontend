import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialesRoutingModule } from './materiales-routing.module';
import { MaterialesComponent } from './materiales.component';

@NgModule({
  declarations: [MaterialesComponent],
  imports: [CommonModule, RouterModule, MaterialesRoutingModule],
})
export class MaterialesModule {}
