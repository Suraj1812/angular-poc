import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../core/services/auth.service";
import { TenantService } from "../../core/services/tenant.service";
import { Permission } from "../../core/models/permission.model";

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  currentUser: any;
  currentTenant: any;
  permissions = Permission;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tenantService: TenantService,
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.tenantService.setTenantFromRoute(this.route);

    this.subscriptions.add(
      this.tenantService.currentTenant$.subscribe((tenant) => {
        this.currentTenant = tenant;
      }),
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
