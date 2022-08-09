import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { RemoveConfirmationDialogComponent } from "../remove-confirmation-dialog/remove-confirmation-dialog.component";
import { MyErrorHandler } from "../../utils/error-handler";
import { InvitationTableService } from "./invitation-table.service";
import { FormBuilder, FormGroupDirective, FormGroup } from "@angular/forms";

@Component({
  selector: "app-invitation-table",
  templateUrl: "./invitation-table.component.html",
  styleUrls: ["./invitation-table.component.scss"],
})
export class InvitationTableComponent {
  invitationTableId: string = "";
  invitationTableDisplayedColumns: string[] = ["email", "undefined"];
  invitationTableDataSource: any = [];
  invitationTableSearchForm: FormGroup;
  isLoading = true;
  // SET PERMISSIONS
  permissionsToCheck = JSON.parse(sessionStorage.getItem("permission")!)[0].modulePermissions;
  updateOnePermission: any;
  deleteOnePermission: any;
  readPermission: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private _errorHandler: MyErrorHandler,
    private _invitationTableService: InvitationTableService
  ) {
    const modulePermissionToCheck: any = this.permissionsToCheck.find((item: any) => item.module.name === "Convites")
    this.updateOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "updateOne").length > 0;
    this.readPermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "read").length > 0;
    this.deleteOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "deleteOne").length > 0;
    this.invitationTableSearchForm = this._formBuilder.group({
      searchInput: [null, []],
    });
    try {
      this._activatedRoute.params.subscribe(async (routeParams) => {
        this.invitationTableId = routeParams["id"];
      });
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.error.message);
      this.sendErrorMessage(message);
    }
    this.setInvitationTableService();
  }

  invitationTableSearch(invitationTableDirective: FormGroupDirective) {
    this.isLoading = true;
    const filter = `?filter={"or":[${this.invitationTableDisplayedColumns.map(
      (element: string) => {
        if (element !== "undefined") {
          return `{"${element}":{"like": "${this.invitationTableSearchForm.value.searchInput}", "options": "i"}}`;
        }
        return "";
      }
    )}]}`;

    this.setInvitationTableService(filter.replace("},]", "}]"));

    this.invitationTableSearchForm.reset();
    invitationTableDirective.resetForm();
  }

  setInvitationTableService = (filter: string = "") => {
    this._invitationTableService
      .getAll(filter)
      .then((result: any) => {
        this.invitationTableDataSource = result.data.result;
        this.isLoading = false;
      })
      .catch(async (err: any) => {
        if (err.error.logMessage === "jwt expired") {
          await this.refreshToken();
          this.setInvitationTableService();
        } else {
          const message = this._errorHandler.apiErrorMessage(err.error.message);
          this.isLoading = false;
          this.sendErrorMessage(message);
        }
      });
  };

  removeConfirmationDialogOpenDialog = (id: string) => {
    const removeConfirmationDialogDialogRef = this._dialog.open(
      RemoveConfirmationDialogComponent,
      { data: { id: id } }
    );
    removeConfirmationDialogDialogRef
      .afterClosed()
      .subscribe(async (res: any) => {
        if (res) {
          try {
            const routeToGo =
              this.invitationTableId !== ""
                ? this._router.url.split(`/${this.invitationTableId}`)[0]
                : this._router.url;
            this.isLoading = true;
            await this._invitationTableService.delete(res.id);
            this.redirectTo(routeToGo);
            this.isLoading = false;
          } catch (error: any) {
            const message = this._errorHandler.apiErrorMessage(
              error.error.message
            );
            this.sendErrorMessage(message);
          }
        }
      });
  };

  refreshToken = async () => {
    try {
      const res: any = await this._invitationTableService.refreshToken();
      if (res) {
        sessionStorage.setItem("token", res?.data.authToken);
        sessionStorage.setItem("refreshToken", res?.data.authRefreshToken);
      }
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.error.message);
      this.isLoading = false;
      this.sendErrorMessage(message);
      sessionStorage.clear();
      this._router.navigate(["/"]);
    }
  };

  redirectTo = (uri: string) => {
    this._router
      .navigateByUrl("/main", { skipLocationChange: true })
      .then(() => {
        this._router.navigate([uri]);
      });
  };

  sendErrorMessage = (errorMessage: string) => {
    this._snackbar.open(errorMessage, undefined, { duration: 4 * 1000 });
  };
}
