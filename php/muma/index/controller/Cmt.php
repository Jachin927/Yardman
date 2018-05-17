<?php
namespace app\index\controller;

use Firebase\JWT\JWT;
use app\index\model\Comment;

class Cmt
{
	// 添加评论
	public function add()
	{
		if(!input('post.token')){
			return json(['code' => 403, 'msg' => '请登录']);
		}

		try{
			$id = JWT::decode(input('post.token'), KEY, array('HS256'));
		}catch(\Exception $e){
			return json(['code' => 403, 'msg' => '非法token']);
		}

		if(!input('post.pid') || !input('post.comment')){
			return json(['code' => 403, 'msg' => '评论信息不完整']);
		}

		$data['uid'] = $id;
		$data['pid'] = input('post.pid');
		$data['content'] = input('post.comment');
		$data['create_time'] = $_SERVER['REQUEST_TIME'];

		$result = db('comment') -> insert($data);

		if(!$result){
			return json(['code' => 403, 'msg' => '评论失败']);
		}

		return json(['code' => 200, 'msg' => '评论成功']);
	}

	// 列出评论
	public function list()
	{
		if(!input('get.pid')){
			return jsonp(['code' => 403, 'msg' => '请选择作品']);
		}

		$pid = input('get.pid');
		$page = input('get.page') ?? input('get.page') ?? 1;

		$comment = new Comment;
		$result = $comment -> alias('c')
							    -> join('info i', 'c.uid = i.uid')
							    -> field('c.content, c.create_time, i.nickname, i.face')
							    -> where('c.pid', $pid)
							    -> order('c.create_time DESC')
							    -> paginate(3, false, ['page' => $page]);

		if(!$result){
			return jsonp(['code' => 403, 'msg' => '没有评论']);
		}

		return jsonp(['code' => 200, 'data' => $result]);
	}

	// 删除评论
	// public function del()
	// {
	// 	if(!input('get.jwt')){
	// 		return jsonp(['code' => 403, 'msg' => '请登录']);
	// 	}

	// 	try{
	// 		$id = JWT::decode(input('get.jwt'), KEY, array('HS256'));
	// 	}catch(\Exception $e){
	// 		return jsonp(['code' => 403, 'msg' => '非法token']);
	// 	}

	// 	if(!input('get.pid')){
	// 		return jsonp(['code' => 403, 'msg' => '请选择作品']);
	// 	}

	// 	$pid = input('get.pid');

	// 	$result = db('comment') -> where(['uid' => $id, 'pid' => $pid]) -> delete();

	// 	if(!$result){
	// 		return jsonp(['code' => 403, 'msg' => '删除评论失败']);
	// 	}

	// 	return jsonp(['code' => 200, 'msg' => '删除成功']);
	// }
}