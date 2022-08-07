import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroupDirective,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MyPerformance } from "src/app/utils/performance";

import { MyErrorHandler } from "../../utils/error-handler";
import { InvitationFormService } from "./invitation-form.service";

@Component({
  selector: "app-invitation-form",
  templateUrl: "./invitation-form.component.html",
  styleUrls: ["./invitation-form.component.scss"],
})
export class InvitationFormComponent {
  invitationFormId: string = "";
  invitationFormForm: FormGroup;
  invitationFormToEdit: any;
  isAddModule: boolean = true;
  isLoading: boolean = false;

  filteredPermissionGroupId: Array<any> = [];
  invitationFormBuilder = {
    email: [
      {
        value: null,
        disabled: false,
      },
      [Validators.email, Validators.required],
    ],

    permissionGroupId: [null, [Validators.required]],
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _invitationFormService: InvitationFormService,
    private _errorHandler: MyErrorHandler
  ) {
    try {
      this._activatedRoute.params.subscribe(async (routeParams) => {
        this.invitationFormId = routeParams["id"];
        this.isAddModule = !this.invitationFormId;

        if (this.invitationFormId) {
          this.invitationFormToEdit = await this._invitationFormService.find(
            this.invitationFormId
          );
          this.invitationFormForm.patchValue(this.invitationFormToEdit.data);
        }
        this.checkOptionsCreation([], 0);
      });
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.error.message);
      this.sendErrorMessage(message);
    }

    this.invitationFormForm = this._formBuilder.group(
      this.invitationFormBuilder
    );
  }

  displayFnToPermissionGroupId = (value?: any) => {
    const otherValue = this.invitationFormToEdit?.data?.__permissionGroup
      ? this.invitationFormToEdit.data.__permissionGroup
      : null;
    if (value === otherValue?._id) {
      return otherValue.name;
    }
    return value
      ? this.filteredPermissionGroupId.find((_) => _._id === value)?.name
      : null;
  };
  setFilteredPermissionGroupId = async () => {
    try {
      const paramsToFilter = ["name"];
      if (this.invitationFormForm.value.permissionGroupId.length > 0) {
        const filter = `?filter={"or":[${paramsToFilter.map(
          (element: string) => {
            if (element !== "undefined") {
              return `{"${element}":{"like": "${this.invitationFormForm.value.permissionGroupId}", "options": "i"}}`;
            }
            return "";
          }
        )}]}`;

        this._invitationFormService
          .permissionGroupIdSelectObjectGetAll(filter.replace("},]", "}]"))
          .then((result: any) => {
            this.filteredPermissionGroupId = result.data.result;
            this.isLoading = false;
          })
          .catch(async (err) => {
            if (err.error.logMessage === "jwt expired") {
              await this.refreshToken();
              this.setFilteredPermissionGroupId();
            } else {
              const message = this._errorHandler.apiErrorMessage(
                err.error.message
              );
              this.sendErrorMessage(message);
            }
          });
      }
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.error.message);
      this.sendErrorMessage(message);
    }
  };
  callSetFilteredPermissionGroupId = MyPerformance.debounce(() =>
    this.setFilteredPermissionGroupId()
  );

  invitationFormSubmit = async (
    invitationFormDirective: FormGroupDirective
  ) => {
    this.isLoading = true;

    try {
      if (this.isAddModule) {
        await this._invitationFormService.save(this.invitationFormForm.value);
      }

      if (!this.isAddModule) {
        await this._invitationFormService.update(
          this.invitationFormForm.value,
          this.invitationFormId
        );
      }
      this.redirectTo("main/__invitation");

      this.isLoading = false;
    } catch (error: any) {
      if (error.error.logMessage === "jwt expired") {
        await this.refreshToken();
        this.invitationFormSubmit(invitationFormDirective);
      } else {
        const message = this._errorHandler.apiErrorMessage(error.error.message);
        this.isLoading = false;
        this.sendErrorMessage(message);
      }
    }

    this.invitationFormForm.reset();
    invitationFormDirective.resetForm();
  };
  refreshToken = async () => {
    try {
      const res: any = await this._invitationFormService.refreshToken();
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
  checkOptionsCreation = async (functions: Array<Function>, index: number) => {
    const newIndex = index + 1;

    if (newIndex <= functions.length) {
      await functions[index].call(null);
      this.checkOptionsCreation(functions, newIndex);
    } else {
      this.isLoading = false;
    }
  };
  sendErrorMessage = (errorMessage: string) => {
    this._snackbar.open(errorMessage, undefined, {
      duration: 4 * 1000,
    });
  };
}
