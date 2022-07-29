
  import { HttpClient } from "@angular/common/http";
  import { Injectable } from "@angular/core";

  @Injectable({
  providedIn: "root",
  })
  export class PermissionTableService {
      BASE_URL = "http://localhost:3000";

      constructor(private _httpClient: HttpClient) {}

      
        getAll(filter: string = "") {
          return this._httpClient.get(
            `${this.BASE_URL}/__permission-group${filter}`, {
              headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
              }
            }
          ).toPromise();
        };
        
        delete(id: string) {
          return this._httpClient.delete(
            `${this.BASE_URL}/__permission-group/${id}`,
            {
              headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
              }
            }
          ).toPromise();
        };
        
        find(id: string) {
          return this._httpClient.get(
            `${this.BASE_URL}/__permission-group/${id}`,
            {
              headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
              }
            }
          ).toPromise();
        };
        

      
        refreshToken () {
          return this._httpClient.get(
            `${this.BASE_URL}/auth/refresh-token`, {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
            }
          }
          ).toPromise();
        }
        
  }
  