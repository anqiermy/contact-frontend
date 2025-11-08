 一、总体原则
1. 保持代码简洁可读，贴合项目技术栈（HTML + CSS + JavaScript + Axios）。
2. 单一职责：每个函数只处理一个功能（如添加联系人、加载分组列表）。
3. 命名与后端保持一致（如`user_id`、`group_id`），避免歧义。
4. 提交前检查格式，确保无冗余代码（如未使用的变量、注释）。

 二、文件与命名规范
1. 文件名：小写+连字符（-），如`login.html`、`contact-list.js`。
2. HTML元素ID：小写+连字符，与功能对应，如`add-name`、`phone-input`。
3. class名：小写+连字符，描述样式功能，如`btn-primary`、`contact-table`。
4. JavaScript变量/函数：小写+下划线（snake_case），如`user_id`、`load_contacts()`。
5. 常量：全大写+下划线，如`BASE_URL`、`MAX_PHONE_LEN`。

三、代码风格
1. 缩进：2个空格（HTML/CSS/JS统一），不使用Tab。
2. 行长度：JS代码≤80字符，超长时换行
3. 空行：函数间空1行，逻辑块（如校验、请求）间空1行。
4. 注释：关键逻辑加注释（如“手机号格式校验”），避免冗余说明。


四、HTML规范
1. 结构：使用语义化标签（`<main>`、`<section>`），避免多层嵌套`<div>`。
2. 标签：自闭合标签（`<input>`、`<img>`）不写`/`，成对标签必须闭合。
3. 属性：用双引号包裹值，如`<input type="text" id="add-name">`。


五、CSS规范
1. 选择器：优先用class（如`.contact-item`），少用ID（ID仅用于JS获取元素）。
2. 样式顺序：布局（display）→ 尺寸（width/height）→ 颜色（color）→ 其他，如：
   ```css
   .btn {
       display: inline-block;
       width: 80px;
       height: 30px;
       background: #42b983;
       border: none;
   }
   ```
3. 命名：描述功能而非样式。


 六、JavaScript规范
1. 变量声明：用`const`（常量）、`let`（变量），禁用`var`。
2. 函数：用`function`声明（如`function load_groups()`），避免匿名函数嵌套过深。
3. API请求：统一在`api.js`中封装，用Axios拦截器自动携带`X-User-Id`：
   ```javascript
   axios.interceptors.request.use(config => {
       config.headers['X-User-Id'] = localStorage.getItem('user_id');
       return config;
   });
   ```
4. 表单校验：前端先做基础校验（非空、手机号11位），如：
   ```javascript
   function check_phone(phone) {
       return /^\d{11}$/.test(phone);
   }
   ```
5. DOM操作：通过ID获取元素（`document.getElementById('add-name')`），减少重复查询。
6. 错误处理：Axios请求必须加`catch`，提示用户友好信息：
   ```javascript
   .catch(err => {
       alert('操作失败：' + (err.response?.data?.message || '网络错误'));
   });
   ```


七、审查重点
1. 命名是否与后端参数一致（如`group_id`而非`groupId`）。
2. 函数是否仅处理单一功能（如`add_contact`只负责添加，不包含渲染）。
3. 表单是否有前端校验，减少无效请求。
4. API请求是否用拦截器统一处理`X-User-Id`。
5. 错误提示是否友好，不含技术术语（如不显示“404错误”）。
