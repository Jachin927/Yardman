/*
Navicat MySQL Data Transfer

Source Server         : amh
Source Server Version : 50540
Source Host           : 120.24.241.80:3306
Source Database       : yardman

Target Server Type    : MYSQL
Target Server Version : 50540
File Encoding         : 65001

Date: 2018-04-01 11:19:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for yardman_user
-- ----------------------------
DROP TABLE IF EXISTS `yardman_user`;
CREATE TABLE `yardman_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户序号',
  `username` varchar(30) NOT NULL COMMENT '登录用户名',
  `password` varchar(32) NOT NULL COMMENT '登录密码',
  `name` varchar(10) NOT NULL COMMENT '姓名',
  `sex` tinyint(4) NOT NULL DEFAULT '0' COMMENT '性别',
  `nickname` varchar(20) NOT NULL COMMENT '昵称',
  `phone` varchar(11) NOT NULL COMMENT '手机',
  `face` varchar(255) NOT NULL COMMENT '头像',
  `power` int(11) NOT NULL DEFAULT '0' COMMENT '权限',
  `create_time` int(11) NOT NULL COMMENT '注册时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of yardman_user
-- ----------------------------
INSERT INTO `yardman_user` VALUES ('1', '249822459', 'e10adc3949ba59abbe56e057f20f883e', '赖文锋', '1', '灰丶', '13380802460', 'http://muma.webgz.cn/muma/public/uploads/default/face.jpg', '1', '1507860000');
INSERT INTO `yardman_user` VALUES ('2', '874545946', '32fdd60f6724911fa1693197785855af', '郑潮庆', '1', '☀', '13556469646', 'http://muma.webgz.cn/muma/public/uploads/default/face.jpg', '1', '1507860000');
INSERT INTO `yardman_user` VALUES ('3', '18318184785', '68b7c42e8cdeffc79beb494c069247f9', '邓志宏', '1', '小智', '18318184785', 'http://muma.webgz.cn/muma/public/uploads/default/face.jpg', '0', '1507860000');
INSERT INTO `yardman_user` VALUES ('4', '18320308418', '0fb28e9649b4277b28f2a6c5a798bcf2', '陈洪董', '1', '大白', '18320308418', 'http://muma.webgz.cn/muma/public/uploads/default/face.jpg', '0', '1507860000');
INSERT INTO `yardman_user` VALUES ('5', '15766635674', 'e87679c30065f5b9de8e368f53e549d9', '邱能奉', '1', '小黑', '15766635674', 'http://muma.webgz.cn/muma/public/uploads/default/face.jpg', '0', '1507860000');
INSERT INTO `yardman_user` VALUES ('6', '810580801', '09c7e7c7f0b6f3aaaa68468249f9c82c', '林威高', '1', 'erew', '15768530811', 'http://muma.webgz.cn/muma/public/uploads/default/face.jpg', '0', '1507860000');
INSERT INTO `yardman_user` VALUES ('7', '1826384068', '87df4a735ad64e79eb81388a5c53a249', '陈可维', '1', 'Allen', '18244938313', 'http://muma.webgz.cn/muma/public/uploads/default/face.jpg', '0', '1507860000');
