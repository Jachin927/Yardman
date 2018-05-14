$(function(){
	// 初始数据获取
	let select_data=new Array();
	let select_li=$('.select_ul li');
	fetch('http://10.21.40.246/muma.php/cat')
		.then(resolve=>resolve.json()
			.then(data=>{
				select_data = data;
				$.each(select_li,ind=>{
					$('.select_ul li').eq(ind).text(select_data[ind].name).attr('cid',select_data[ind].id)
				})
			})
		).catch(error=>alert('操作错误！'))

	// 发布作品模块出现
		$('.release p').on('click',function(){
			$('.bounced').css('display','flex');
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
			console.log($('#cid').val())
			$('#cid').val()==2?$('#work_url').attr('disabled','disabled'):$('#work_url').removeAttr('disabled')
		})

	// 标签栏切换
	// let upload_images=document.getElementById("upload_images")
	// $('#upload_images').eq(0).on('change',function(){
	// 	let fileType= new Array('jpg','png');
	// 	let file=$(this).files[0]
	// 	console.log(file)
	// 	console.log($(this).val())
	// })	


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
		let fileUrl=new Array();//上传图片路径数组
		let uploadImg_li=$('#uploadImg_show li');
		let formData=new FormData($('#upload_data')[0]);
		formData.append('cover',$('#uploadImg_show li img').attr('src'));
		formData.append('imgSum',uploadImg_li.length);
		formData.append('token',localStorage.getItem('token'))
		$.each(uploadImg_li,function(i){
			formData.append('img'+[i],$(this).children('img').attr('src'))
			// console.log(formData.get('img'+[i]))
		})
		// console.log(formData.get('imgSum'))

		/*$.ajax({
			url:'http://10.21.40.246/muma.php/pfl/add',
			type:'POST'
			dataType:'json',
			data:formData,
			success:function(data){

			}
		})*/
		fetch('http://10.21.40.246/muma.php/pfl/add',{
			method:'post',
			body:formData
		}).then(resolve=>resolve.json().then(data=>{
			console.log(data)
			// alert(data.msg);
			// if (data.code==200) {
			// 	window.location.reload()
			// }
		})).catch(error=>alert('操作错误！'))
	})
	//关闭
	$('#btn_f').on('click',function(){
		$('.bounced').css('display','none')
	})
})