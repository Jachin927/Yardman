<?php
namespace app\index\controller;

class Like
{
	// 点赞
	public function isLike()
	{
		if(!input('get.pid')){
			return jsonp(['code' => 403, 'msg' => '请选择作品']);
		}

		$pid = input('get.pid');
		
		if(input('isLike')){
			switch (input('isLike')) {
				case 1:
					db('portfolio') -> where('id', $pid) -> setInc('isLike');
					break;
				case 2:
					db('portfolio') -> where('id', $pid) -> setDec('isLike');
					break;
			}
		}

		$result = db('portfolio') -> field('isLike') -> where('id', $pid) -> find();

		return jsonp(['code' => 200, 'data' => $result]);
	}
}