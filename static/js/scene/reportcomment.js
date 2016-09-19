$(function(){
	// 删除操作
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
  $('.comment-delete-btn').click(function(){
  	$('.select-btn').each(function(){
  	  if($(this).hasClass('lselected')){
  	  	$(this).parent().parent().remove();
  	  	if($('.lselect-btn').hasClass('lselected')){
  	  		$('.lselect-btn').removeClass('lselected');
  	  		select_num=0;
  	  	}	
  	  }
  	})
  })
  $('.delete-btn').hover(function(){
  	$(this).css('color','#f00');
  },function(){
  	$(this).css('color','#323a4d');
  })
  $('.delete-btn').on('click',function(){
  	$(this).parent().remove();
  })
})