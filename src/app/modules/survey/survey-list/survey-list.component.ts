import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Survey } from "../../../core/models/survey.model";
import { SurveyService } from "../services/survey.service";
import { TenantService } from "../../../core/services/tenant.service";
import { Permission } from "../../../core/models/permission.model";

@Component({
  selector: "app-survey-list",
  templateUrl: "./survey-list.component.html",
  styleUrls: ["./survey-list.component.scss"],
})
export class SurveyListComponent implements OnInit, OnDestroy {
  surveys: Survey[] = [];
  filteredSurveys: Survey[] = [];
  loading = false;

  searchControl = new FormControl("");
  statusFilter = new FormControl("all");

  currentPage = 1;
  itemsPerPage = 10;

  private destroy$ = new Subject<void>();

  readonly Permission = Permission;

  constructor(
    private surveyService: SurveyService,
    private tenantService: TenantService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadSurveys();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.filterSurveys());

    this.statusFilter.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.filterSurveys());
  }

  loadSurveys() {
    this.loading = true;
    const tenant = this.tenantService.getCurrentTenant();

    if (tenant) {
      this.surveyService
        .getSurveys(tenant.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((surveys) => {
          this.surveys = surveys || [];
          this.filterSurveys();
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  filterSurveys() {
    const searchTerm = (this.searchControl.value || "").toLowerCase();
    const status = this.statusFilter.value;

    this.filteredSurveys = this.surveys.filter((survey) => {
      const matchesSearch = (survey.name || "")
        .toLowerCase()
        .includes(searchTerm);
      const matchesStatus = status === "all" || survey.status === status;
      return matchesSearch && matchesStatus;
    });

    this.currentPage = 1;
  }

  get paginatedSurveys(): Survey[] {
    if (!this.filteredSurveys || this.filteredSurveys.length === 0) {
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = Math.min(
      start + this.itemsPerPage,
      this.filteredSurveys.length,
    );
    return this.filteredSurveys.slice(start, end);
  }

  get totalPages(): number {
    if (!this.filteredSurveys || this.filteredSurveys.length === 0) {
      return 0;
    }
    return Math.ceil(this.filteredSurveys.length / this.itemsPerPage);
  }

  get startIndex(): number {
    if (!this.filteredSurveys || this.filteredSurveys.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    if (!this.filteredSurveys || this.filteredSurveys.length === 0) {
      return 0;
    }
    return Math.min(
      this.currentPage * this.itemsPerPage,
      this.filteredSurveys.length,
    );
  }

  viewSurvey(id: number) {
    const tenant = this.tenantService.getCurrentTenant();
    this.router.navigate([`/t/${tenant.id}/surveys/results`, id]);
  }

  editSurvey(id: number) {
    const tenant = this.tenantService.getCurrentTenant();
    this.router.navigate([`/t/${tenant.id}/surveys/edit`, id]);
  }

  createSurvey() {
    const tenant = this.tenantService.getCurrentTenant();
    this.router.navigate([`/t/${tenant.id}/surveys/create`]);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
