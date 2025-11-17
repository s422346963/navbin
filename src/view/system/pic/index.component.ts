// 开源项目，未经作者同意，不得以抄袭/复制源代码。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, ViewChild, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { $t } from 'src/locale'
import { createImageFile, getCDN, getImageRepo } from 'src/api'

// 定义图片文件接口
interface ImageFile {
  file: File
  name: string
  size: number
  url: string
}

// 定义上传结果接口
interface UploadedImage {
  name: string
  url: string
}

@Component({
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule],
  selector: 'system-pic',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemPicComponent {
  readonly $t = $t
  
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>
  
  // 当前预览图片
  previewImage: ImageFile | null = null
  
  // 已上传图片
  uploadedImage: UploadedImage | null = null
  
  // 是否正在拖拽
  isDragOver = false
  
  // 是否正在上传
  isUploading = false
  
  // 最大文件大小 (10MB)
  readonly maxFileSize = 10 * 1024 * 1024
  
  // 支持的图片类型
  readonly supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  constructor(private notification: NzNotificationService) {}

  /**
   * 选择文件
   */
  selectFile(): void {
    this.fileInput.nativeElement.click()
  }

  /**
   * 处理文件选择
   */
  handleFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      // 只取第一个文件
      this.processFile(target.files[0])
      // 清空input值，以便可以重复选择同一文件
      target.value = ''
    }
  }

  /**
   * 处理拖拽进入
   */
  handleDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = true
  }

  /**
   * 处理拖拽离开
   */
  handleDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = false
  }

  /**
   * 处理拖拽放下
   */
  handleDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = false
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      // 只取第一个文件
      this.processFile(event.dataTransfer.files[0])
    }
  }

  /**
   * 处理单个文件
   */
  processFile(file: File): void {
    // 验证文件类型
    if (!this.supportedTypes.includes(file.type)) {
      this.notification.error('错误', `文件 "${file.name}" 不是支持的图片格式`)
      return
    }
    
    // 验证文件大小
    if (file.size > this.maxFileSize) {
      this.notification.error('错误', `文件 "${file.name}" 超过 10MB 大小限制`)
      return
    }
    
    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        this.previewImage = {
          file,
          name: file.name,
          size: file.size,
          url: e.target.result as string
        }
      }
    }
    reader.readAsDataURL(file)
  }

  /**
   * 移除当前图片
   */
  removeImage(): void {
    this.previewImage = null
  }

  /**
   * 重置上传状态
   */
  resetUpload(): void {
    this.previewImage = null
    this.uploadedImage = null
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B'
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB'
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }
  }

  /**
   * 上传图片
   */
  async uploadImage(): Promise<void> {
    if (!this.previewImage) {
      this.notification.warning('警告', '请先选择要上传的图片')
      return
    }
    
    this.isUploading = true
    
    try {
      // 调用上传API函数
      const uploadedUrl = await this.uploadImageApi(this.previewImage.file)
      
      // 设置已上传图片信息
      this.uploadedImage = {
        name: this.previewImage.name,
        url: uploadedUrl
      }
      
      // 清空预览
      this.previewImage = null
      
      // 显示成功通知
      this.notification.success('成功', '图片上传成功')
    } catch (error) {
      console.error('上传失败:', error)
      this.notification.error('错误', '图片上传失败，请重试')
    } finally {
      this.isUploading = false
    }
  }

  /**
   * 上传单个图片的API函数
   * 返回图片的绝对路径
   */
  private async uploadImageApi(file: File): Promise<string> {
    try {
      // 生成唯一的文件名，保留原始扩展名
      const fileExtension = file.name.split('.').pop() || 'jpg'
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const fileName = `images/${timestamp}.${fileExtension}`
      
      // 将文件转换为 base64
      const base64Content = await this.fileToBase64(file)
      
      // 使用 createImageFile 函数上传图片
      await createImageFile({
        branch: getImageRepo().branch,
        message: 'create image',
        content: base64Content,
        path: fileName,
        isEncode: false // 文件已经是 base64 格式，不需要再次编码
      })
      
      // 返回图片的 CDN URL
      return getCDN(fileName)
    } catch (error) {
      console.error('上传图片失败:', error)
      throw new Error('图片上传失败，请重试')
    }
  }

  /**
   * 将文件转换为 base64 格式
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // 移除 data:image/...;base64, 前缀，只保留 base64 数据
        const base64Data = result.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * 复制URL到剪贴板
   */
  copyUrl(url: string): void {
    // 创建一个临时的textarea元素
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    
    try {
      // 执行复制命令
      const successful = document.execCommand('copy')
      if (successful) {
        this.notification.success('成功', '链接已复制到剪贴板')
      } else {
        this.notification.error('错误', '复制失败，请手动复制')
      }
    } catch (err) {
      console.error('复制失败:', err)
      this.notification.error('错误', '复制失败，请手动复制')
    }
    
    // 移除临时元素
    document.body.removeChild(textarea)
  }
}