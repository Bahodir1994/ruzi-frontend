import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DataTableInput, DataTableOutput} from './datatable-input.model';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatatableService {

  constructor(private http: HttpClient) {
  }

  getData<T>(url: string, input: DataTableInput): Observable<DataTableOutput<T>> {
    let params = new HttpParams()
      .set('draw', input.draw.toString())
      .set('start', input.start.toString())
      .set('length', input.length.toString())
      .set('search.value', input.search.value)
      .set('search.regex', input.search.regex.toString());

    input.columns.forEach((col, index) => {
      params = params
        .set(`columns[${index}].data`, col.data)
        .set(`columns[${index}].name`, col.name)
        .set(`columns[${index}].searchable`, col.searchable.toString())
        .set(`columns[${index}].orderable`, col.orderable.toString())
        .set(`columns[${index}].search.value`, col.search.value)
        .set(`columns[${index}].search.regex`, col.search.regex.toString());
    });

    input.order.forEach((ord, index) => {
      params = params
        .set(`order[${index}].column`, ord.column.toString())
        .set(`order[${index}].dir`, ord.dir);
    });


    return this.http.post<DataTableOutput<T>>(url, input)
      .pipe(
        catchError(error => {
          console.error('Error fetching data', error);
          return throwError(() => new Error('Error fetching data'));
        })
      );
  }

  getDataForCart<TOutput>(url: string, input: DataTableInput): Observable<TOutput> {
    return this.http.post<TOutput>(url, input).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError(() => new Error('Error fetching data'));
      })
    );
  }
}
