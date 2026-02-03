import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from "@angular/core";
import { Permission } from "../../core/models/permission.model";
import { PermissionService } from "../../core/services/permission.service";

@Directive({
  selector: "[appHasPermission]",
})
export class HasPermissionDirective implements OnInit {
  private hasView = false;

  @Input() appHasPermission: Permission;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService,
  ) {}

  ngOnInit() {
    const hasPermission = this.permissionService.hasPermissionSync(
      this.appHasPermission,
    );

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
