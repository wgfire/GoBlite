import { useState, useEffect, useRef, useCallback } from "react";
/**
 * 倒计时 Hook，根据传入的时间字符串计算倒计时
 * @param endTimeStr 结束时间，可以是日期字符串、时间戳或 Date 对象
 * @returns 包含天、小时、分钟、秒和是否结束的对象
 */
export function useDateSubtr(endTimeStr) {
  // 状态定义
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [isEnd, setIsEnd] = useState(false);
  // 使用 useRef 存储定时器 ID，确保在组件卸载时可以清除
  const timerRef = useRef(null);
  // 将 endTimeStr 转换为 Date 对象
  const getEndTime = useCallback(() => {
    try {
      return typeof endTimeStr === "string"
        ? new Date(endTimeStr)
        : endTimeStr instanceof Date
          ? endTimeStr
          : new Date(endTimeStr);
    } catch (error) {
      console.error("Invalid date format:", endTimeStr, error);
      return new Date(); // 返回当前时间作为默认值
    }
  }, [endTimeStr]);
  // 格式化数字为两位数
  const padZero = num => String(num).padStart(2, "0");
  // 计算时间差异
  const calculateDifference = useCallback(() => {
    // 获取结束时间
    const endTime = getEndTime();
    // 当前时间
    const now = new Date();
    // 计算时间差（毫秒）
    const diff = endTime.getTime() - now.getTime();
    // 如果时间差小于等于 0，表示倒计时结束
    if (diff <= 0) {
      setIsEnd(true);
      setDays(0);
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    // 更新倒计时状态
    setIsEnd(false);
    setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
    setHours(padZero(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))));
    setMinutes(padZero(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))));
    setSeconds(padZero(Math.floor((diff % (1000 * 60)) / 1000)));
  }, [getEndTime]);
  // 使用 useEffect 设置定时器
  useEffect(() => {
    // 清除之前的定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // 只有当有效的结束时间时才启动倒计时
    if (endTimeStr) {
      try {
        // 立即计算一次
        calculateDifference();
        // 设置定时器，每秒更新一次
        timerRef.current = setInterval(calculateDifference, 1000);
      } catch (error) {
        console.error("Error in countdown calculation:", error);
        setIsEnd(true);
      }
      // 清理函数，组件卸载时清除定时器
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [endTimeStr, calculateDifference]); // 依赖项：当结束时间变化时重新设置定时器
  // 返回倒计时数据
  return { days, hours, minutes, seconds, isEnd };
}
