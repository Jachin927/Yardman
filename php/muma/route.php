<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

use think\Route;

Route::get([
    // Cat模块
    'cat' => 'index/Cat/list',
    // Browse模块
    'brs' => 'index/Browse/bro',
    // Like模块
    'like' => 'index/Like/isLike',
    // Members模块
    'members' => 'index/Members/list',
    // All模块
    'all' => 'index/All/list'
]);

//Login模块
Route::group('usr', [
    'login' => ['index/Login/login', ['method' => 'post']],
    'logged' => ['index/Login/logged', ['method' => 'get']]
]);

// Info模块
// Route::group('info', [
//     'update' => ['index/Info/update', ['method' => 'get']],
//     'face' => ['index/Info/face', ['method' => 'post']]
// ]);

// Portfolio模块
Route::group('pfl', [
    'add' => ['index/Portfolio/add', ['method' => 'post']],
    'me' => ['index/Me/portfolio', ['method' => 'get']],
    'info' => ['index/Me/info', ['method' => 'get']],
    'dtl' => ['index/Details/detail', ['method' => 'get']]
]);

// Comment模块
Route::group('cmt', [
    'add' => ['index/Cmt/add', ['method' => 'post']],
    'list' => ['index/Cmt/list', ['method' => 'get']],
    // 'del' => ['index/Cmt/del', ['method' => 'get']]
]);

return [
    '__pattern__' => [
        'name' => '\w+',
    ],
    '[hello]'     => [
        ':id'   => ['index/hello', ['method' => 'get'], ['id' => '\d+']],
        ':name' => ['index/hello', ['method' => 'post']],
    ],

];
