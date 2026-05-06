import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { FaceVerificationComponent } from './features/face-verification/face-verification';
import { DashboardComponent } from './features/dashboard/dashboard';
import { SecurityMeasuresComponent } from './features/security-measures/security-measures';
import { BlockingProcessComponent } from './features/blocking-process/blocking-process';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'face-verification', component: FaceVerificationComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'security-measures', component: SecurityMeasuresComponent },
  { path: 'blocking-process', component: BlockingProcessComponent },
];