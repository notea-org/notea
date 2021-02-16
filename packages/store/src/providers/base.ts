import { StorePath } from '../path'
import { createCacheHeader } from '../utils'

export interface StoreProviderConfig {
  prefix?: string
}

export abstract class StoreProvider {
  constructor({ prefix }: StoreProviderConfig) {
    this.prefix = prefix
    this.path = new StorePath(prefix)
  }

  prefix?: string

  path: StorePath

  /**
   * 获取签名 URL
   */
  abstract getSignUrl(path: string): Promise<string>

  /**
   * 检测对象是否存在
   */
  abstract hasObject(path: string): Promise<boolean>

  /**
   * 获取对象内容
   * @returns [content, res]
   */
  abstract getObject(path: string, isCompressed?: boolean): Promise<string>

  /**
   * 获取对象 Meta
   * @returns meta
   */
  abstract getObjectMeta(
    path: string
  ): Promise<Record<string, string> | undefined>

  /**
   * 存储对象
   */
  abstract putObject(
    path: string,
    raw: string,
    headers?: Record<string, string>,
    isCompressed?: boolean
  ): Promise<void>

  /**
   * 删除对象
   */
  abstract deleteObject(path: string): Promise<void>

  /**
   * 页面列表
   * - 私有读
   */
  async getList() {
    const content = (await this.getObject(this.path.getPageIndex())) || ''
    const list = content.split(',').filter(Boolean)

    return list
  }

  /**
   * 增加到列表
   */
  async addToList(pageId: string) {
    pageId = pageId.toString()

    const indexPath = this.path.getPageIndex()
    let content = (await this.getObject(indexPath)) || ''
    const ids = content.split(',')

    if (!ids.includes(pageId)) {
      ids.push(pageId)
    }

    content = ids.filter(Boolean).join(',')
    await this.putObject(indexPath, content, {
      ...createCacheHeader(),
    })
  }

  /**
   * 从列表移除
   */
  async removeFromList(pageId: string) {
    const indexPath = this.path.getPageIndex()
    let content = (await this.getObject(indexPath)) || ''
    const ids = content.split(',')

    content = ids.filter((id) => id !== pageId).join(',')
    await this.putObject(indexPath, content, {
      ...createCacheHeader(),
    })
  }
}
