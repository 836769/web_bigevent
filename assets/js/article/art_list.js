$(function () {
    //定义一个查询的参数
    let layer = layui.layer
    let form = layui.form
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '-' + '' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    let q = {
        pagenum: 1,   //页码值
        pagesize: 2,  //每页几条数据
        cate_id: '',  //文章分类的ID
        state: ''       //文章发布的状态

    }
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                layer.msg('获取数据成功！')
                let htmlStr = template('tpl_table', res)
                $('table').html(htmlStr)

                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                let htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //筛选表单
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state

        initTable()

    })


    //定义渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum,    //设置默认呗选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                // console.log(obj.curr)
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }

            }
        })
    }

    //删除
    $('tbody').on('click', '.btn-delete', function () {

        let len = $('.btn-delete').length

        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something

            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })


            layer.close(index);
        });
    })
})