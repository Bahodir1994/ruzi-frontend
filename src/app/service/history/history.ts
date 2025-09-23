import {Injectable} from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import {ResponseDto} from '../../configuration/resursurls/responseDto';
import {FindResultApiUrl} from '../../configuration/resursurls/apiConfigDto';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from '../../configuration/resursurls/apiConfig.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {
  }

  history_list(id: string, group: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl(group, 'list_history').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.get<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${id}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

}
