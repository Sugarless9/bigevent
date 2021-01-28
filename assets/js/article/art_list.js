$(function () {
    let form = layui.form
    let laypage = layui.laypage;
    let query = {
        pagenum: 1,//	页码值
        pagesize: 2,	//	每页显示多少条数据
        cate_id: "",//	文章分类的 Id
        state: ""//	文章的状态，可选值有：已发布、草稿
    }
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 过滤器函数来处理时间格式
    template.defaults.imports.dateFormat = function (date) {
        let dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function getList() {
        axios.get(`/my/article/list`, {
            params: query
        }).then(res => {
            $(`tbody`).html(template(`trTpl`, res.data))
            // 分页处理函数
            //执行一个laypage实例
            laypage.render({
                elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
                count: res.data.total, //数据总数，从服务端得到
                limit: query.pagesize,
                limits: [2, 4, 6, 8, 10],
                curr: query.pagenum,
                layout: [`count`, `limit`, `prev`, `page`, `next`, `skip`],
                jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    // console.log(first); // true  undefined
                    query.pagenum = obj.curr
                    query.pagesize = obj.limit
                    //首次不执行
                    if (!first) {
                        getList()
                    }
                }
            })
        })
    }
    getList()
    axios.get(`/my/article/cates`).then(res => {
        res.data.data.forEach(item => {
            $(` <option value="${item.Id}">${item.name}</option>`).appendTo(`[name="classify"]`)
        });
        form.render('select'); //刷新select选择框渲染
    })
    // 实现筛选功能
    $(`.layui-form`).on(`submit`, function (e) {
        e.preventDefault()
        query.cate_id = $("[name=classify]").val()
        query.state = $("[name=state]").val();
        query.pagenum = 1
        getList()
    })
    //实现删除功能
    $(`tbody`).on(`click`, `.delBtn`, function () {
        let id = $(this).attr(`data-id`)
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            if ($(`.delBtn`).length === 1) {
                query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
            }
            axios.get(`/my/article/delete/` + id).then(res => {
                if (res.data.status !== 0) {
                    return layer.msg(res.data.message)
                }
                layer.msg(res.data.message)
                getList()
            })
            layer.close(index);
        });
    })
    // 实现编辑
    $(`tbody`).on(`click`, `.editBtn`, function () {
        let id = $(this).attr(`data-id`)
        localStorage.setItem(`id`, id)
        location.href = `/article/art_edit.html`
    })
})