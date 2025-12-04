import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { GitalkComponent } from '../../components/gitalk/index.component';


@Component({
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzCardModule, GitalkComponent],
  selector: 'app-gitalk-page',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class GitalkPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // 页面初始化时的逻辑
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}