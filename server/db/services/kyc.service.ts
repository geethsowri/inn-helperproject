import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KycService {
  private apiUrl = 'http://localhost:5000/api/kyc'; // backend endpoint

  constructor(private http: HttpClient) {}

  uploadKyc(data: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('idType', data.idType);
    formData.append('idNumber', data.idNumber);
    formData.append('document', file);

    return this.http.post(this.apiUrl, formData, {
      headers: new HttpHeaders({}),
    });
  }
}
