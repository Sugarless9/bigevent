$(function () {
    let form = layui.form;
    function setForm() {
        axios(`/my/userinfo`).then(res => {
            //给表单赋值
            form.val(`form`, res.data.data)
            // form.val("form", { //form 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
            //     "id": res.data.data.id
            //     , "username": res.data.data.username // "name": "value"
            //     , "nickname": res.data.data.nickname
            //     , "email": res.data.data.email
            // });
        })
    }
    setForm()
    form.verify({
        nickname: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6) {
                return '昵称不能超过6位';
            }
        }
    })
    $(`.layui-form`).on(`submit`, function (e) {
        e.preventDefault()
        let data = $(this).serialize()
        axios.post(`/my/userinfo`, data).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            window.parent.getUserInfo()
        })
    })
    $(`button[type="reset"]`).on(`click`, function (e) {
        e.preventDefault()
        setForm()
    })
}) 