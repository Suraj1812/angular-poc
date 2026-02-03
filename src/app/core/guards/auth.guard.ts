import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivate,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
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
    const user = this.authService.getCurrentUser();

    if (!user) {
      return this.router.createUrlTree(["/login"]);
    }

    let tenantId = null;
    let currentRoute: ActivatedRouteSnapshot | null = route;

    while (currentRoute) {
      if (currentRoute.params && currentRoute.params["tenantId"]) {
        tenantId = currentRoute.params["tenantId"];
        break;
      }
      currentRoute = currentRoute.parent;
    }

    if (tenantId && user.tenantId !== tenantId) {
      return this.router.createUrlTree([`/t/${user.tenantId}/surveys`]);
    }

    return true;
  }
}
