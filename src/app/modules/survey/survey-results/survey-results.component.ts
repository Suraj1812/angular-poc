import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SurveyService } from "../services/survey.service";
import { TenantService } from "../../../core/services/tenant.service";
import { Survey, Question } from "../../../core/models/survey.model";

@Component({
  selector: "app-survey-results",
  templateUrl: "./survey-results.component.html",
  styleUrls: ["./survey-results.component.scss"],
})
export class SurveyResultsComponent implements OnInit {
  survey: Survey;
  loading = false;

  mockResponses = [
    {
      surveyId: 1,
      userId: 101,
      submittedAt: new Date("2024-01-20"),
      responses: [
        { questionId: 1, answer: "Satisfied" },
        { questionId: 2, answer: "Better communication needed" },
      ],
    },
    {
      surveyId: 1,
      userId: 102,
      submittedAt: new Date("2024-01-21"),
      responses: [
        { questionId: 1, answer: "Very Satisfied" },
        { questionId: 2, answer: "More training sessions" },
      ],
    },
    {
      surveyId: 1,
      userId: 103,
      submittedAt: new Date("2024-01-22"),
      responses: [
        { questionId: 1, answer: "Neutral" },
        { questionId: 2, answer: "Flexible working hours" },
      ],
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private tenantService: TenantService,
  ) {}

  ngOnInit() {
    this.loadSurveyResults();
  }

  loadSurveyResults() {
    this.loading = true;
    const surveyId = +this.route.snapshot.params["id"];
    const tenant = this.tenantService.getCurrentTenant();

    if (tenant) {
      this.surveyService.getSurvey(tenant.id, surveyId).subscribe((survey) => {
        this.survey = survey;
        this.loading = false;
      });
    }
  }

  getQuestionResults(question: Question): any[] {
    if (question.type === "single-choice" && question.options) {
      return question.options.map((option) => {
        const count = this.mockResponses.filter((response) => {
          const answer = response.responses.find(
            (r) => r.questionId === question.id,
          );
          return answer && answer.answer === option;
        }).length;

        return {
          option,
          count,
          percentage:
            this.survey.responseCount > 0
              ? (count / this.survey.responseCount) * 100
              : 0,
        };
      });
    }
    return [];
  }

  getTextResponses(questionId: number): string[] {
    return this.mockResponses
      .map((response) => {
        const answer = response.responses.find(
          (r) => r.questionId === questionId,
        );
        return answer ? answer.answer : null;
      })
      .filter((answer) => answer !== null);
  }

  getCompletionRate(): number {
    return this.survey ? (this.survey.responseCount / 100) * 100 : 0;
  }
}
