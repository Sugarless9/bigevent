$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $(`#chooseBtn`).on(`click`, function () {
        $(`[type="file"]`).click()
    })
    $(`[type="file"]`).on(`change`, function () {
        let file = this.files[0]
        if (!file) {
            return
        }
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    $(`#sureBtn`).on(`click`, function () {
        if ($(`[type="file"]`)[0].files.length === 0) {
            return layer.msg(`请选择图片`)
        }
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        axios.post(`/my/update/avatar`, `avatar=` + encodeURIComponent(dataURL)).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            window.parent.getUserInfo()
        })
    })
})