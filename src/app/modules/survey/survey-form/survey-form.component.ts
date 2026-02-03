import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SurveyService } from "../services/survey.service";
import { TenantService } from "../../../core/services/tenant.service";

@Component({
  selector: "app-survey-form",
  templateUrl: "./survey-form.component.html",
  styleUrls: ["./survey-form.component.scss"],
})
export class SurveyFormComponent implements OnInit {
  surveyForm: FormGroup;
  surveyId: number | null = null;
  loading = false;

  questionTypes = [
    { value: "text", label: "Text Input" },
    { value: "single-choice", label: "Single Choice" },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private tenantService: TenantService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.surveyId = +params["id"];
        this.loadSurvey();
      }
    });
  }

  createForm() {
    this.surveyForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      status: ["draft", Validators.required],
      questions: this.fb.array([]),
    });
  }

  get questions(): FormArray {
    return this.surveyForm.get("questions") as FormArray;
  }

  addQuestion() {
    this.questions.push(
      this.fb.group({
        text: ["", Validators.required],
        type: ["text", Validators.required],
        required: [false],
        options: this.fb.array([]),
      }),
    );
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getQuestionOptions(index: number): FormArray {
    return this.questions.at(index).get("options") as FormArray;
  }

  addOption(questionIndex: number) {
    this.getQuestionOptions(questionIndex).push(this.fb.control(""));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.getQuestionOptions(questionIndex).removeAt(optionIndex);
  }

  onQuestionTypeChange(index: number, type: string) {
    if (type === "single-choice") {
      this.addOption(index);
      this.addOption(index);
    } else {
      const optionsArray = this.getQuestionOptions(index);
      while (optionsArray.length) {
        optionsArray.removeAt(0);
      }
    }
  }

  loadSurvey() {
    const tenant = this.tenantService.getCurrentTenant();
    if (this.surveyId && tenant) {
      this.loading = true;
      this.surveyService
        .getSurvey(tenant.id, this.surveyId)
        .subscribe((survey) => {
          if (survey) {
            this.surveyForm.patchValue({
              name: survey.name,
              description: survey.description,
              status: survey.status,
            });

            this.questions.clear();
            survey.questions.forEach((question) => {
              const questionGroup = this.fb.group({
                text: [question.text, Validators.required],
                type: [question.type, Validators.required],
                required: [question.required],
                options: this.fb.array([]),
              });

              if (question.options) {
                question.options.forEach((option) => {
                  (questionGroup.get("options") as FormArray).push(
                    this.fb.control(option),
                  );
                });
              }

              this.questions.push(questionGroup);
            });
          }
          this.loading = false;
        });
    }
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      this.loading = true;
      const tenant = this.tenantService.getCurrentTenant();
      const surveyData = {
        ...this.surveyForm.value,
        tenantId: tenant.id,
        createdDate: new Date(),
        responseCount: 0,
      };

      if (this.surveyId) {
        this.surveyService
          .updateSurvey(tenant.id, this.surveyId, surveyData)
          .subscribe(() => {
            this.navigateToList();
          });
      } else {
        this.surveyService.createSurvey(tenant.id, surveyData).subscribe(() => {
          this.navigateToList();
        });
      }
    }
  }

  navigateToList() {
    const tenant = this.tenantService.getCurrentTenant();
    this.router.navigate([`/t/${tenant.id}/surveys`]);
  }

  cancel() {
    this.navigateToList();
  }
}
