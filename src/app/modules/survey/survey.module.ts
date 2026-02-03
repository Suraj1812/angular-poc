import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { SurveyListComponent } from "./survey-list/survey-list.component";
import { SurveyFormComponent } from "./survey-form/survey-form.component";
import { SurveyResultsComponent } from "./survey-results/survey-results.component";
import { SurveyService } from "./services/survey.service";

const routes = [
  {
    path: "",
    component: SurveyListComponent,
  },
  {
    path: "create",
    component: SurveyFormComponent,
  },
  {
    path: "edit/:id",
    component: SurveyFormComponent,
  },
  {
    path: "results/:id",
    component: SurveyResultsComponent,
  },
];

@NgModule({
  declarations: [
    SurveyListComponent,
    SurveyFormComponent,
    SurveyResultsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [SurveyService],
})
export class SurveyModule {}
