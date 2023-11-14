import { Component, OnInit, ViewChild } from '@angular/core';
import { CoursesService } from './courses.service';
import { ICourse } from './course.model';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'crs-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'duration', 'rating', 'edit', 'remove'];

  courses!: ICourse[];

  @ViewChild(MatTable)
  table!: MatTable<ICourse>;

  constructor(private dataService: CoursesService, public dialog: MatDialog, private route:ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({ coursesResolver }) => this.courses = coursesResolver);
  };


  deleteData(course: ICourse): void {
    this.courses = this.courses.filter(c => c !== course);
    this.dataService.deleteCourse(course.id).subscribe();
  };

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addCourse(result).subscribe(data => {
          if (data) {
            this.courses.push(data);
            this.table.renderRows();
          }
        })
      }
    })
  }
}