# contact-frontend
通讯录系统前端
## 项目介绍
通讯录管理系统前端，负责用户交互与页面渲染，通过 Axios 调用后端 API 实现完整功能。

## 技术栈
- 页面结构：HTML5
- 样式控制：CSS3
- 交互逻辑：JavaScript（ES6+）
- 网络请求：Axios
- 状态存储：localStorage（保存用户登录状态）

## 核心功能
1. 用户登录/注册（含账号密码校验）
2. 联系人增删改查（11位手机号格式验证）
3. 分组管理（添加分组、按分组筛选联系人）
4. 联系人模糊搜索（按姓名匹配）

## 本地运行步骤
1. 克隆仓库到本地
2. 打开 `src/js/api.js`，修改 `BASE_URL` 为后端服务地址（本地调试默认：`http://localhost:5000/api`）
3. 用浏览器直接打开 `src/login.html` 即可

## 部署说明
1. 确保 `src/js/api.js` 中 `BASE_URL` 已改为服务器后端地址（如：`http://47.114.95.63:5000/api`）
2. 将 `src` 目录下所有文件上传到服务器 Nginx 根目录（示例路径：`/root/frontend/src`）
3. 配置 Nginx 指向 `login.html`，重启 Nginx 后访问服务器 IP 即可
