"use client";
import { useEffect } from "react";
import { Input } from "@go-blite/shadcn";
const LoginPage = () => {
  useEffect(() => {
    console.log("LoginPage");
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">登录</h2>
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">
              用户名
            </label>
            <Input id="username" name="username" type="text" required placeholder="用户名" />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              密码
            </label>
            <Input id="password" name="password" type="password" required placeholder="密码" />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-yellow-500 rounded-md
                hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              登录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
