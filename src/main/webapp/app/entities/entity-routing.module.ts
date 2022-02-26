import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'institute',
        data: { pageTitle: 'Institutes' },
        loadChildren: () => import('./institute/institute.module').then(m => m.InstituteModule),
      },
      {
        path: 'tracker',
        data: { pageTitle: 'Trackers' },
        loadChildren: () => import('./tracker/tracker.module').then(m => m.TrackerModule),
      },
      {
        path: 'student',
        data: { pageTitle: 'Students' },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      },
      {
        path: 'teacher',
        data: { pageTitle: 'Teachers' },
        loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
