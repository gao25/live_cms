// 获取参数
var searchFromData = lvsCmd['urlParams'];
if (!searchFromData['page']) {
  searchFromData['page'] = 1;
}

// juicer函数
juicer.register('formatDate', lvsCmd['formatDate']);
juicer.register('formatType', function(type){
  var typeStr = '';
  if (type == 1) {
    typeStr = '图文';
  } else if (type == 2) {
    typeStr = '音频';
  } else if (type == 4) {
    typeStr = '视频';
  }
  return typeStr;
});
juicer.register('formatState', function(state){
  var stateDict = {
    "1": "未审核",
    "2": "审核通过",
    "4": "审核失败",
    "8": "未开始直播",
    "16": "正在直播",
    "32": "直播结束",
    "64": "删除"
  }
  return stateDict[state];
});

// 渲染列表
var listTpl = juicer($('#j-list script').html());
$('#j-list script').remove();
if (searchFromData['beginDate'] || searchFromData['endDate'] || searchFromData['reportType'] || searchFromData['key'] || searchFromData['keyType']) {
  var url = '/live-web-cms/live/search.json';
} else {
  var url = '/live-web-cms/live/getApproved.json';
}
var ajaxData = $.extend({}, searchFromData);
if (ajaxData['endDate']) ajaxData['endDate'] = + ajaxData['endDate'] + 24 * 3600 * 1000;
lvsCmd.ajax(url, ajaxData, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      var listHtml = listTpl.render(res);
      $('#j-list').html(listHtml);
      // 绑定操作
      bindList();
      // 分页
      lvsCmd.page('j-page', res['totalcount'], res['currentpage'], 10);
      $('#j-page a').click(function(){
        searchFromData['page'] = $(this).data('page');
        locationFn();
      });
    } else {
      alert(res['errMsg']);
    }
  } else {
    // alert("接口请求失败，请检查网络连接！");
  }
});
function verifyCallback(){
  location.reload();
}
function closeCallback(){
  location.reload();
}
function bindList(){
  // 审核
  $('#j-list .j-verify').click(function(){
    parent.window.mainOverlay.show('<div class="lvs-overlay"><div class="title">现场审核<em class="j-overlay-close">X</em></div><iframe scrolling="auto" frameborder="0" width="640" height="200" src="scene/sceneverify.html?liveId='+$(this).data('id')+'&callback=verifyCallback"></iframe></div>');
    return false;
  });
  // 关闭
  $('#j-list .j-close').click(function(){
    parent.window.mainOverlay.show('<div class="lvs-overlay"><div class="title">关闭现场<em class="j-overlay-close">X</em></div><iframe scrolling="auto" frameborder="0" width="640" height="200" src="scene/sceneclose.html?liveId='+$(this).data('id')+'&callback=closeCallback"></iframe></div>');
    return false;
  });
  // 列表
  $('#j-list .more').hover(function(){
    $(this).find('ul').show();
  },function(){
    $(this).find('ul').hide();
  })
  $('#j-list .more ul li a').hover(function(){
    $(this).css('color','#12bb9a');
  },function(){
    $(this).css('color','#808080');
  })
}

// 跳转
function locationFn(){
  var toUrl = '';
  $.each(searchFromData, function (key, val) {
    if (toUrl == '') {
      toUrl += '?';
    } else {
      toUrl += '&';
    }
    toUrl += key + '=' + val;
  });
  location.href = toUrl;
}

// 渲染搜索栏
var newSearchform = new cake["tplform-1.0.1"]('j-search'),
searchConfig = {
  "type": "ajax",
  "method": "post",
  "action": "",
  "fields": [{
    "class": "j-starttime",
    "title": "开始时间",
    "name": "beginDate",
    "type": "date",
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
    "name": "endDate",
    "type": "date",
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
    "name": "reportType",
    "type": "select",
    "option": [
      {"text": "现场类型", "value": "0"},
      {"text": "图文", "value": "1"},
      {"text": "音频", "value": "2"},
      {"text": "视频", "value": "4"}
    ]
  }, {
    "title": "关键字",
    "name": "key",
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
      {"text": "现场ID", "value": "2"},
      {"text": "现场标题", "value": "4"}
    ]
  }],
  "button": [
    {
      "value": "搜索",
      "type": "submit"
    }
  ]
};
newSearchform.render(searchConfig, null, function (formInfo) {
  var formData = formInfo['data'],
    newFromData = {'page': 1};
  if (formData['beginDate']) {
    newFromData['beginDate'] = new Date(formData['beginDate']).getTime();
  }
  if (formData['endDate']) {
    newFromData['endDate'] = new Date(formData['endDate']).getTime();
  }
  if (formData['reportType'] > 0) {
    newFromData['reportType'] = formData['reportType'];
  }
  if (formData['key']) {
    newFromData['key'] = formData['key'];
  }
  if (formData['keyType'] > 0) {
    newFromData['keyType'] = formData['keyType'];
  }
  searchFromData = newFromData;
  locationFn(); 
});
newSearchform.setval(searchFromData);
if (searchFromData['beginDate']) $('.j-starttime input').val(lvsCmd.formatDate(+searchFromData['beginDate'], 'YY-MM-DD'));
if (searchFromData['endDate']) $('.j-endtime input').val(lvsCmd.formatDate(+searchFromData['endDate'], 'YY-MM-DD'));
