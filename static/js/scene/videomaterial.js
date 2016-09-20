// 获取参数
var page = + lvsCmd['urlParams']['page'];
if (isNaN(page) || page < 1) page = 1;

// 渲染搜索栏
var newSearchform = new cake["tplform-1.0.1"]('j-search'),
searchConfig = {
  "type": "ajax",
  "method": "post",
  "action": "xxx",
  "fields": [{
    "class": "j-starttime",
    "title": "开始时间",
    "name": "starttime",
    "type": "date",
    "required": true,
    "placeholder": "开始时间",
    "config": {
      format: "Y.m.d",
      onShow: function(ct){
        this.setOptions({
          maxDate: $('.j-endtime input').val()?$('.j-endtime input').val():false
        })
      }
    }
  }, {
    "class": "j-endtime",
    "title": "结束时间",
    "name": "endtime",
    "type": "date",
    "required": true,
    "placeholder": "结束时间",
    "config": {
      format: "Y.m.d",
      onShow: function(ct){
        this.setOptions({
          minDate: $('.j-starttime input').val()?$('.j-starttime input').val():false
        })
      }
    }
  }, {
    "title": "视频状态",
    "name": "type",
    "type": "select",
    "option": [
      {"text": "视频状态", "value": "0"},
      {"text": "N/A", "value": "1"},
      {"text": "启用", "value": "2"},
      {"text": "未启用", "value": "3"}
    ]
  }, {
    "title": "关键字",
    "name": "keyword",
    "type": "text",
    "maxlength": 100,
    "placeholder": "关键字"
  }, {
    "title": "关键字类型",
    "name": "keyType",
    "type": "select",
    "option": [
      {"text": "关键字类型", "value": "0"},
      {"text": "创建人", "value": "1"},
      {"text": "视频内容", "value": "2"},
      {"text": "报道ID", "value": "4"},
      {"text": "视频标题", "value": "8"}
    ]
  }],
  "button": [
    {
      "value": "搜索",
      "type": "submit"
    }
  ]
};
newSearchform.render(searchConfig, null, function(config){

  var data = {page: 1},
    beginDate = $('#j-searchform input[name=beginDate]').val(),
    endDate = $('#j-searchform input[name=beginDate]').val(),
    reportType = $('#j-searchform select[name=reportType]').val(),
    key = $('#j-searchform input[name=key]').val(),
    keyType = $('#j-searchform select[name=reportType]').val();
  if (beginDate) data['beginDate'] = new Date(beginDate).getTime();
  if (endDate) data['endDate'] = new Date(endDate).getTime();
  if (reportType > 0) data['reportType'] = reportType;
  if (key) data['key'] = key;
  if (keyType > 0) data['keyType'] = keyType;
  lvsCmd.ajax(config['url'], data, function (state, res) {
    console.log(res);
  });  
});

// 分页
lvsCmd.page('j-page', 437, page, 20);
$('#j-page a').click(function(){
  alert($(this).data('page'));
});

//选中
var select_num=0;
  $('.lselect-btn').click(function(){
    if(select_num==0){
      $('.lselect-btn').addClass('lselected');
      $('.select-btn').addClass('lselected');
      select_num=1;
    }else{
      $('.lselect-btn').removeClass('lselected');
      $('.select-btn').removeClass('lselected');
      select_num=0;
    }
  })
  $(".select-btn").on("click",function(){
    $('.lselect-btn').removeClass('lselected');
    select_num=0;
    if(!$(this).hasClass("lselected")){
      $(this).addClass('lselected');
    }else{
      $(this).removeClass('lselected');
    }
  })