$(function () {
    let form = layui.form
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    let $image = $("#image");

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: ".img-preview",
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);
    axios.get(`/my/article/cates`).then(res => {
        res.data.data.forEach(item => {
            $(`<option value="${item.Id}">${item.name}</option>`).appendTo(`[name="cate_id"]`)
        });
        form.render('select'); //刷新select选择框渲染
    })
    $(`#chooseImg`).on(`click`, function () {
        $(`#file`).click()
    })
    $(`#file`).on(`change`, function () {
        let file = this.files[0]
        if (!file) {
            return
        }

        // 按照文件得到对应的url地址
        let newImgURL = URL.createObjectURL(file);

        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })
    let state; // 文章的状态
    // 发布按钮
    $("#btn1").click(function () {
        state = "已发布";
    });

    // 草稿按钮
    $("#btn2").click(function () {
        state = "草稿";
    });
    $(`form`).on(`submit`, function (e) {
        e.preventDefault()
        // 封面处理
        $image
            .cropper("getCroppedCanvas", {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280,
            })
            .toBlob((blob) => {
                // 将 Canvas 画布上的内容，转化为文件对象
                let fd = new FormData(this);
                let id = localStorage.getItem(`id`)
                fd.append("cover_img", blob);
                fd.append("state", state);
                fd.append("Id", id);
                axios.post("/my/article/edit", fd).then(res => {
                    console.log(res);
                    if (res.data.status !== 0) {
                        return layer.msg("发布文章失败");
                    }
                    layer.msg("发布成功");
                    this.reset()
                    localStorage.removeItem(`id`)
                    location.href = `/article/art_list.html`
                });
            });
    })
})
