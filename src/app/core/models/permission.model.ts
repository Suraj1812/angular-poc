export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  VIEWER = "viewer",
}

export enum Permission {
  SURVEY_VIEW = "SURVEY_VIEW",
  SURVEY_EDIT = "SURVEY_EDIT",
  SURVEY_RESULTS_VIEW = "SURVEY_RESULTS_VIEW",
  DASHBOARD_VIEW = "DASHBOARD_VIEW",
  DASHBOARD_EXPORT = "DASHBOARD_EXPORT",
}

export interface User {
  id: number;
  username: string;
  role: Role;
  tenantId: string;
  name: string;
  email: string;
}

export interface Tenant {
  id: string;
  name: string;
  description: string;
}

export const ROLE_PERMISSIONS = {
  [Role.ADMIN]: [
    Permission.SURVEY_VIEW,
    Permission.SURVEY_EDIT,
    Permission.SURVEY_RESULTS_VIEW,
    Permission.DASHBOARD_VIEW,
    Permission.DASHBOARD_EXPORT,
  ],
  [Role.MANAGER]: [
    Permission.SURVEY_VIEW,
    Permission.SURVEY_EDIT,
    Permission.DASHBOARD_VIEW,
  ],
  [Role.VIEWER]: [Permission.SURVEY_VIEW, Permission.DASHBOARD_VIEW],
};
