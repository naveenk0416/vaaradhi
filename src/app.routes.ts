
import { Routes } from '@angular/router';
import { DiscoverPageComponent } from './components/discover-page/discover-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { ForgotPasswordPageComponent } from './components/forgot-password-page/forgot-password-page.component';
import { ChatPageComponent } from './components/chat-page/chat-page.component';
import { InterestedPageComponent } from './components/interested-page/interested-page.component';
import { PaymentPageComponent } from './components/payment-page/payment-page.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminLoginPageComponent } from './components/admin/admin-login-page/admin-login-page.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminProfileListComponent } from './components/admin/admin-profile-list/admin-profile-list.component';
import { AdminProfileFormComponent } from './components/admin/admin-profile-form/admin-profile-form.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // User-facing routes
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'forgot-password', component: ForgotPasswordPageComponent },
  { path: 'discover', component: DiscoverPageComponent },
  { path: 'interested', component: InterestedPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'profile/edit', component: ProfilePageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: 'payment', component: PaymentPageComponent },
  
  // Admin routes
  { path: 'admin/login', component: AdminLoginPageComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'profiles', component: AdminProfileListComponent },
      { path: 'profiles/new', component: AdminProfileFormComponent },
      { path: 'profiles/edit/:id', component: AdminProfileFormComponent },
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];