import { useEffect, useState } from "react";
import styles from "./index.module.css";

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  const [shouldRender, setShouldRender] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShouldRender(true);
    } else {
      // 等待动画结束后再卸载组件
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.loadingWrapper} ${!loading ? styles.fadeOut : ""}`}>
      <div className={styles.container}>
        <div className={styles.cube}>
          <div className={styles.sides}>
            <div className={styles.top}></div>
            <div className={styles.bottom}></div>
            <div className={styles.front}></div>
            <div className={styles.back}></div>
            <div className={styles.left}></div>
            <div className={styles.right}></div>
          </div>
        </div>

        <div className={styles.loader}>
          <div data-glitch="Go-Blite..." className={styles.glitch}>
            Go-Blite...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
