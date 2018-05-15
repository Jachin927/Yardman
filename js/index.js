document.onreadystatechange = function(){
	if(document.readyState == 'complete'){
		$('#loading').fadeOut();
		mousewheel();
	}
}

// 滚轮切换动画
var module = 0;
function mousewheel(){
	$(document).on('mousewheel DOMMouseScroll', function(e){
		var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));

		if(!$('#module_box').is(':animated')){
			if(delta > 0 ){
				if(!$('#menu li span').is(':animated')){
					module -= 2;
					if(module >= 0){
						$('#menu li').eq(module).trigger('click');
					} else {
						module = 0;
					}

					if (module == 0) {
						$("#mouse").animate({'height': 56}, 'slow');
						$('#top').fadeOut(200);
					}
					

				}
			}else if(delta < 0){
				if(!$('#menu li span').is(':animated')){
					module += 2;
				
					if(module <= 6){
						$('#menu li').eq(module).trigger('click');
						$("#login_icon").fadeOut();
					} else {
						module = 6
					}
					if (module !== 0) {
						$("#mouse").animate({'height': 0}, 350);
						$('#top').fadeIn(200);
					}
					
				}
			}
		}
	});
}

//跳转首页
$('#logo').on('click', function(){
	$('#menu li').eq(0).trigger('click');
	$("#mouse").animate({'height': 56}, 'slow');
});

// 顶部
$("#top").on('click',function(){
	if(!$('#menu li span').is(':animated')){
		$(this).fadeOut(200);
		$('#menu li').eq(0).trigger('click');
		$("#mouse").animate({'height': 56}, 'slow');
		module = 0;
	}
})

// 点击导航切换模块
$('#menu li:even').on('click', function(){
	if(!$('#module_box').is(':animated')){
		i = $(this).index() / 2;
		$('#module_box').animate({	'top': '-' + i * 100 + '%'}, 'linear');

		$('#menu li span').slideUp(500);
		$('#menu li i').css('border-right', '4px solid rgba(250, 109, 57, 0.5)');

		$(this).find('i').css('border-right', '4px solid #fa6d39');
		$(this).find('span').slideDown(500);
		module = $(this).index();
	}
});

// 叶子随机更换动画
let arr = [];
for(var i = 1; i <= $('.leaf').length; i++){
	arr.push(i);
}
let timer = null;
function create_leaf(){
	clearInterval(timer);
	arr.sort(function(){ return 0.5 - Math.random();});
	for(var i = 0; i < $('.leaf').length; i++){
		$('.leaf').eq(i).css('animation-name', 'fall_bg_' + arr[i]);
	}
	timer = setInterval('create_leaf()', 9000);
}
timer = setInterval('create_leaf()', 2000);
create_leaf();

// 检测登录状态
let ip = 'http://10.21.40.246/muma.php';
let imgUrl = 'http://10.21.40.246';
let token = localStorage.getItem('token');
let show = false;

if(token){
	fetch(`${ip}/usr/logged?token=${token}`)
	.then((response) => {
		response.json().then((data) => {
			if(data.code == 200){
				$('#login_btn').css('backgroundImage', `url(${imgUrl}/${data.data.face})`);
				show = true;
				showMe(data.data.id);
			}
		})
	})
}

// 登录显示功能
function showMe(id){
	$('#login_btn').click(function(e){
		if(show){
			e.preventDefault();
			if(!$('#tools').is(':animated')){
				$('#tools').fadeToggle(200);
			}
		}
	});

	$('#tools li').on('click', function(){
		let index = $(this).index();
		if(index == 0){
			window.location.href = `Member.html?uid=${id}`;
		}else if(index == 1){
			window.location.href = 'task.html';
		}else if(index == 2){
			localStorage.removeItem('token');
			$('#login_btn').trigger('click');
			$('#login_btn').css('backgroundImage', '');
			show = false;
		}
	});
}

// 获取成员信息
fetch(`${ip}/members`)
.then((response) => {
	response.json().then((data) => {
		if(data.code == 200){
			leng = data.data.length;
			$('#list_banner').width((270 + 120) * (leng + 3) - 120);
			for(let i = 0; i < leng; i++){
				li = `<li>
							<a href="Member.html?uid=${data.data[i].uid}">
								<div class="list_box"><img src="${imgUrl}${data.data[i].face}"></div>
								<p>${data.data[i].nickname}</p>
							</a>
						</li>`;
				frames = `<img src="${imgUrl}${data.data[i].face}" alt="face">`;

				$('#list_banner').append(li);
				$('#frames').append(frames);
			}
			for(let i = 0; i < 3; i++){
				li = `<li>
							<a href="Member.html?uid=${data.data[i].uid}">
								<div class="list_box"><img src="${imgUrl}${data.data[i].face}"></div>
								<p>${data.data[i].nickname}</p>
							</a>
						</li>`;

				$('#list_banner').append(li);
			}
			banner();
		}
	})
});


function banner(){
	// 轮播图
	let time = 2000;
	let banner_timer = '';
	let num = 1;
	let leng = $('#list_banner li').length;

	function move(){
		$('#list_banner').animate({
				left: -(num * 390)
			}, 'slow', function() {
				num++;
				if(num >= leng - 2){
					num = 1;
					$('#list_banner').css('left', 0);
				}
		});
	}

	banner_timer = setInterval(move, time);

	// 上一张
	$('#left').click(function(){
		if(!$('#list_banner').is(':animated')){
			clearInterval(banner_timer);
			num--;
			if(num < 0){
				num = leng - 3;
				$('#list_banner').css('left', -(num * 390));
			}
			$('#list_banner').animate({
				left: -(num * 390)
			}, 'slow');
			banner_timer = setInterval(move, time);
		}
	});

	// 下一张
	$('#right').click(function(){
		if(!$('#list_banner').is(':animated')){
			clearInterval(banner_timer);
			move();
			banner_timer = setInterval(move, time);
		}
	});

	// 显示middle
	$('#middle').hover(function(){
		$('#frames').slideDown(200);
	}, function(){
		$('#frames').slideUp(200);
	});

	// 点击轮播
	$('#frames img').click(function(){
		if(!$('#list_banner').is(':animated')){
			clearInterval(banner_timer);
			num = $(this).index();
			move();
			banner_timer = setInterval(move, time);
		}
	});

	// 鼠标移动停止轮播
	$('#list_banner li').hover(function(){
		clearInterval(banner_timer);
	}, function(){
		banner_timer = setInterval(move, time);
	});	
}

// 作品页跳转sessionStorage储存传参
$('#team_work_in').on('click','li',function(){
	sessionStorage.setItem('TeamWorkNum',$(this).index())
})