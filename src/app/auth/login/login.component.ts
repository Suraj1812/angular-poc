import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = "";

  users = [
    { username: "admin@tenant1.com", label: "Admin (Tenant A)" },
    { username: "manager@tenant1.com", label: "Manager (Tenant A)" },
    { username: "viewer@tenant1.com", label: "Viewer (Tenant A)" },
    { username: "admin@tenant2.com", label: "Admin (Tenant B)" },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const user = this.authService.login(username);

      if (user) {
        this.router.navigate([`/t/${user.tenantId}/surveys`]);
      } else {
        this.errorMessage = "Invalid username";
      }
    }
  }

  quickLogin(username: string) {
    this.loginForm.patchValue({ username });
    this.login();
  }
}
