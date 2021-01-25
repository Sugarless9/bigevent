$(function () {
    $(`.loginBox a`).click(function () {
        $(`.loginBox`).hide()
        $(`.regiBox`).show()
    });
    $(`.regiBox a`).click(function () {
        $(`.regiBox`).hide()
        $(`.loginBox`).show()
    });
    let form = layui.form;
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 要求确认密码与密码一致
        repass: function (value, item) { //value：表单的值、item：表单的DOM对象
            let pwd = $(`#password`).val()
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    });             
    // ajax请求注册
    $(`.regiBox form`).on(`submit`, function (e) {
        e.preventDefault()
        let data = $(this).serialize()
        axios.post(`/api/reguser`, data).then(function (res) {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            console.log(`----`);
            layer.msg(res.data.message)
            $(`.regiBox a`).click()
        })
    })
    // ajax请求登录
    $(`.loginBox form`).on(`submit`, function (e) {
        e.preventDefault()
        let data = $(this).serialize()
        axios.post(`/api/login`, data).then(function (res) {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            localStorage.setItem(`token`, res.data.token)
            layer.msg(res.data.message, { time: 500 }, function () {
                location.href = `/home/index.html`
            })                   
        })
    })
});
