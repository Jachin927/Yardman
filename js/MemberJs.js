//获取A标签参数
let url = new URL(window.location.href);
let uid = url.searchParams.get("uid");

let list_data = new Array();//初始数据
let select_data = new Array();//上传分类
let myInfo = new Array();
let list_li = $('.list');
let baseUrl = 'http://muma.webgz.cn/php';
let token = localStorage.getItem('token');
let show = false;

if(token){
	fetchJsonp(`${baseUrl}/muma.php/usr/logged?token=${token}`)
	.then((response) => {
		response.json().then((data) => {
			if(data.code == 200){
				if (uid == data.data.id) {
					$('.release').css('display','inline-block');
				}
				$('#login_btn').css('backgroundImage', `url(${baseUrl}${data.data.face})`);
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
//获取个人信息
fetchJsonp(`${baseUrl}/muma.php/pfl/info?uid=${uid}`)
.then(resolve=>resolve.json()
	.then(data=>{
		myInfo=data;
		$('#info_face').attr('src',baseUrl+myInfo.data.face);
		$('#info_nickname').text(myInfo.data.nickname);
		$('#info_dir').text(`${myInfo.data.profession} | ${myInfo.data.direction}`);
		$('#info_motto').text(myInfo.data.motto);
		$('#info_popularity').text(myInfo.data.popularity);
		$('#info_like').text(myInfo.data.isLike);
		let info_label = $('#info_label')
		$.each(myInfo.data.label,(ind,val)=>{
			info_label.append(`<li>${val}</li>`)
		})
	})
).catch(error=>alert('操作错误！'))


//获取个人作品
function getListData(page){
	getListData.arguments.length>0?page=page:page=sessionStorage.getItem('Member_pageNum')||""
	fetchJsonp(`${baseUrl}/muma.php/pfl/me?uid=${uid}&page=${page}`)
		.then(resolve=>resolve.json()
			.then(data=>{
				list_data=data;
				//初始值改变
				$('#total').text(`作品 ${list_data.total}`);
				$('#page').text(`${list_data.current_page}/${list_data.last_page}页`);
				sessionStorage.setItem('Member_pageNum',list_data.current_page)
				list_li.html('')
				$.each(list_data.data,ind=>{
					list_li.append(`
						<li>
							<a href="DetailsWork.html?id=${list_data.data[ind].id}">
								<div class="list_shang">
									<img src=${baseUrl}${list_data.data[ind].cover}>
								</div>
								<div class="list_zhong">
									<i><span class="look"></span>${list_data.data[ind].browse}</i>
									<i><span class="comments"></span>${list_data.data[ind].comment}</i>
									<i><span class="praise"></span>${list_data.data[ind].isLike}</i>
									<h3>${list_data.data[ind].title}</h3>
								</div>
								<div class="list_xia">
									<span>${list_data.data[ind].name}</span>
								</div>
							</a>
						</li>
					`)
				})
			})
		).catch(error=>alert('操作错误！'))
}
getListData();

$('.pager>.btn_right').on('click',function(){
	if (list_data.current_page<list_data.last_page) {
		list_data.current_page++;
		getListData(list_data.current_page)
	}else{
		alert('最后一页了哦~')
	}
})
$('.pager>.btn_left').on('click',function(){
	if (list_data.current_page>1) {
		list_data.current_page--
		getListData(list_data.current_page)
	}else{
		alert('已经是第一页了哦~')
	}
})



// 发布作品模块出现
	$('.release p').on('click',function(){
		$('.bounced').css('display','flex');
		//获取上传模块分类
		let select_li=$('.select_ul li');
		fetchJsonp(`${baseUrl}/muma.php/cat`)
			.then(resolve=>resolve.json()
				.then(data=>{
					select_data = data;
					$.each(select_li,ind=>{
						$('.select_ul li').eq(ind).text(select_data[ind].name).attr('cid',select_data[ind].id)
					})
				})
			).catch(error=>alert('操作错误！'))
	})
	// 作品分类选择
	let select_content_state=false;
	$('.select span').on('click',function( ){
		if (select_content_state) {
			$('.select_content').css('display','none');
			select_content_state=false;
		}else{
			$('.select_content').css('display','block');
			$('.select_ul li').eq(0).trigger('click')
			select_content_state=true;
		}
	})
	//一级菜单栏选择
	let select_li_check;//判断网站链接是否允许输入
	$('.select_ul').on('click','li',function(){
		let ind=$(this).index();
		select_li_check=$(this).index()
		$(this).addClass('colorOrange').siblings().removeClass('colorOrange');
		$('#select_hidden').val($(this).text()+"/")
		$('.select_second_ul').html("")
		$.each(select_data[ind].list,(ind,content)=>{
			$('.select_second_ul').append('<li cat='+content.id+'>'+content.name+'</li>')
		})
	})
	//二级菜单栏选择
	$('.select_second_ul').on('click','li',function(){
		$('#select_hidden').val($('#select_hidden').val()+$(this).text())
		$('.select span').trigger('click').text($('#select_hidden').val())
		$('#cid').val($('.select_ul li').eq(select_li_check).attr('cid'));//一级菜单cid
		$('#cat').val($(this).attr('cat'));//二级菜单cat
		$('#cid').val()==2?$('#work_url').attr('disabled','disabled'):$('#work_url').removeAttr('disabled')
	})	

//上传图片读取 
$('#upload_images').on('change',function(){
	let fileList=$(this)[0].files;
	if (fileList.length>5) {
		alert('选取图片超过5张，请重新选择！');
		$('#upload_images').val('');
		let fileList="";
		return false;
	}else{
		if (window.FileReader) {
			let  num=1;
			let  reader = new FileReader();
			let that=this;
			reader.readAsDataURL(this.files[0]);
			reader.onload =function(){
				$('#uploadImg_show').append("<li><span>x</span><img src="+this.result+"></li>")
				if (num<fileList.length) {
					reader.readAsDataURL(that.files[num]);
					num++;
				}
			}
		}
	}
})

//上传封面事件
$('#upload_cover').on('change',function(){
	let  reader = new FileReader();
	reader.readAsDataURL(this.files[0]);
	reader.onload =function(){
		$('.coverimg_box').css('display','inline-block');
		$('#cover_img').attr('src',this.result)
	}
})

//上传事件
$('#btn_t').on('click',function(){
	$('#uploadIngBg').css('display','inline-block');
	let fileUrl=new Array();//上传图片路径数组
	let uploadImg_li=$('#uploadImg_show li');
	let formData=new FormData($('#upload_data')[0]);
	formData.append('cover',$('#uploadImg_show li img').attr('src'));
	formData.append('imgSum',uploadImg_li.length);
	formData.append('token',localStorage.getItem('token'))
	$.each(uploadImg_li,function(i){
		formData.append('img'+[i],$(this).children('img').attr('src'))
	})
	fetch(`${baseUrl}/muma.php/pfl/add`,{
		method:'post',
		body:formData
	}).then(resolve=>resolve.json().then(data=>{
		$('#uploadIngBg').css('display','none');
		alert(data.msg)
	})).catch(error=>{alert('操作错误！');$('#uploadIngBg').css('display','none');})
})
//关闭
$('#btn_f').on('click',function(){
	$('.bounced').css('display','none')
})
//
$('#return').on('click',function(){
	window.history.go(-1);
})
