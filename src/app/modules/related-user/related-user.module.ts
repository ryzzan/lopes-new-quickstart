
  
  import { NgModule } from "@angular/core";
  import { CommonModule } from "@angular/common";  
  import { SharedModule } from "../shared/shared.module";
  import { RelatedUserRoutingModule } from "./related-user-routing.module";
  import { RelatedUserComponent } from "./related-user.component";
  
  import {
    NgxMaskModule,
    IConfig
  } from "ngx-mask";
  
  import { RelatedUserFormComponent } from "src/app/components/related-user-form/related-user-form.component";
  
  import { RelatedUserTableComponent } from "src/app/components/related-user-table/related-user-table.component";
  

  const maskConfig: Partial < IConfig > = {
    validation: false,
  };
  
  @NgModule({
    declarations: [
      RelatedUserComponent,
      
  RelatedUserFormComponent,
  
  RelatedUserTableComponent,
  
    ],
    imports: [
      CommonModule,
      RelatedUserRoutingModule,
      NgxMaskModule.forRoot(maskConfig),
      SharedModule,
      
  
  
  
  
  
    ]
  })
  export class __RelatedUserModule { }
  