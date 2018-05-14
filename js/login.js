// 账号不能为空
$('#username').focus(function(){
    var user = $("#username").val();
    if(user != '' || user != null){
         $('span').eq(0).css('display','none');
    }
});

// 密码不能为空
$('#password').focus(function(){
    var pwd = $("#password").val();
    if(pwd != '' || pwd != null){
         $('span').eq(1).css('display','none');
    }
});

// 键盘提交
$(document).on('keyup',function(e){
    if (e.keyCode == 13) {
        $(".submit").trigger('click');
    }
});

// 提交登录
$(".submit").click(function(){
    var usr = $("#username").val();
    var pwd = $("#password").val();
    if(usr == '' || usr == null){
        $('span').eq(0).css('display','block');
        return false;
        $('span').eq(0).focus();
    }
    if(pwd == '' || pwd == null){
        $('span').eq(1).css('display','block');
        return false;
        $('span').eq(1).focus();
    }
    if((usr != '' || usr != null) && (pwd != '' || pwd != null)){
        ip = 'http://10.21.40.246/muma.php/usr/login';
        init = {
            method: 'post',
            body: new FormData($('#login-form')[0])
        }
        fetch(ip, init)
        .then((response) => {
            response.json().then((data) => {
                alert(data.msg);
                if(data.code == 200){
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html';
                }
            })
        });
    }
});