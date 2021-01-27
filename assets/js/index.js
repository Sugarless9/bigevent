function getUserInfo() {
    axios({
        url: `/my/userinfo`,
    }).then((res) => {
        if (res.data.status === 0) {
            let name = res.data.data.nickname || res.data.data.username
            $(`.welcomeText`).text(`欢迎 ` + name)
            $(`.userHead`).text(name[0].toUpperCase())
            if (res.data.data.user_pic) {
                $(`.layui-nav-img`).attr(`src`, res.data.data.user_pic)
                $(`.layui-nav-img`).show()
                $(`.userHead`).hide()
            } else {
                $(`.layui-nav-img`).hide()
                $(`.userHead`).show()
            }
        }
    })
}
getUserInfo()
// 退出
$(`#logoutBtn`).on(`click`, function () {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        logInAgain()
        layer.close(index);
    });
})
function logInAgain() {
    localStorage.removeItem(`token`)
    location.href = `/home/login.html`
}