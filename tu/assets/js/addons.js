define([], function() {
    require(['../addons/bootstrapcontextmenu/js/bootstrap-contextmenu'], function(undefined) {
        if (Config.controllername == 'index' && Config.actionname == 'index') {
            $("body").append(
                '<div id="context-menu">' +
                '<ul class="dropdown-menu" role="menu">' +
                '<li><a tabindex="-1" data-operate="refresh"><i class="fa fa-refresh fa-fw"></i>刷新</a></li>' +
                '<li><a tabindex="-1" data-operate="refreshTable"><i class="fa fa-table fa-fw"></i>刷新表格</a></li>' +
                '<li><a tabindex="-1" data-operate="close"><i class="fa fa-close fa-fw"></i>关闭</a></li>' +
                '<li><a tabindex="-1" data-operate="closeOther"><i class="fa fa-window-close-o fa-fw"></i>关闭其他</a></li>' +
                '<li class="divider"></li>' +
                '<li><a tabindex="-1" data-operate="closeAll"><i class="fa fa-power-off fa-fw"></i>关闭全部</a></li>' +
                '</ul>' +
                '</div>');

            $(".nav-addtabs").contextmenu({
                target: "#context-menu",
                scopes: 'li[role=presentation]',
                onItem: function(e, event) {
                    var $element = $(event.target);
                    var tab_id = e.attr('id');
                    var id = tab_id.substr('tab_'.length);
                    var con_id = 'con_' + id;
                    switch ($element.data('operate')) {
                        case 'refresh':
                            $("#" + con_id + " iframe").attr('src', function(i, val) {
                                return val;
                            });
                            break;
                        case 'refreshTable':
                            try {
                                if ($("#" + con_id + " iframe").contents().find(".btn-refresh").size() > 0) {
                                    $("#" + con_id + " iframe")[0].contentWindow.$(".btn-refresh").trigger("click");
                                }
                            } catch (e) {

                            }
                            break;
                        case 'close':
                            if (e.find(".close-tab").length > 0) {
                                e.find(".close-tab").click();
                            }
                            break;
                        case 'closeOther':
                            e.parent().find("li[role='presentation']").each(function() {
                                if ($(this).attr('id') == tab_id) {
                                    return;
                                }
                                if ($(this).find(".close-tab").length > 0) {
                                    $(this).find(".close-tab").click();
                                }
                            });
                            break;
                        case 'closeAll':
                            e.parent().find("li[role='presentation']").each(function() {
                                if ($(this).find(".close-tab").length > 0) {
                                    $(this).find(".close-tab").click();
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }
            });
        }
        $(document).on('click', function() { // iframe内点击 隐藏菜单
            try {
                top.window.$(".nav-addtabs").contextmenu("closemenu");
            } catch (e) {}
        });

    });
    require.config({
        paths: {
            'async': '../addons/example/js/async',
            'BMap': ['//api.map.baidu.com/api?v=2.0&ak=mXijumfojHnAaN2VxpBGoqHM'],
        },
        shim: {
            'BMap': {
                deps: ['jquery'],
                exports: 'BMap'
            }
        }
    });

    require.config({
        paths: {
            'simditor': '../addons/simditor/js/simditor.min',
        },
        shim: {
            'simditor': [
                'css!../addons/simditor/css/simditor.min.css'
            ]
        }
    });
    require(['form'], function(Form) {
        var _bindevent = Form.events.bindevent;
        Form.events.bindevent = function(form) {
            _bindevent.apply(this, [form]);
            if ($(".editor", form).size() > 0) {
                //修改上传的接口调用
                require(['upload', 'simditor'], function(Upload, Simditor) {
                    var editor, mobileToolbar, toolbar;
                    Simditor.locale = 'zh-CN';
                    Simditor.list = {};
                    toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
                    mobileToolbar = ["bold", "underline", "strikethrough", "color", "ul", "ol"];
                    $(".editor", form).each(function() {
                        var id = $(this).attr("id");
                        editor = new Simditor({
                            textarea: this,
                            toolbarFloat: false,
                            toolbar: toolbar,
                            pasteImage: true,
                            defaultImage: Config.__CDN__ + '/assets/addons/simditor/images/image.png',
                            upload: {
                                url: '/'
                            }
                        });
                        editor.uploader.on('beforeupload', function(e, file) {
                            Upload.api.send(file.obj, function(data) {
                                var url = Fast.api.cdnurl(data.url);
                                editor.uploader.trigger("uploadsuccess", [file, {
                                    success: true,
                                    file_path: url
                                }]);
                            });
                            return false;
                        });
                        editor.on("blur", function() {
                            this.textarea.trigger("blur");
                        });
                        Simditor.list[id] = editor;
                    });
                });
            }
        }
    });
});