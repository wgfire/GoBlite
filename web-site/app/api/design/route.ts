import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const mockFilePath = path.join(process.cwd(), "app/design/mock.json");

// 读取mock数据
async function readMockData() {
  try {
    const data = await fs.readFile(mockFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("读取mock数据失败:", error);
    return null;
  }
}

// 写入mock数据
async function writeMockData(data) {
  try {
    await fs.writeFile(mockFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("写入mock数据失败:", error);
    return false;
  }
}

// GET接口
export async function GET() {
  const data = await readMockData();

  if (!data) {
    return NextResponse.json({ error: "获取数据失败" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT接口
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json({ error: "无效的数据格式" }, { status: 400 });
    }

    const success = await writeMockData(body);

    if (!success) {
      return NextResponse.json({ error: "更新数据失败" }, { status: 500 });
    }

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("更新数据失败:", error);
    return NextResponse.json({ error: "更新数据失败" }, { status: 500 });
  }
}
