import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Permission } from "../../../core/models/permission.model";
import { PermissionService } from "../../../core/services/permission.service";

@Component({
  selector: "app-permission-button",
  template: `
    <button
      *ngIf="hasPermission$ | async"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [ngClass]="btnClass"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class PermissionButtonComponent implements OnInit {
  @Input() permission: Permission;
  @Input() disabled = false;
  @Input() btnClass = "btn btn-primary";
  @Output() onClick = new EventEmitter();

  hasPermission$: Observable<boolean>;

  constructor(private permissionService: PermissionService) {}

  ngOnInit() {
    this.hasPermission$ = this.permissionService.hasPermission(this.permission);
  }
}
