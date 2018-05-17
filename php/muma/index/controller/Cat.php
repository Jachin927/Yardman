<?php
namespace app\index\controller;

class Cat
{
	// 所有分类
	public function list()
	{
		$result = db('cat') -> select();

		foreach ($result as $key) {
			if($key['cid'] == 0){
				$key['list'] = [];
				$data[] = $key;
			}
		}

		if($data != null){
			foreach ($result as $key) {
				foreach ($data as $k => $v) {
					if($key['cid'] == $v['id']){
						$data[$k]['list'][] = $key;
					}
				}
			}
		}

		return jsonp($data);
	}
}