import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss']
})
export class RoleSelectionComponent {

  constructor(private router: Router) {}

  selectRole(role: 'applicant' | 'employer'): void {
    localStorage.setItem('userRole', role);

    if (role === 'employer') {
      this.router.navigate(['/applications']); // Employer view
    } else {
      this.router.navigate(['/jobs']); // Applicant view
    }
  }
}
