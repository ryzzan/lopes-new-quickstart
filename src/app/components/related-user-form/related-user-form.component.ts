import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroupDirective,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MyPerformance } from "src/app/utils/performance";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MyErrorHandler } from "../../utils/error-handler";
import { RelatedUserFormService } from "./related-user-form.service";

@Component({
  selector: "app-related-user-form",
  templateUrl: "./related-user-form.component.html",
  styleUrls: ["./related-user-form.component.scss"],
})
export class RelatedUserFormComponent {
  genderSelectObject = [
    {
      label: "Feminino",
      value: "F",
    },
    {
      label: "Masculino",
      value: "M",
    },
  ];
  relatedUserFormId: string = "";
  relatedUserFormForm: FormGroup;
  relatedUserFormToEdit: any;
  relatedUserFormToEditEdited: any;
  isAddModule: boolean = true;
  isLoading: boolean = false;

  filteredPermissionGroupId: Array<any> = [];

  permissionGroupIdSeparatorKeysCodes: number[] = [ENTER, COMMA];
  chosenPermissionGroupIdView: string[] = [];
  chosenPermissionGroupIdValue: string[] = [];

  @ViewChild("permissionGroupIdInput") permissionGroupIdInput!: ElementRef<
    HTMLInputElement
  >;
  relatedUserFormBuilder = {
    email: [
      {
        value: null,
        disabled: true,
      },
      [Validators.email, Validators.required],
    ],

    name: [
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ],

    gender: [
      {
        value: null,
        disabled: true,
      },
      [],
    ],

    birthday: [
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ],

    uniqueId: [
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ],

    businessName: [
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ],

    permissionGroupId: [[], []],
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _relatedUserFormService: RelatedUserFormService,
    private _errorHandler: MyErrorHandler
  ) {
    try {
      this._activatedRoute.params.subscribe(async (routeParams) => {
        this.relatedUserFormId = routeParams["id"];
        this.isAddModule = !this.relatedUserFormId;

        if (this.relatedUserFormId) {
          this.relatedUserFormToEdit = await this._relatedUserFormService.find(
            this.relatedUserFormId
          );

          if (this.relatedUserFormToEdit.data.person) {
            this.relatedUserFormToEditEdited = {
              email: this.relatedUserFormToEdit.data.email,
              permissionGroups: this.relatedUserFormToEdit.data.permissionGroups,
              name: this.relatedUserFormToEdit.data.person.name,
              gender: this.relatedUserFormToEdit.data.person.gender,
              birthday: this.relatedUserFormToEdit.data.person.birthday,
              uniqueId: this.relatedUserFormToEdit.data.person.uniqueId,
            };
          }

          if (this.relatedUserFormToEdit.data.company) {
            this.relatedUserFormToEditEdited = {
              email: this.relatedUserFormToEdit.data.email,
              permissionGroups: this.relatedUserFormToEdit.data.permissionGroups,
              businesName: this.relatedUserFormToEdit.data.company.businessName,
              uniqueId: this.relatedUserFormToEdit.data.company.uniqueId,
            };
          }

          this.relatedUserFormForm.patchValue(this.relatedUserFormToEditEdited);

          if (this.relatedUserFormToEdit.data.permissionGroup) {
            this.chosenPermissionGroupIdView = [];
            this.chosenPermissionGroupIdValue = [];
            this.relatedUserFormToEdit.data.permissionGroup.forEach(
              (element: any) => {
                this.chosenPermissionGroupIdView.push(element.name);
                this.chosenPermissionGroupIdValue.push(element._id);
              }
            );
          }
        }
        this.checkOptionsCreation([], 0);
      });
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.error.message);
      this.sendErrorMessage(message);
    }

    this.relatedUserFormForm = this._formBuilder.group(
      this.relatedUserFormBuilder
    );
  }

  displayFnToPermissionGroupId = (value?: any) => {
    const otherValue = this.relatedUserFormToEdit?.data?.__permissionGroup
      ? this.relatedUserFormToEdit.data.__permissionGroup
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
      if (this.relatedUserFormForm.value.permissionGroupId.length > 0) {
        const filter = `?filter={"or":[${paramsToFilter.map(
          (element: string) => {
            if (element !== "undefined") {
              return `{"${element}":{"like": "${this.relatedUserFormForm.value.permissionGroupId}", "options": "i"}}`;
            }
            return "";
          }
        )}]}`;

        this._relatedUserFormService
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

  relatedUserFormSubmit = async (
    relatedUserFormDirective: FormGroupDirective
  ) => {
    this.isLoading = true;

    try {
      if (this.isAddModule) {
        await this._relatedUserFormService.save(this.relatedUserFormForm.value);
      }

      if (!this.isAddModule) {
        await this._relatedUserFormService.update(
          this.relatedUserFormForm.value,
          this.relatedUserFormId
        );
      }
      this.redirectTo("main/__related-user");

      this.isLoading = false;
    } catch (error: any) {
      if (error.error.logMessage === "jwt expired") {
        await this.refreshToken();
        this.relatedUserFormSubmit(relatedUserFormDirective);
      } else {
        const message = this._errorHandler.apiErrorMessage(error.error.message);
        this.isLoading = false;
        this.sendErrorMessage(message);
      }
    }

    this.relatedUserFormForm.reset();
    relatedUserFormDirective.resetForm();
  };
  refreshToken = async () => {
    try {
      const res: any = await this._relatedUserFormService.refreshToken();
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
