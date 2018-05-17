<?php 
namespace app\index\controller;

use Firebase\JWT\JWT;

class Login
{
    // 检测登录
    public function logged()
    {
        if(!input('get.token')){
            return jsonp(['code' => 403, 'msg' => '请登录']);
        }

        try{
            $id = JWT::decode(input('get.token'), KEY, array('HS256'));
        }catch(\Exception $e){
            return jsonp(['code' => 403, 'msg' => '非法token']);
        }

        $result = db('usr') -> alias('u') -> join('info i', 'u.id = i.uid') -> field('id, nickname, face, profession, direction, motto, label') -> where('u.id', $id) -> find();

        if(!$result){
             return jsonp(['code' => 403, 'msg' => '用户不存在']);
        }

        return jsonp(['code' => 200, 'data' => $result]);
    }

    // 登录
    public function login()
    {
        if(!input('post.user') || !input('post.pass')){
            return json(['code' => 403, 'msg' => '登录信息不能为空']);
        }

        $user = input('post.user');
        $pass = input('post.pass');
        $result = db('usr') -> where('user', $user) -> field('user', true) -> find();

        if(!$result){
             return json(['code' => 403, 'msg' => '用户名不存在']);
        }

        if($result['pass'] != md5($pass)){
             return json(['code' => 403, 'msg' => '密码错误']);
        }

        $jwt = JWT::encode($result['id'], KEY);
        unset($result['id'], $result['pass']);

        return json(['code' => 200, 'msg' => '登录成功', 'token' => $jwt]);
    }
}