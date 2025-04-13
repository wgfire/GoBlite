/**
 * 存储适配器
 * 提供不同存储方式的统一接口
 */

import { StorageProvider } from "@core/ai/types";
import { STORAGE_KEYS } from "../../constants";

/**
 * 存储适配器接口
 */
export interface StorageAdapter {
  /**
   * 获取数据
   * @param key 键
   * @returns 值
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * 设置数据
   * @param key 键
   * @param value 值
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * 删除数据
   * @param key 键
   */
  remove(key: string): Promise<void>;

  /**
   * 清空所有数据
   */
  clear(): Promise<void>;
}

/**
 * 本地存储适配器
 * 使用localStorage存储数据
 */
export class LocalStorageAdapter implements StorageAdapter {
  /**
   * 获取数据
   * @param key 键
   * @returns 值
   */
  public async get<T>(key: string): Promise<T | null> {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`获取localStorage数据失败: ${error}`);
      return null;
    }
  }

  /**
   * 设置数据
   * @param key 键
   * @param value 值
   */
  public async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`设置localStorage数据失败: ${error}`);
    }
  }

  /**
   * 删除数据
   * @param key 键
   */
  public async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`删除localStorage数据失败: ${error}`);
    }
  }

  /**
   * 清空所有数据
   */
  public async clear(): Promise<void> {
    try {
      // 只清除AI相关的数据
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error(`清空localStorage失败: ${error}`);
    }
  }
}

/**
 * IndexedDB存储适配器
 * 使用IndexedDB存储数据
 * 注意：这是一个简化的实现，实际使用时可能需要更复杂的逻辑
 */
export class IndexedDBAdapter implements StorageAdapter {
  private dbName = "ai_storage";
  private storeName = "ai_data";
  private db: IDBDatabase | null = null;

  /**
   * 构造函数
   */
  constructor() {
    this.initDB();
  }

  /**
   * 初始化数据库
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error("初始化IndexedDB失败:", event);
        reject(new Error("初始化IndexedDB失败"));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "key" });
        }
      };
    });
  }

  /**
   * 获取数据
   * @param key 键
   * @returns 值
   */
  public async get<T>(key: string): Promise<T | null> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };

      request.onerror = () => {
        console.error(`获取IndexedDB数据失败: ${key}`);
        resolve(null);
      };
    });
  }

  /**
   * 设置数据
   * @param key 键
   * @param value 值
   */
  public async set<T>(key: string, value: T): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ key, value });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error(`设置IndexedDB数据失败: ${key}`, event);
        reject(new Error("设置数据失败"));
      };
    });
  }

  /**
   * 删除数据
   * @param key 键
   */
  public async remove(key: string): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error(`删除IndexedDB数据失败: ${key}`, event);
        reject(new Error("删除数据失败"));
      };
    });
  }

  /**
   * 清空所有数据
   */
  public async clear(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      // 只清除AI相关的数据
      Object.values(STORAGE_KEYS).forEach((key) => {
        store.delete(key);
      });

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event) => {
        console.error("清空IndexedDB失败:", event);
        reject(new Error("清空数据失败"));
      };
    });
  }
}

/**
 * 自定义存储适配器
 * 使用内存存储数据，不持久化
 */
export class CustomStorageAdapter implements StorageAdapter {
  private storage: Map<string, any> = new Map();

  /**
   * 获取数据
   * @param key 键
   * @returns 值
   */
  public async get<T>(key: string): Promise<T | null> {
    return this.storage.has(key) ? this.storage.get(key) : null;
  }

  /**
   * 设置数据
   * @param key 键
   * @param value 值
   */
  public async set<T>(key: string, value: T): Promise<void> {
    this.storage.set(key, value);
  }

  /**
   * 删除数据
   * @param key 键
   */
  public async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }

  /**
   * 清空所有数据
   */
  public async clear(): Promise<void> {
    this.storage.clear();
  }
}

/**
 * 创建存储适配器
 * @param provider 存储提供商
 * @returns 存储适配器
 */
export function createStorageAdapter(provider: StorageProvider): StorageAdapter {
  switch (provider) {
    case StorageProvider.LOCAL_STORAGE:
      return new LocalStorageAdapter();
    case StorageProvider.INDEXED_DB:
      return new IndexedDBAdapter();
    case StorageProvider.CUSTOM:
      return new CustomStorageAdapter();
    default:
      return new LocalStorageAdapter();
  }
}

export default createStorageAdapter;
