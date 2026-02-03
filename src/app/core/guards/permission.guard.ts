import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivate,
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { PermissionService } from "../services/permission.service";
import { Permission } from "../models/permission.model";

@Injectable({
  providedIn: "root",
})
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const routeData = route.data;
    const requiredPermission = routeData
      ? (routeData.permission as Permission)
      : null;

    if (!requiredPermission) {
      return true;
    }

    return this.permissionService.hasPermission(requiredPermission).pipe(
      take(1),
      map((hasPermission) => {
        if (!hasPermission) {
          return this.router.createUrlTree(["/unauthorized"]);
        }
        return true;
      }),
    );
  }
}
