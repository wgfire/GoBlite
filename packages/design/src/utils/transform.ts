/**
 * 解析 CSS transform 矩阵字符串，提取平移部分和非平移部分
 * @param transformString CSS transform 字符串
 * @returns 包含平移值和非平移矩阵的对象
 */
export const parseCSSTransformMatrix = (
  transformString: string | null
): { x: number; y: number; remainingMatrix: string } => {
  if (!transformString || transformString === "none") {
    return { x: 0, y: 0, remainingMatrix: "none" };
  }

  try {
    const matrix = new DOMMatrix(transformString);
    const tx = matrix.e;
    const ty = matrix.f;

    // 创建一个新的矩阵，仅包含非平移部分 (旋转, 缩放, 倾斜)
    const remaining = new DOMMatrix([matrix.a, matrix.b, matrix.c, matrix.d, 0, 0]);

    return { x: tx, y: ty, remainingMatrix: remaining.toString() };
  } catch (error) {
    console.warn("使用 DOMMatrix 解析 transform 字符串失败，尝试使用基础的正则表达式回退: ", error);
    // 针对 "matrix(...)" 格式的基础回退方案
    const matrixRegex =
      /matrix\(\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*\)/;
    const match = transformString.match(matrixRegex);
    if (match) {
      const values = match.slice(1).map(parseFloat);
      return {
        x: values[4],
        y: values[5],
        remainingMatrix: `matrix(${values[0]}, ${values[1]}, ${values[2]}, ${values[3]}, 0, 0)`
      };
    }
  }
  // 如果所有解析都失败
  return { x: 0, y: 0, remainingMatrix: "none" };
};
