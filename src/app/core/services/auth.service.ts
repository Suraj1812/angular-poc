import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User, Role } from "../models/permission.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [
    {
      id: 1,
      username: "admin@tenant1.com",
      name: "Admin User",
      email: "admin@tenant1.com",
      role: Role.ADMIN,
      tenantId: "tenant1",
    },
    {
      id: 2,
      username: "manager@tenant1.com",
      name: "Manager User",
      email: "manager@tenant1.com",
      role: Role.MANAGER,
      tenantId: "tenant1",
    },
    {
      id: 3,
      username: "viewer@tenant1.com",
      name: "Viewer User",
      email: "viewer@tenant1.com",
      role: Role.VIEWER,
      tenantId: "tenant1",
    },
    {
      id: 4,
      username: "admin@tenant2.com",
      name: "Admin User 2",
      email: "admin@tenant2.com",
      role: Role.ADMIN,
      tenantId: "tenant2",
    },
  ];

  constructor() {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string): User {
    const user = this.users.find((u) => u.username === username);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }
    return null;
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return this.currentUserSubject.value;
  }

  getUsersByTenant(tenantId: string): User[] {
    return this.users.filter((user) => user.tenantId === tenantId);
  }
}
