<?php
namespace app\index\controller;

use Firebase\JWT\JWT;

class Portfolio
{
	// 解析图片64位并保存
	public function base64_image_content($base64_image_content, $path, $i = ''){
	    //匹配出图片的格式
	    if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)){
	    	$ext = ['jpg', 'png'];
	        $type = $result[2];
	        if(in_array($type, $ext)){
	        	return false;
	        }
	        $new_file = $path . "/" . date('Ymd',time()) . "/";

            //检查是否有该文件夹，如果没有就创建，并给予最高权限
	        if(!file_exists($new_file)){
	            mkdir($new_file, 0777, true);
	        }

	        $new_file = $new_file . $_SERVER['REQUEST_TIME'] . $i . ".{$type}";

	        if (file_put_contents($new_file, base64_decode(str_replace($result[1], '', $base64_image_content)))){
	            return $new_file;
	        }else{
	            return false;
	        }
	    }else{
	        return false;
	    }
	}

	// 生成唯一字符串
    private function getUniname(){
        return md5(uniqid(microtime(true), true));
    }

    // 得到文件扩展名
    private function getExt($filename){
    	$pathinfo = pathinfo($filename, PATHINFO_EXTENSION);
        return strtolower($pathinfo);
    }

	// 生成缩略图（等比例缩放）
    private function thumb($filename, $destination = null, $dst_w = null, $dst_h = null){
        // 数组里值赋一个变量
        list($src_w, $src_h, $imagetype) = getimagesize($filename);
        //计算缩放比例
	    $scale = ($dst_w / $src_w) > ($dst_h / $src_h) ? $dst_h / $src_h : $dst_w / $src_w;
	    //计算缩放后的尺寸
	    $sWidth = floor($src_w*$scale);
	    $sHeight = floor($src_h*$scale);
        // 获取文件mime类型
        $mime = image_type_to_mime_type($imagetype); 
        $createfrom = str_replace("/", "createfrom", $mime);
        $outFun = str_replace("/", null, $mime);
        $src_image = $createfrom($filename);
        // 新建一个真彩色图像
        $dst_image = imagecreatetruecolor($sWidth, $sHeight);
        // 复制采样图片
        imagecopyresampled($dst_image, $src_image, 0, 0, 0, 0, $sWidth, $sHeight, $src_w, $src_h);
        if($destination && !file_exists(dirname($destination))){
            mkdir(dirname($destination), 0777, true);
        }
        $dstFilename = $destination == null ? $this -> getUniName() . "." . $this -> getExt($filename) : $destination;
        // 输出并且存放
        $outFun($dst_image, $dstFilename);
        // 释放资源
        imagedestroy($src_image);
        imagedestroy($dst_image);
        return $dstFilename;
    }

	// 发布作品
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

        if(!input('post.title') || !input('post.cid') || !input('post.cat') || !input('post.imgSum') || !input('post.cover')){
			return json(['code' => 403, 'msg' => '发布作品信息不完整']);
		}

		if(input('cid') != 2){
			if(!input('post.work_url')){
				return json(['code' => 403, 'msg' => '作品地址不能为空']);
			}
			$data['url'] = input('post.work_url');
		}

		$sum = input('post.imgSum');
		for($i = 0; $i < $sum; $i++){
			$images[] = input('post.img' . $i);
		}

		if(is_null($images)){
			return json(['code' => 403, 'msg' => '没有图片上传']);
		}
		
		$i = 1;
		$path = ROOT_PATH . 'public/uploads/muma/portfolio';
		foreach ($images as $image) {
			$img = $this -> base64_image_content($image, $path, $i);

			if(!$img){
				return json(['code' => 403, 'msg' => '上传文件失败']);
			}

			if(filesize($img) > 2097152){
				return json(['code' => 403, 'msg' => '文件超出限制大小']);
			}

			$src = $this -> thumb($img, $img, 800, 600);
			$imgArr[] = addcslashes(str_replace(ROOT_PATH, '/', $src), '"');
			$i++;
		}

		$cover_path = ROOT_PATH . 'public/uploads/muma/cover';
		$cover = $this -> base64_image_content(input('post.cover'), $cover_path);
		$cover_src = str_replace(ROOT_PATH, '/', $cover);

		if(!$cover){
			return json(['code' => 403, 'msg' => '上传文件失败']);
		}

		$data['title'] = input('post.title');
		$data['cid'] = input('post.cid');
		$data['cat'] = input('post.cat');
		$data['images'] = implode('`', $imgArr);
		$data['cover'] = $cover_src;
		$data['uid'] = $id;
		$data['create_time'] = $_SERVER['REQUEST_TIME'];

		$result = db('portfolio') -> insert($data);

		if(!$result){
			return json(['code' => 403, 'msg' => '发布失败']);
		}

		return json(['code' => 200, 'msg' => '发布成功']);
	}
}