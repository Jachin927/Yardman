// 检测登录状态
let ip = 'http://muma.webgz.cn/php/muma.php';
let imgIP = 'http://muma.webgz.cn/php';
let token = localStorage.getItem('token');
let show = false;

if(token){
	fetchJsonp(`${ip}/usr/logged?token=${token}`)
	.then((response) => {
		response.json().then((data) => {
			if(data.code == 200){
				$('#login_btn').css('backgroundImage', `url(${imgIP}${data.data.face})`);
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
			alert('页面还没出来哦-.-');
		}else if(index == 2){
			localStorage.removeItem('token');
			$('#login_btn').trigger('click');
			$('#login_btn').css('backgroundImage', '');
			show = false;
		}
	});
}

// fetch请求
function res(url){
	fetchJsonp(url)
	.then((response) => {
		response.json().then((data) => {
			item(data, url);
		});
	})
}

// 标签栏切换获取数据
TeamWorkNum = sessionStorage.getItem('TeamWorkNum')||0
$('.category li').eq(TeamWorkNum).addClass('category_on');
num = parseInt(TeamWorkNum) + 1;
url = `${ip}/all/${num}`;
res(url);

// 点击切换获取数据
$('.category').on('click','li',function(){
	index = $(this).index();
	$(this).addClass('category_on').siblings().removeClass('category_on');
	sessionStorage.setItem('TeamWorkNum', index);
	num = index + 1;
	res(`${ip}/all/${num}`);
})

// 换页
$('#pre').click(function(){
	cur = parseInt($('.cur').text()) - 1;
	if(cur >= 1){
		res(`${url}/${cur}`);
	}
})
$('#next').click(function(){
	cur = parseInt($('.cur').text()) + 1;
	last = parseInt($('.last').text());
	if(cur <= last){
		res(`${url}/${cur}`);
	}
})

// 获取数据
function item(data, url){
	$('.worksList').html('');
	$('.cur').text(data.current_page);
	$('.last').text(data.last_page);
	$('.pager').css('opacity', 0);
	if(data.last_page != 0){
		$('.pager').css('opacity', 1);
	}
	
	$.each(data.data, function(i, v){
		li = `<li>
			<a href="DetailsWork.html?id=${v.id}">
				<div class="worksList_shang">
					<img src="${imgIP}${v.cover}">
				</div>
				<div class="worksList_zhong">
					<i><span class="look"></span>${v.browse}</i>
					<i><span class="comments"></span>${v.comment}</i>
					<i><span class="praise"></span>${v.isLike}</i>
					<h3>${v.title}</h3>
				</div>
				<div class="worksList_xia">
					<div>
						<img src="${imgIP}${v.face}">
					</div>
						<p>${v.nickname}</p>
					<span>${v.name}</span>
				</div>
			</a>
		</li>`;

		$('.worksList').append(li);
	})
}