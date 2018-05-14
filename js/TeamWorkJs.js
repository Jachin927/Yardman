// TeamWorkJS
$(function(){
	// 标签栏切换
	$('.category li').eq(sessionStorage.getItem('TeamWorkNum')).addClass('category_on');
	$('.category').on('click','li',function(){
		$(this).addClass('category_on').siblings().removeClass('category_on');
		sessionStorage.setItem('TeamWorkNum',$(this).index());
	})
})