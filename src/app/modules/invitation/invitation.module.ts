
  
  import { NgModule } from "@angular/core";
  import { CommonModule } from "@angular/common";  
  import { SharedModule } from "../shared/shared.module";
  import { InvitationRoutingModule } from "./invitation-routing.module";
  import { InvitationComponent } from "./invitation.component";
  
  import {
    NgxMaskModule,
    IConfig
  } from "ngx-mask";
  
  import { InvitationFormComponent } from "src/app/components/invitation-form/invitation-form.component";
  
  import { InvitationTableComponent } from "src/app/components/invitation-table/invitation-table.component";
  

  const maskConfig: Partial < IConfig > = {
    validation: false,
  };
  
  @NgModule({
    declarations: [
      InvitationComponent,
      
  InvitationFormComponent,
  
  InvitationTableComponent,
  
    ],
    imports: [
      CommonModule,
      InvitationRoutingModule,
      NgxMaskModule.forRoot(maskConfig),
      SharedModule,
      
  
  
  
  
  
    ]
  })
  export class InvitationModule { }
  