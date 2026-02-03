import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { TenantService } from "../services/tenant.service";

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private tenantService: TenantService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const tenant = this.tenantService.getCurrentTenant();

    if (tenant && request.url.includes("/api/")) {
      const modifiedUrl = request.url.replace("/api/", `/api/${tenant.id}/`);
      const modifiedRequest = request.clone({ url: modifiedUrl });
      return next.handle(modifiedRequest);
    }

    return next.handle(request);
  }
}
