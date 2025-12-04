import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Gitalk from 'gitalk';
// import 'gitalk/dist/gitalk.css';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-gitalk',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class GitalkComponent implements OnInit {
  private gitalkInstance: any = null;

  constructor() { }

  ngOnInit(): void {
    // 加载Gitalk CSS
    this.loadGitalkCSS();
    
    // 延迟初始化，确保DOM元素已渲染
    setTimeout(() => {
      this.initGitalk();
    }, 100);
  }

  /**
   * 动态加载Gitalk CSS
   */
  private loadGitalkCSS(): void {
    // 检查是否已经加载了Gitalk CSS
    const existingLink = document.querySelector('link[href*="gitalk.css"]');
    if (existingLink) {
      return; // 已经加载，不再重复加载
    }

    // 创建link元素
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/gitalk@1.8.0/dist/gitalk.css';
    
    // 添加到head中
    document.head.appendChild(link);
  }

  /**
   * 初始化Gitalk
   */
  private initGitalk(): void {
    if (!window.location) {
      console.error('window.location不可用，无法初始化Gitalk');
      return;
    }

    const gitalkElement = document.getElementById('gitalk-container');
    if (!gitalkElement) {
      console.error('找不到gitalk-container元素');
      return;
    }

    // 清空容器内容
    gitalkElement.innerHTML = '';

    // 创建新的Gitalk实例
    this.gitalkInstance = new Gitalk({
      clientID: "Ov23liNMtywa7kMkDVxr",
      clientSecret: "3c9026242504903dc3007235717ee324cfe5c9f4",
      repo: "public",
      owner: "s422346963",
      admin: [
        "s422346963",
      ],
      id: window.location.pathname, // 使用当前页面路径作为唯一标识
      distractionFreeMode: false,
      language: 'zh-CN',
      pagerDirection: 'first',
      createIssueManually: false
    });

    // 渲染Gitalk
    this.gitalkInstance.render('gitalk-container');
  }
}