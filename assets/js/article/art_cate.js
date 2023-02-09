$(function () {

    let layer = layui.layer
    let form = layui.form
    initArtCateList()



    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增失败！')
                }

                initArtCateList()

                layer.msg('新增成功！')
                layer.close(indexAdd)
            }
        })
    })

    let indexEidt = null
    $('body').on('click', '#btn-eidt', function () {
        indexEidt = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-eidt').html()
        });

        let id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log('ok');
                form.val('form-eidt', res.data)
            }
        })
    })

    $('body').on('submit', '#form-eidt', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEidt)
                initArtCateList()
            }

        })
    })


    $('body').on('click', '.btn-dalete', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index)
                    initArtCateList()
                }
            })

        });

    })
})