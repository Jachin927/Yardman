<?php
namespace app\index\controller;

class All
{
	// 大分类所有作品
	public function list(int $num, $page = 1)
	{
		$result = db('portfolio') -> alias('p')
								  -> join('cat c', 'p.cat = c.id')
								  -> join('info i', 'p.uid = i.uid')
								  -> field('p.id, p.title, p.cover, p.isLike, p.comment, p.browse ,c.name, i.nickname, i.face')
								  -> where('p.cid', $num)
								  -> order('p.create_time DESC')
								  -> paginate(8, false, ['page' => $page]);

		return jsonp($result);
	}
}