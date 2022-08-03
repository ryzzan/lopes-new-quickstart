import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PermissionFormService {
  BASE_URL = "http://localhost:3000";

  constructor(private _httpClient: HttpClient) {}

  getAll(filter: string = "") {
    return this._httpClient
      .get(`${this.BASE_URL}/__permission-groups${filter}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .toPromise();
  }

  delete(id: string) {
    return this._httpClient
      .delete(`${this.BASE_URL}/__permission-groups/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .toPromise();
  }

  save(body: any) {
    return this._httpClient
      .post(`${this.BASE_URL}/__permission-groups`, body, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .toPromise();
  }

  update(body: any, id: string) {
    return this._httpClient
      .put(`${this.BASE_URL}/__permission-groups/${id}`, body, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .toPromise();
  }

  find(id: string) {
    return this._httpClient
      .get(`${this.BASE_URL}/__permission-groups/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .toPromise();
  }

  moduleIdSelectObjectGetAll() {
    return this._httpClient
      .get(`${this.BASE_URL}/__modules`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .toPromise();
  }
  permissionsSelectObjectGetAll() {
    return this._httpClient
      .get(`${this.BASE_URL}/__permission-actions`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .toPromise();
  }

  refreshToken() {
    return this._httpClient
      .get(`${this.BASE_URL}/auth/refresh-token`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("refreshToken")}`,
        },
      })
      .toPromise();
  }
}
