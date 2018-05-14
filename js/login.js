$('#username').focus(function(){
    var user = $("#username").val();
    if(user != '' || user != null){
         $('span').eq(0).css('display','none');
    }
});
$('#password').focus(function(){
    var pwd = $("#password").val();
    if(pwd != '' || pwd != null){
         $('span').eq(1).css('display','none');
    }
});

$(document).on('keyup',function(e){
    if (e.keyCode == 13) {
        $(".submit").trigger('click');
    }
});

$(".submit").click(function(){
    var user = $("#username").val();
    var pwd = $("#password").val();
    if(user == '' || user == null){
        $('span').eq(0).css('display','block');
        return false;
        $('span').eq(0).focus();
    }
    if(pwd == '' || pwd == null){
        $('span').eq(1).css('display','block');
        return false;
        $('span').eq(1).focus();
    }
    if((user != '' || user != null) && (pwd != '' || pwd != null)){
        $.ajax({
            url: "http://muma.webgz.cn/muma/index.php/login",
            type: 'POST',
            dataType:'jsonp',
            data:{username: user,password: pwd},
            success:function(data){
                var jwt = data.jwt;
                localStorage.setItem('jwt',jwt);
                window.location.href = "index.html";  
            },
            error:function(data){
                alert(data.responseJSON);
            }
        })
    }
});