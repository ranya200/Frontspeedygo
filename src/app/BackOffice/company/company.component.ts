
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { FooterBackComponent } from "../footer-back/footer-back.component";
import { SidebarBackComponent } from "../sidebar-back/sidebar-back.component";
import { NavbarBackComponent } from "../navbar-back/navbar-back.component";



interface Company {
  id?: string;
  address: string;
  telephone: string;
  email: string;
}

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarBackComponent, NavbarBackComponent, FooterBackComponent],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyList: Company[] = [];
  selectedCompany: Company | null = null;
  newCompany: Company = { address: '', telephone: '', email: '' };
  showAddCompanyModal: boolean = false; // ✅ Controls modal visibility

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe(
      (data) => { this.companyList = data; },
      (error) => { console.error('Error fetching companies:', error); }
    );
  }

  selectCompany(company: Company) {
    this.selectedCompany = { ...company };
  }

  submitCompany() {
    if (!this.newCompany.address || !this.newCompany.telephone || !this.newCompany.email) {
      alert('All fields are required!');
      return;
    }

    this.companyService.addCompany(this.newCompany).subscribe(
      () => {
        this.loadCompanies();
        this.newCompany = { address: '', telephone: '', email: '' }; // ✅ Reset form
        this.showAddCompanyModal = false; // ✅ Close modal after submit
      },
      (error) => { console.error('Error submitting company:', error); }
    );
  }

  updateCompany() {
    if (this.selectedCompany && this.selectedCompany.id) {
      this.companyService.updateCompany(this.selectedCompany.id, this.selectedCompany).subscribe(
        () => { this.loadCompanies(); this.selectedCompany = null; },
        (error) => { console.error('Error updating company:', error); }
      );
    }
  }

  deleteCompany(id?: string) {
    if (!id || id.trim() === '') {
      console.error('Error: Cannot delete company without an ID');
      alert('Error: Company ID is missing!');
      return;
    }

    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(id).subscribe(
        () => { this.loadCompanies(); },
        (error) => { console.error('Error deleting company:', error); }
      );
    }
  }
}
