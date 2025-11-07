const BASE_URL = 'https://contact-backend.vercel.app/api';
let groups = [];

// 页面加载时初始化
window.onload = function() {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
        loadGroups();
        loadContacts();
    }
};

// 退出登录
function logout() {
    if (confirm('确定退出？')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// 加载分组
function loadGroups() {
    axios.get(`${BASE_URL}/groups`)
        .then(res => {
            groups = res.data;
            renderGroupSelect('add-group-id');
            renderGroupSelect('edit-group-id');
            renderFilterGroupSelect();
        })
        .catch(err => {
            console.error('加载分组失败：', err);
            handleAuthError(err);
        });
}

// 渲染分组下拉框
function renderGroupSelect(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.group_name;
        select.appendChild(option);
    });
}

// 渲染筛选下拉框
function renderFilterGroupSelect() {
    const filter = document.getElementById('group-filter');
    filter.innerHTML = '<option value="0">全部联系人</option>';
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.group_name;
        filter.appendChild(option);
    });
}

// 加载联系人
function loadContacts() {
    axios.get(`${BASE_URL}/contacts`)
        .then(res => renderContacts(res.data))
        .catch(err => {
            console.error('加载联系人失败：', err);
            handleAuthError(err);
        });
}

// 渲染联系人列表
function renderContacts(contacts) {
    const tbody = document.getElementById('contact-table');
    tbody.innerHTML = '';

    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">暂无联系人</td></tr>';
        return;
    }

    contacts.forEach(contact => {
        const group = groups.find(g => g.id == contact.group_id) || { group_name: '未分组' };
        tbody.innerHTML += `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${group.group_name}</td>
                <td>
                    <button onclick="showEditModal('${contact.phone}', '${escape(contact.name)}', '${contact.phone}', ${contact.group_id})" class="btn">修改</button>
                    <button onclick="deleteContact('${contact.phone}')" class="btn btn-secondary">删除</button>
                </td>
            </tr>
        `;
    });
}

// 添加联系人
function addContact() {
    const name = document.getElementById('add-name').value.trim();
    const phone = document.getElementById('add-phone').value.trim();
    const groupId = document.getElementById('add-group-id').value;

    if (!name) return alert('请输入姓名');
    if (!/^\d{11}$/.test(phone)) return alert('请输入11位手机号');

    axios.post(`${BASE_URL}/contacts`, { name, phone, group_id: groupId })
        .then(() => {
            alert('添加成功');
            document.getElementById('add-name').value = '';
            document.getElementById('add-phone').value = '';
            loadContacts();
        })
        .catch(err => {
            alert('添加失败：' + (err.response?.data?.error || err.message));
            handleAuthError(err);
        });
}

// 显示修改弹窗
function showEditModal(oldPhone, name, phone, groupId) {
    document.getElementById('edit-phone-old').value = oldPhone;
    document.getElementById('edit-name').value = unescape(name);
    document.getElementById('edit-phone').value = phone;
    document.getElementById('edit-group-id').value = groupId;
    document.getElementById('edit-modal').style.display = 'flex';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// 更新联系人
function updateContact() {
    const oldPhone = document.getElementById('edit-phone-old').value;
    const newName = document.getElementById('edit-name').value.trim();
    const newPhone = document.getElementById('edit-phone').value.trim();
    const newGroupId = document.getElementById('edit-group-id').value;

    if (!newName) return alert('请输入姓名');
    if (!/^\d{11}$/.test(newPhone)) return alert('请输入11位手机号');

    axios.put(`${BASE_URL}/contacts`, {
        old_phone: oldPhone,
        new_name: newName,
        new_phone: newPhone,
        new_group_id: newGroupId
    }).then(() => {
        alert('修改成功');
        closeModal();
        loadContacts();
    }).catch(err => {
        alert('修改失败：' + (err.response?.data?.error || err.message));
        handleAuthError(err);
    });
}

// 删除联系人
function deleteContact(phone) {
    if (!confirm('确定删除？')) return;

    axios.delete(`${BASE_URL}/contacts`, { data: { phone } })
        .then(() => {
            alert('删除成功');
            loadContacts();
        })
        .catch(err => {
            alert('删除失败：' + (err.response?.data?.error || err.message));
            handleAuthError(err);
        });
}

// 搜索联系人
function searchContacts() {
    const keyword = document.getElementById('search-input').value.trim();
    axios.get(`${BASE_URL}/contacts?keyword=${encodeURIComponent(keyword)}`)
        .then(res => renderContacts(res.data))
        .catch(err => alert('搜索失败：' + err.message));
}

// 重置搜索
function resetSearch() {
    document.getElementById('search-input').value = '';
    loadContacts();
}

// 按分组筛选
function filterByGroup() {
    const groupId = document.getElementById('group-filter').value;
    axios.get(`${BASE_URL}/contacts?group_id=${groupId}`)
        .then(res => renderContacts(res.data))
        .catch(err => alert('筛选失败：' + err.message));
}

// 添加分组
function addGroup() {
    const groupName = document.getElementById('add-group-name').value.trim();
    if (!groupName) return alert('请输入分组名称');

    axios.post(`${BASE_URL}/groups`, { group_name: groupName })
        .then(() => {
            alert('分组添加成功');
            document.getElementById('add-group-name').value = '';
            loadGroups();
        })
        .catch(err => {
            alert('添加分组失败：' + (err.response?.data?.error || err.message));
            handleAuthError(err);
        });
}

// 处理登录过期
function handleAuthError(err) {
    if (err.response?.status === 401) {
        alert('登录已过期，请重新登录');
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// 请求拦截器（携带用户ID）
axios.interceptors.request.use(config => {
    const user_id = localStorage.getItem('user_id');
    if (user_id) config.headers['X-User-Id'] = user_id;
    return config;
});