import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse, HttpInterceptor, HttpEvent } from "@angular/common/http";




abstract class HttpCache{
    abstract get(req: HttpRequest<any>): HttpResponse<any>|null;
    abstract set(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}

@Injectable()
export class HttpCacheService implements HttpCache {
private cache = {};
    get(req: HttpRequest<any>): HttpResponse<any> | null{
         return this.cache[req.urlWithParams];
    }    
    
    set(req: HttpRequest<any>, resp: HttpResponse<any>): void {
       this.cache[req.urlWithParams] = resp;
    }


}