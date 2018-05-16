//获取初始数据
let url = new URL(window.location.href);
let id = url.searchParams.get("id");
let baseUrl = 'http://10.21.40.246';
if (sessionStorage.getItem('watchList')==""||sessionStorage.getItem('watchList')==null) {
	sessionStorage.removeItem('watchList')
}
let watchList = JSON.parse(sessionStorage.getItem('watchList'))||[0]
let isAdd = 1;
$.each(watchList,(ind,val)=>{
	if(id==val){
		isAdd=2;
		return false;
	}
})
let info = new Array();
//获取个人信息
fetch(`${baseUrl}/muma.php/pfl/dtl?id=${id}&isAdd=${isAdd}`)
	.then(resolve=>resolve.json()
		.then(data=>{
			info=data;
			console.log(info)	
			$('#info_title').text(info.data.title)
			$('#info_name').text(info.data.name)
			$('#info_time').text(info.data.create_time)
			$('#info_browse').text(info.data.browse)
			$('#info_comment').text(info.data.comment)
			$('#info_like').text(info.data.isLike)
			// $('#info_images').attr('src',baseUrl+info.data.images)
			$('#info_face').attr('src',baseUrl+info.data.face)
			$('#info_nickname').text(info.data.nickname)
			$('#info_dir').text(`${info.data.profession} | ${info.data.direction}`);
			if (isAdd==1) {
				watchList.push(id)
				sessionStorage.setItem('watchList',JSON.stringify(watchList))
			}
			info.data.url==""?$('#info_url').css('display','none'):$('#info_url').attr('href',info.data.url)
			let info_images = $('#info_images');
			$.each(info.data.images,(ind,val)=>{
				info_images.append(`<li><img src='${baseUrl}${val}'></li>`)
			})
			let info_other = $('.inner_list');
			$.each(info.data.other,(ind,val)=>{
				info_other.append(`<li><a href="DetailsWork.html?id=${val.id}"><img src="${baseUrl}${val.cover}"></a></li>`)
			})
		})
	)
//获取评论
let comments_page;
getcomments_data();
function getcomments_data(page){
	page=page||1
	fetch(`${baseUrl}/muma.php/cmt/list?pid=${id}&page=${page}`)
		.then(resolve=>resolve.json()
			.then(data=>{
				// console.log(data)
				comments_page=data.data.current_page
				let loading=$('.comments_list')
				if (page==1) {$('.comments_list').html('');}
				if (data.code==200) {
					$.each(data.data.data,(ind,val)=>{
						loading.append(`
							<li>
								<div class="comments_pic">
									<i><img src="${baseUrl}${val.face}"></i>
								</div>
								<div class="comments_title">
									<h2>${val.nickname}</h2>
									<span>${val.create_time}</span>
									<p>${val.content}</p>
								</div>
							</li>
						`)
					})
					if (data.data.current_page>=data.data.last_page) {
						$('.loading').css('display','none ')
						loading.append('<li><em>暂无更多评论</em></li>')

					}
				}else{
					loading.append('<li><em>暂无评论</em></li>')
					$('.loading').css('visibility','hidden ')
				}
			})
		)
}
$('.loading').on('click',function(){
		comments_page++;
		// console.log(comments_data.current_page)
		getcomments_data(comments_page);
})

//评论事件
let textNum=$('#textNum');
$('.text').on('focus',function(){
	$(this).on('keyup',function(){
		$(this).val().length>=30?textNum.text(30):textNum.text($(this).val().length)
	})
})
$('#comment_btn').on('click',function(){
	let formData = new FormData($('.form')[0]);
	formData.append('token',localStorage.getItem('token'))
	formData.append('pid',id)
	fetch(`${baseUrl}/muma.php/cmt/add`,{
		method:'POST',
		body:formData
	}).then(resolve=>resolve.json()
		.then(data=>{
			alert(data.msg)
			getcomments_data()
		})
	).catch(error=>alert('操作错误！'))
})

//点赞事件

if (localStorage.getItem('Ym_likeList')==""||localStorage.getItem('Ym_likeList')==null) {
	localStorage.removeItem('Ym_likeList')
}
let likeList = JSON.parse(sessionStorage.getItem('likeList'))||[0]
let isLike = 1;
$.each(likeList,function(ind,val){
	if (id==val) {
		isLike=2;
		return false;
	}
})
if (isLike==1) {
	$('.about_userLike').css({'border':'none','background':'#fa6d39','color':'#fff'}).html('<p><span></span>欣赏作品</p>')
}else{
	$('.about_userLike').css({'border':'1px solid #dbdbdb','background':'#fff','color':'#999'}).html('<p><span></span>取消喜欢</p>')
}
$('.about_userLike').on('click',function(){
	console.log(isLike)
	fetch(`${baseUrl}/muma.php/like?pid=${id}&isLike=${isLike}`)
		.then(resolve=>resolve.json()
			.then(data=>{
				console.log(data)
				$('#info_like').text(data.data.isLike)
				if (isLike==1) {
					likeList.push(id)
					localStorage.setItem('likeList',JSON.stringify(likeList));
					likeList = JSON.parse(localStorage.getItem('likeList'));
					isLike=2;
					$('.about_userLike').css({'border':'1px solid #dbdbdb','background':'#fff','color':'#999'}).html('<p><span></span>取消喜欢</p>')
				}else{
					likeList.splice($.inArray(id,likeList),1);
					localStorage.setItem('likeList',JSON.stringify(likeList));
					isLike=1;
					$('.about_userLike').css({'border':'none','background':'#fa6d39','color':'#fff'}).html('<p><span></span>欣赏作品</p>')
				}
			})
		).catch(error=>alert('操作错误！'))
})
$('#return').on('click',function(){
	window.history.go(-1);
})