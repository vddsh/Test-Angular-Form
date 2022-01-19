import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  FormArray
} from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  frameworks: string[] = ['angular', 'react', 'vue'];
  versions: any = [];
  frameworkVersions: any = [];
  month: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  private readonly existsEmails = ['test@test.test'];

  personForm: FormGroup;

  constructor(private http: HttpClient) {
    this.personForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      framework: new FormControl(null, [Validators.required]),
      frameworkVersion: new FormControl(null, [Validators.required]),
      hobby: new FormControl(null, [Validators.required]),
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        this.emailValidator()
      )
    });
    this.getVersions().subscribe(data => {
      this.versions = data;
    });
  }

  ngOnInit(): void {}

  private isEmailExist(email: string): Observable<boolean> {
    return of(this.existsEmails.includes(email));
  }

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.isEmailExist(control.value)
        .pipe(delay(2000))
        .pipe(map(exists => (exists ? { emailExists: true } : null)));
  }

  onFrameworkChange() {
    const frameworkControl = this.personForm.get('framework');
    if (frameworkControl)
      this.frameworkVersions = this.versions[frameworkControl.value];
  }
  getVersions(): Observable<any> {
    return this.http.get('./assets/dbversions.json');
  }

  onSubmit(): void {
    console.log(this.personForm.value);
  }
}
