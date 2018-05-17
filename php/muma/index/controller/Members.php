<?php
namespace app\index\controller;

class Members
{
	// 所有成员
	public function list()
	{
		$result = db('info') -> field('uid, nickname, face') -> select();

		if(!$result){
			return jsonp(['code' => 403, 'meg' => '没有成员']);
		}

		return jsonp(['code' => 200, 'data' => $result]);
	}
}