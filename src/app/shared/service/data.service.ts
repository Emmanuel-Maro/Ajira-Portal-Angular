import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DataService {
    private dataSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    getData$(): Observable<any> {
        return this.dataSubject$;
    }

    changeData(data: any) {
        this.dataSubject$.next(data);
    }
}