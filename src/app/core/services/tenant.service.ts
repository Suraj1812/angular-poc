import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Tenant } from "../models/permission.model";

@Injectable({ providedIn: "root" })
export class TenantService {
  private currentTenantSubject = new BehaviorSubject<Tenant>(null);
  currentTenant$ = this.currentTenantSubject.asObservable();

  private tenants: Tenant[] = [
    { id: "tenant1", name: "Tenant A", description: "First Tenant" },
    { id: "tenant2", name: "Tenant B", description: "Second Tenant" },
    { id: "tenant3", name: "Tenant C", description: "Third Tenant" },
  ];

  setTenantFromRoute(route: ActivatedRoute): void {
    route.params.subscribe((params) => {
      const tenantId = params["tenantId"];
      if (tenantId) {
        const tenant = this.tenants.find((t) => t.id === tenantId);
        if (tenant) {
          this.currentTenantSubject.next(tenant);
        }
      }
    });
  }

  getCurrentTenant(): Tenant {
    return this.currentTenantSubject.value;
  }

  getAllTenants(): Tenant[] {
    return this.tenants;
  }

  navigateToTenant(tenantId: string, route: string = "surveys"): void {
    this.router.navigate([`/t/${tenantId}/${route}`]);
  }

  constructor(private router: Router) {}
}
