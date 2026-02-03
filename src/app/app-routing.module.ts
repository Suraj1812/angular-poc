import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { PermissionGuard } from "./core/guards/permission.guard";
import { Permission } from "./core/models/permission.model";
import { LoginComponent } from "./auth/login/login.component";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { UnauthorizedComponent } from "./shared/components/unauthorized/unauthorized.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "unauthorized", component: UnauthorizedComponent },
  {
    path: "t/:tenantId",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "surveys",
        loadChildren: () =>
          import("./modules/survey/survey.module").then((m) => m.SurveyModule),
        canActivate: [PermissionGuard],
        data: { permission: Permission.SURVEY_VIEW },
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./modules/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: Permission.DASHBOARD_VIEW },
      },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "**", redirectTo: "login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
