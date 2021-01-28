$(function () {
    // 获取分类信息并显示到页面
    function load() {
        axios.get(`/my/article/cates`).then(res => {
            $(`tbody`).html(template(`trTpl`, res.data))
        })
    }
    load()
    // 添加弹出框
    let index = null
    $(`#addBtn`).on(`click`, function () {
        index = layer.open({
            type: 1,
            title: `添加文章分类`,
            area: ['500px', '250px'],
            content: $(`#add`).html()
        });
    })
    // 确定添加
    $(`body`).on(`submit`, `.addForm`, function (e) {
        e.preventDefault()
        let data = $(this).serialize()
        axios.post(`/my/article/addcates`, data).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            layer.close(index)
            load()
        })
    })
    // 删除
    $(`tbody`).on(`click`, `.delBtn`, function name() {
        let id = $(this).attr(`data-Id`)
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            axios.get(`/my/article/deletecate/` + id).then(res => {
                if (res.data.status !== 0) {
                    return layer.msg(res.data.message)
                }
                layer.msg(res.data.message)
                load()
            })
            layer.close(index);
        });
    })
    // 修改弹出框
    let editindex = null
    let form = layui.form
    $(`body`).on(`click`, `.editBtn`, function name() {
        let id = $(this).attr(`data-Id`)
        axios.get(`/my/article/cates/` + id).then(res => {
            form.val(`form`, res.data.data)
        })
        editindex = layer.open({
            type: 1,
            title: `修改文章分类`,
            area: ['500px', '250px'],
            content: $(`#edit`).html()
        });
    })
    // 确认修改 
    $(`body`).on(`submit`, `.editForm`, function (e) {
        e.preventDefault()
        let data = $(this).serialize()
        axios.post(`/my/article/updatecate`, data).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            layer.close(editindex)
            load()
        })
    })
})