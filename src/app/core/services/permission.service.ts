import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { Permission, ROLE_PERMISSIONS } from "../models/permission.model";

@Injectable({ providedIn: "root" })
export class PermissionService {
  constructor(private authService: AuthService) {}

  hasPermission(permission: Permission): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        if (!user) return false;
        const permissions = ROLE_PERMISSIONS[user.role];
        return permissions.includes(permission);
      }),
    );
  }

  hasPermissionSync(permission: Permission): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions.includes(permission);
  }
}
