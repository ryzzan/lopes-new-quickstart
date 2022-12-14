import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { PermissionRoutingModule } from "./permission-routing.module";
import { PermissionComponent } from "./permission.component";

import { NgxMaskModule, IConfig } from "ngx-mask";

import { PermissionFormComponent } from "src/app/components/permission-form/permission-form.component";
import { PermissionTableComponent } from "src/app/components/permission-table/permission-table.component";

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    PermissionComponent,
    PermissionFormComponent,
    PermissionTableComponent,
  ],
  imports: [
    CommonModule,
    PermissionRoutingModule,
    NgxMaskModule.forRoot(maskConfig),
    SharedModule,
  ],
})
export class __PermissionGroupModule {}
