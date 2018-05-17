<?php
namespace app\index\model;

use think\Model;

class Comment extends Model
{
	private $_auto = ['create_time'];

	public function getCreateTimeAttr($val)
	{
		return date('Y-n-d H:i', $val);
	}
}