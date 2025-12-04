import { Base64 } from 'js-base64';

/**
 * 加密解密工具类
 */
export class CryptoUtil {
  /**
   * Base64加密
   * @param text 需要加密的文本
   * @returns 加密后的Base64字符串
   */
  static encode(text: string): string {
    try {
      return Base64.encode(text);
    } catch (error) {
      console.error('Base64加密失败:', error);
      return '';
    }
  }

  /**
   * Base64解密
   * @param encodedText 需要解密的Base64字符串
   * @returns 解密后的原始文本
   */
  static decode(encodedText: string): string {
    try {
      return Base64.decode(encodedText);
    } catch (error) {
      console.error('Base64解密失败:', error);
      return '';
    }
  }

  /**
   * 简单的XOR加密后再Base64编码
   * @param text 需要加密的文本
   * @param key 加密密钥
   * @returns 加密后的字符串
   */
  static xorEncode(text: string, key: string = 'nav-secret-key'): string {
    try {
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(
          text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return Base64.encode(result);
    } catch (error) {
      console.error('XOR加密失败:', error);
      return '';
    }
  }

  /**
   * Base64解码后再进行XOR解密
   * @param encodedText 需要解密的字符串
   * @param key 解密密钥
   * @returns 解密后的原始文本
   */
  static xorDecode(encodedText: string, key: string = 'nav-secret-key'): string {
    try {
      const decoded = Base64.decode(encodedText);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(
          decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return result;
    } catch (error) {
      console.error('XOR解密失败:', error);
      return '';
    }
  }
}