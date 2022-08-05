import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RelatedUserComponent } from './related-user.component'; const routes: Routes = [{ path: '', component: RelatedUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatedUserRoutingModule { }
