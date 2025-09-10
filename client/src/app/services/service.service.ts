import { Injectable,signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  sharedNumber = signal<number>(1);

  private helperFunctionCall = new ReplaySubject<any>(1);

  helperFunctionCall$ = this.helperFunctionCall.asObservable();

  triggerHelpersFunction(arg: any) {
    this.helperFunctionCall.next(arg);
  }

  clearHelperFunctionTrigger() {
    this.helperFunctionCall = new ReplaySubject<any>(1);
    this.helperFunctionCall$ = this.helperFunctionCall.asObservable();
  }


  constructor(private http:HttpClient) { }

  addHelper(data: any) {
    return this.http.post('http://localhost:3002/add-helper', data)
  }

  display() {
    return this.http.get('http://localhost:3002/display');
  }

  incrementNumber() {
    this.sharedNumber.update(value => value+1);
  }

  decrementNumber() {
    this.sharedNumber.update(value => value-1);
  }

  getHelperById(id: string) {
    return this.http.get(`http://localhost:3002/getdetails/${id}`);
  }

  updateHelper(id: string, data: any) {
    return this.http.put(`http://localhost:3002/updatedetails/${id}`, data);
  }

  deleteHelper(id: string) {
    return this.http.delete(`http://localhost:3002/delete/${id}`);
  }

  get_empId(): Observable<string> {
    return this.http.get('http://localhost:3002/generate-unique-id', { responseType: 'text' });
  }

  downloadfunc(data: any): Observable<Blob> {
    return this.http.post('http://localhost:3002/download', data, {
      responseType: 'blob'
    });
  }
}
