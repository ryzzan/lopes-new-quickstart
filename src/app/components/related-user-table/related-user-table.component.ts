import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { RemoveConfirmationDialogComponent } from "../remove-confirmation-dialog/remove-confirmation-dialog.component";
import { MyErrorHandler } from "../../utils/error-handler";
import { RelatedUserTableService } from "./related-user-table.service";
import { FormBuilder, FormGroupDirective, FormGroup } from "@angular/forms";

@Component({
  selector: "app-related-user-table",
  templateUrl: "./related-user-table.component.html",
  styleUrls: ["./related-user-table.component.scss"],
})
export class RelatedUserTableComponent {
  relatedUserTableId: string = "";
  relatedUserTableDisplayedColumns: string[] = ["email", "undefined"];
  relatedUserTableDataSource: any = [];
  relatedUserTableSearchForm: FormGroup;
  isLoading = true;
  // SET PERMISSIONS
  permissionsToCheck = JSON.parse(sessionStorage.getItem("permission")!)[0]
    .modulePermissions;
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
    private _relatedUserTableService: RelatedUserTableService
  ) {
const modulePermissionToCheck: any = this.permissionsToCheck.find((item: any) => item.module.name === "Usuários relacionados")
    this.updateOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "updateOne").length > 0;
    this.readPermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "read").length > 0;
    this.deleteOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "deleteOne").length > 0;
    this.relatedUserTableSearchForm = this._formBuilder.group({
      searchInput: [null, []],
    });
    try {
      this._activatedRoute.params.subscribe(async (routeParams) => {
        this.relatedUserTableId = routeParams["id"];
      });
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.error.message);
      this.sendErrorMessage(message);
    }
    this.setRelatedUserTableService();
  }

  relatedUserTableSearch(relatedUserTableDirective: FormGroupDirective) {
    this.isLoading = true;
    const filter = `?filter={"or":[${this.relatedUserTableDisplayedColumns.map(
      (element: string) => {
        if (element !== "undefined") {
          return `{"${element}":{"like": "${this.relatedUserTableSearchForm.value.searchInput}", "options": "i"}}`;
        }
        return "";
      }
    )}]}`;

    this.setRelatedUserTableService(filter.replace("},]", "}]"));

    this.relatedUserTableSearchForm.reset();
    relatedUserTableDirective.resetForm();
  }

  setRelatedUserTableService = (filter: string = "") => {
    this._relatedUserTableService
      .getAll(filter)
      .then((result: any) => {
        this.relatedUserTableDataSource = result.data.result;
        this.isLoading = false;
      })
      .catch(async (err: any) => {
        if (err.error.logMessage === "jwt expired") {
          await this.refreshToken();
          this.setRelatedUserTableService();
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
              this.relatedUserTableId !== ""
                ? this._router.url.split(`/${this.relatedUserTableId}`)[0]
                : this._router.url;
            this.isLoading = true;
            await this._relatedUserTableService.delete(res.id);
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
      const res: any = await this._relatedUserTableService.refreshToken();
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
