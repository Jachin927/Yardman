<?php
namespace app\index\controller;

use Firebase\JWT\JWT;

class Me
{
    // 成员所有作品
	public function portfolio()
	{
		if(!input('get.uid')){
            return jsonp(['code' => 403, 'msg' => '请选择成员']);
        }

        $id = input('get.uid');
        $page = input('get.page') ?? input('get.page') ?? 1;

        $result = db('portfolio') -> alias('p')
								  -> join('cat c', 'p.cat = c.id')
								  -> field('p.id, p.title, p.url, p.cover, p.isLike ,p.comment, p.browse, c.name')
								  -> where('p.uid', $id)
								  -> order('p.create_time DESC')
								  -> paginate(8, false, ['page' => $page]);

		return jsonp($result);
	}

    // 成员信息
	public function info()
	{
		if(!input('get.uid')){
            return jsonp(['code' => 403, 'msg' => '请选择成员']);
        }
        $id = input('get.uid');

        $data = db('info') -> field('uid', true) -> where('uid', $id) -> find();

        if(!$data){
            return jsonp(['code' => 403, 'msg' => '没有此成员']);
        }

        $data['label'] = explode('`', $data['label']);

        $por = db('portfolio') -> field('browse, isLike') -> where('uid', $id) -> select();
        
        $popularity = 0;
        $like = 0;
        if($por){
            foreach ($por as $key) {
                $popularity += $key['browse'];
                $like += $key['isLike'];
            }
        }
        $data['popularity'] = $popularity;
        $data['isLike'] = $like;

        return jsonp(['code' => 200, 'data' => $data]);
	}
}