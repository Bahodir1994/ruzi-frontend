import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {HttpClient} from '@angular/common/http';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {Observable, switchMap} from 'rxjs';
import {ResponseDto} from '../../../configuration/resursurls/responseDto';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  /* crud */
  create(file: File): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('images', 'create_image').pipe(
      switchMap(value => {
        if (!value) throw new Error('URL не был получен');
        this.moduleUrl = value;

        const formData = new FormData();
        formData.append('multipartFile', file);
        formData.append('idList', JSON.stringify([]));

        return this.http.post<ResponseDto>(
          `${this.moduleUrl.host}${this.moduleUrl.url}`,
          formData
        );
      })
    );
  }

  read(): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('images', 'read_image').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.get<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  update(formData: any) {
    return this.apiConfigService.loadConfigAndGetResultUrl('images', 'patch_image').pipe(
      switchMap(value => {
        if (!value) throw new Error('URL не был получен');
        this.moduleUrl = value;

        return this.http.patch<ResponseDto>(
          `${this.moduleUrl.host}${this.moduleUrl.url}`,
          formData
        );
      })
    );
  }

  delete(data: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('images', 'delete_image').pipe(
      switchMap(value => {
        if (value) {
          if (!value) throw new Error('URL не был получен');
          this.moduleUrl = value;
          return this.http.delete<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, {body: data});
        } else {
          throw new Error('URL topilmadi');
        }
      })
    );
  }

}
