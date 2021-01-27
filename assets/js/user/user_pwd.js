$(function () {
    let form = layui.form
    form.verify({
        newPwd: function (value, item) { //value：表单的值、item：表单的DOM对象
            let oldPwd = $(`[name="oldPwd"]`).val()
            if (oldPwd === value) {
                return '新旧密码不能相同';
            }
        },
        renewPwd: function (value, item) { //value：表单的值、item：表单的DOM对象
            let newPwd = $(`[name="newPwd"]`).val()
            if (newPwd !== value) {
                return '两次密码输入不相同';
            }
        },
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
    })
    $(`.layui-form`).on(`submit`, function (e) {
        e.preventDefault()
        let data = $(this).serialize()
        axios.post(`/my/updatepwd`, data).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
                layer.msg(res.data.message)
                window.parent.logInAgain()
            }
        })
    })
})