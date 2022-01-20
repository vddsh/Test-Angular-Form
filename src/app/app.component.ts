import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
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
  readonly frameworks: string[] = ['angular', 'react', 'vue'];
  versions: any = [];
  frameworkVersions: any = [];
  readonly month: any = [
    '1 month',
    '2 month',
    '6 month',
    '1 year',
    '2 years',
    '3 years+'
  ];

  private readonly existsEmails = ['test@test.test'];

  personForm: FormGroup;

  constructor(private http: HttpClient) {
    this.personForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      framework: new FormControl(null, [Validators.required]),
      frameworkVersion: new FormControl(null, [Validators.required]),
      hobby: new FormArray(
        [
          new FormGroup({
            name: new FormControl('football'),
            duration: new FormControl(this.month[0])
          })
        ],
        [Validators.required]
      ),
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
    if (this.personForm.valid) console.log(this.personForm.value);
  }

  get firstName(): FormControl {
    return this.personForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.personForm.get('lastName') as FormControl;
  }

  get dateOfBirth(): FormControl {
    return this.personForm.get('dateOfBirth') as FormControl;
  }

  get framework(): FormControl {
    return this.personForm.get('framework') as FormControl;
  }

  get frameworkVersion(): FormControl {
    return this.personForm.get('frameworkVersion') as FormControl;
  }

  get email(): FormControl {
    return this.personForm.get('email') as FormControl;
  }

  get hobbies(): FormArray {
    return this.personForm.get('hobby') as FormArray;
  }

  newHobby(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, [Validators.required]),
      duration: new FormControl(null, [Validators.required])
    });
  }

  addHobby() {
    this.hobbies.push(this.newHobby());
  }

  removeHobby(idx: number) {
    this.hobbies.removeAt(idx);
  }
}
