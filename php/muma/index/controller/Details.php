<?php
namespace app\index\controller;

use app\index\model\Portfolio;

class Details
{
	// 作品详情并是否增加浏览次数
	public function detail()
	{
		if(!input('get.id')){
			return jsonp(['code' => 403, 'msg' => '请选择作品']);
		}

		$pid = input('get.id');

		if(input('isAdd') && input('isAdd') == 1){
			db('portfolio') -> where('id', $pid) -> setInc('browse');
		}

		$portfolio = new Portfolio;
		$result = $portfolio -> alias('p')
							 -> join('cat c', 'p.cat = c.id')
							 -> join('info i', 'p.uid = i.uid')
							 -> field('p.id, p.title, p.url, p.images, p.isLike, p.comment, p.browse, p.create_time, c.name, i.nickname, i.face, i.direction, i.profession')
							 -> where('p.id', $pid)
							 -> find();

		$other = $portfolio -> field('id, cover') -> select();

		if($other){
			shuffle($other);
			$result['other'] = array_splice($other, 1, 4);
		}
		
		if(!$result){
			return jsonp(['code' => 403, 'msg' => '没有此作品']);
		}

		$result['images'] = explode('`', $result['images']);

		return jsonp(['code' => 200, 'data' => $result]);
	}
}