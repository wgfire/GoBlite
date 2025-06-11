/**
 * @description git add . 暂存
 * @description git commit  提交
 * @description git push  推送
 * @description 通过脚本后续可以自定义逻辑
 */

import { exec } from "child_process";

console.log(process.argv, "参数");

const cmd = "git add . && git-cz && git push";
exec(cmd, (err, stdout) => {
  console.log(err, stdout);
  if (err) {
    console.log(err);
  } else {
    console.log(stdout);
  }
});
