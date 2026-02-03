import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PermissionButtonComponent } from "./components/permission-button/permission-button.component";
import { HasPermissionDirective } from "./directives/permission.directive";

@NgModule({
  declarations: [PermissionButtonComponent, HasPermissionDirective],
  imports: [CommonModule],
  exports: [PermissionButtonComponent, HasPermissionDirective],
})
export class SharedModule {}
