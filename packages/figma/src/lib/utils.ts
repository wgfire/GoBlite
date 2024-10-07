import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateSHA256Hash(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export function deepCloneWithEnumerableProperties(obj: SectionNode | PageNode): SectionNode | PageNode {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const clone: SectionNode = Object.create(Object.getPrototypeOf(obj));

  // 获取对象的所有属性，包括不可枚举属性
  const allProps = new Set<string>();
  let currentObj = obj;
  while (currentObj && currentObj !== Object.prototype) {
    Object.getOwnPropertyNames(currentObj).forEach(prop => allProps.add(prop));
    currentObj = Object.getPrototypeOf(currentObj);
  }

  allProps.forEach(prop => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
      // 将属性复制到新的对象中，并将其设置为可枚举
      Object.defineProperty(clone, prop, {
        //@@ts-expect-error ts类型有误
        value: deepCloneWithEnumerableProperties(
          (obj as unknown as Record<string, unknown>)[prop] as SectionNode | PageNode
        ),
        enumerable: true, // 设置为可枚举
        configurable: descriptor.configurable,
        writable: descriptor.writable
      });
    }
  });

  return clone;
}
