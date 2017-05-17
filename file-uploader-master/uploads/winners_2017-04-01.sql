# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 111.206.211.62 (MySQL 5.0.75)
# Database: winners
# Generation Time: 2017-04-01 06:15:46 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table tb_capital_conf
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_capital_conf`;

CREATE TABLE `tb_capital_conf` (
  `ACCOUNTID` varchar(64) NOT NULL COMMENT '券商的登录帐号,如:平安帐号。表的主键',
  `USERID` int(11) NOT NULL default '0' COMMENT '用户ID,是tb_user_basic的外键.',
  `MAXBUY` float NOT NULL default '0' COMMENT '最大可买金额,单位:RMB,元.取float最大值',
  `BUYAMOUNT` float default '0' COMMENT '取最大值，同上',
  `BUYPERCENT` float NOT NULL default '0.5' COMMENT '一次买入的比例，默认为0.5',
  `SELLPERCENT` float default '1' COMMENT '一次卖出的比例,默认为1.0',
  `SPLITCOUNT` int(11) default '1' COMMENT '拆成多少个单提交，默认为1',
  `ADDTIME` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '添加时间,添加之后不要修改',
  `MODTIME` datetime NOT NULL default '0000-00-00 00:00:00' COMMENT '信息最后修改时间',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ACCOUNTID`),
  KEY `userid` (`USERID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_capital_conf` WRITE;
/*!40000 ALTER TABLE `tb_capital_conf` DISABLE KEYS */;

INSERT INTO `tb_capital_conf` (`ACCOUNTID`, `USERID`, `MAXBUY`, `BUYAMOUNT`, `BUYPERCENT`, `SELLPERCENT`, `SPLITCOUNT`, `ADDTIME`, `MODTIME`, `REMARK`)
VALUES
	('301719804403',20000,0,0,0.4,1,1,'2017-02-23 09:11:14','2017-02-23 09:10:06',''),
	('303900021793',20000,0,0,0.4,1,1,'2017-02-23 09:10:28','2017-02-23 09:10:06',''),
	('303900021796',10000,5000,0,0.4,1,1,'2017-03-17 10:50:05','2017-02-23 09:10:06',''),
	('390100060685',20000,0,0,0.4,1,1,'2017-02-23 09:11:16','2017-02-23 09:10:06',''),
	('5890000049',10000,1000,0,0.4,1,1,'2017-03-17 10:50:02','2017-02-23 09:10:06','');

/*!40000 ALTER TABLE `tb_capital_conf` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_dict_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_dict_group`;

CREATE TABLE `tb_dict_group` (
  `ID` int(11) NOT NULL COMMENT '分组ID值,主键',
  `NAME` varchar(64) default NULL COMMENT '组名称,主要为策略使用分配',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_dict_group` WRITE;
/*!40000 ALTER TABLE `tb_dict_group` DISABLE KEYS */;

INSERT INTO `tb_dict_group` (`ID`, `NAME`, `REMARK`)
VALUES
	(0,'普通用户',NULL),
	(1,'银牌客户',NULL),
	(2,'金牌客户',NULL),
	(3,'VIP1',NULL),
	(4,'VIP2',NULL),
	(5,'VIP3',NULL),
	(6,'私募',NULL);

/*!40000 ALTER TABLE `tb_dict_group` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_dict_policygid
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_dict_policygid`;

CREATE TABLE `tb_dict_policygid` (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `NAME` varchar(256) default NULL,
  `REMARK` varchar(256) default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_dict_trade
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_dict_trade`;

CREATE TABLE `tb_dict_trade` (
  `ID` int(11) NOT NULL COMMENT '券商公司ID，主键',
  `NAME` varchar(64) default NULL COMMENT '券商中文名称，用于页面展示下拉列表',
  `ENDPOINT` varchar(8192) NOT NULL COMMENT '服务器IP:port:stats状态列表,可使用的服务器列表',
  `VERSION` varchar(32) default NULL,
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_dict_trade` WRITE;
/*!40000 ALTER TABLE `tb_dict_trade` DISABLE KEYS */;

INSERT INTO `tb_dict_trade` (`ID`, `NAME`, `ENDPOINT`, `VERSION`, `REMARK`)
VALUES
	(0,'未知券商','','1.0.0',NULL),
	(1,'平安证券','202.69.19.56:7738,116.228.52.78:7738,202.69.19.56:7708,116.228.52.71:80','1.68',NULL),
	(2,'招商证券','119.145.12.67:443;221.130.42.52:443;202.106.83.199:443','2.87',NULL),
	(3,'广发证券','222.221.241.178:7708','1.1',NULL),
	(4,'国泰君安','1.1.1.1:11','1.1',NULL);

/*!40000 ALTER TABLE `tb_dict_trade` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_log_login
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_log_login`;

CREATE TABLE `tb_log_login` (
  `ROWID` bigint(20) NOT NULL auto_increment COMMENT '自增，主键',
  `USERID` int(11) default '0' COMMENT '用户ID',
  `LOGIN` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '登录时间',
  `LOGOUT` datetime default NULL COMMENT '退出系统时间',
  `IPADDRESS` varchar(32) default NULL COMMENT '登录IP地址',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  UNIQUE KEY `ROWID` (`ROWID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_order_id
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_order_id`;

CREATE TABLE `tb_order_id` (
  `ORDERID` int(11) NOT NULL auto_increment,
  `USERID` int(11) default '0',
  `ACCOUNTID` varchar(64) NOT NULL default '0',
  `POLICYID` int(11) NOT NULL default '0' COMMENT '策略ID',
  `POLICYPARAM` varchar(8192) default NULL COMMENT '策略使用的参数',
  `DIRTYPE` smallint(6) default '1' COMMENT '0买入|1卖出|9撤单',
  `STARTTIME` date default NULL COMMENT '策略可生效的开始时间',
  `ENDTIME` date default NULL COMMENT '策略可生效的终止时间',
  `STOCKSET` text COMMENT '策略生效于哪些股票代码',
  `ISTEST` smallint(6) default '1',
  `BUYAMOUNT` float default '0',
  `BUYPERCENT` float default '0',
  `SELLPERCENT` float default '1',
  `STATUS` int(11) default '0' COMMENT '0:等待中,1:已读取,2:等待交易,3:部分成交,4:全部完成',
  `ADDTIME` timestamp NULL default NULL,
  `REMARK` varchar(255) default NULL,
  PRIMARY KEY  (`ORDERID`,`ACCOUNTID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_order_id` WRITE;
/*!40000 ALTER TABLE `tb_order_id` DISABLE KEYS */;

INSERT INTO `tb_order_id` (`ORDERID`, `USERID`, `ACCOUNTID`, `POLICYID`, `POLICYPARAM`, `DIRTYPE`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `ISTEST`, `BUYAMOUNT`, `BUYPERCENT`, `SELLPERCENT`, `STATUS`, `ADDTIME`, `REMARK`)
VALUES
	(1,20000,'309219249819',11,NULL,0,NULL,NULL,NULL,0,0,0.5,1,0,NULL,NULL),
	(1,10000,'5890000049',11,NULL,0,NULL,NULL,NULL,0,0,0.2,1,0,NULL,NULL),
	(2,20000,'309219249819',22,NULL,1,NULL,NULL,NULL,0,0,0,1,0,NULL,NULL),
	(2,10000,'5890000049',22,NULL,1,NULL,NULL,NULL,0,0,0,1,0,NULL,NULL);

/*!40000 ALTER TABLE `tb_order_id` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_policy_define
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_policy_define`;

CREATE TABLE `tb_policy_define` (
  `POLICYID` int(11) NOT NULL default '0' COMMENT '策略ID,主键',
  `PGROUPID` int(11) default '0' COMMENT '策略组ID,打板，低吸',
  `PNAME` varchar(255) NOT NULL COMMENT '策略名称,对策略的简要描述',
  `DIRTYPE` int(11) NOT NULL default '0' COMMENT '策略类型:0买入/1卖出',
  `USERID` int(11) NOT NULL COMMENT '创建策略的用户ID',
  `USETYPE` varchar(255) NOT NULL COMMENT '可被免费，付费，包月使用？',
  `POLICYPARAM` varchar(8192) default NULL COMMENT '策略使用的参数',
  `STARTTIME` date default NULL COMMENT '策略可生效的开始时间',
  `ENDTIME` date default NULL COMMENT '策略可生效的终止时间',
  `STOCKSET` text COMMENT '策略生效于哪些股票代码',
  `BUYPERCENT` float default '0.3' COMMENT '策略买入比例',
  `SELLPERCENT` float default '1' COMMENT '卖出比例，默认为1',
  `ISTEST` smallint(6) default '1' COMMENT '是否是测试策略',
  `PRICES` int(11) NOT NULL default '1000' COMMENT '策略的价值定义,原始策略价值',
  `ADDTIME` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '策略创建时间',
  `MODTIME` datetime NOT NULL default '0000-00-00 00:00:00' COMMENT '最后修改时间',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`POLICYID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_policy_define` WRITE;
/*!40000 ALTER TABLE `tb_policy_define` DISABLE KEYS */;

INSERT INTO `tb_policy_define` (`POLICYID`, `PGROUPID`, `PNAME`, `DIRTYPE`, `USERID`, `USETYPE`, `POLICYPARAM`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `BUYPERCENT`, `SELLPERCENT`, `ISTEST`, `PRICES`, `ADDTIME`, `MODTIME`, `REMARK`)
VALUES
	(11,0,'打板买入',0,0,'1,3,4','1500','0000-00-00','0000-00-00',NULL,0.3,1,1,1000,'2017-03-30 10:49:12','0000-00-00 00:00:00',NULL);

/*!40000 ALTER TABLE `tb_policy_define` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_policy_usage
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_policy_usage`;

CREATE TABLE `tb_policy_usage` (
  `USERID` int(11) NOT NULL default '0' COMMENT '券商的帐号ID',
  `PNAME` varchar(256) default NULL COMMENT '策略名称,对策略的简要描述',
  `POLICYID` int(11) NOT NULL default '0' COMMENT '策略ID',
  `POLICYPARAM` varchar(8192) default NULL COMMENT '策略使用的参数',
  `DIRTYPE` smallint(6) default '1' COMMENT '0买入|1卖出|9撤单',
  `STARTTIME` date default NULL COMMENT '策略可生效的开始时间',
  `ENDTIME` date default NULL COMMENT '策略可生效的终止时间',
  `STOCKSET` text COMMENT '策略生效于哪些股票代码',
  `ISTEST` smallint(6) default '1',
  `STATUS` smallint(6) default '0' COMMENT '0:等待中,1:已读取,2:等待交易,3:部分成交,4:全部完成',
  `FALG` smallint(6) default '0' COMMENT '策略是否启用,可临时关闭策略,而不删除DB记录',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  `SUBSCRBLE` tinyint(1) default NULL COMMENT '是否订阅，1订阅，0退订',
  `BUYPERCENT` float default '0.3' COMMENT '策略买入比例'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_policy_usage` WRITE;
/*!40000 ALTER TABLE `tb_policy_usage` DISABLE KEYS */;

INSERT INTO `tb_policy_usage` (`USERID`, `PNAME`, `POLICYID`, `POLICYPARAM`, `DIRTYPE`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `FALG`, `REMARK`, `SUBSCRBLE`, `BUYPERCENT`)
VALUES
	(0,NULL,0,NULL,1,NULL,NULL,NULL,1,0,0,NULL,NULL,0.3);

/*!40000 ALTER TABLE `tb_policy_usage` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_snap_cancel_order
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_snap_cancel_order`;

CREATE TABLE `tb_snap_cancel_order` (
  `ROWID` bigint(20) NOT NULL auto_increment COMMENT '自增字段，主键',
  `ACCOUNTID` varchar(32) NOT NULL default '0' COMMENT '证券代码',
  `LOGTIME` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `ORDERTIME` varchar(32) default '0' COMMENT '委托时间',
  `GDDM` varchar(32) default NULL COMMENT '股东代码',
  `KIND` smallint(6) default '0' COMMENT '帐号类别',
  `STOCKID` varchar(64) NOT NULL COMMENT '股票代码',
  `STOCKNAME` varchar(64) default NULL COMMENT '股票名称',
  `ORDER_PRICE` float default '0' COMMENT '委托价格',
  `ORDER_QUANTITY` int(11) default '0' COMMENT '委托数量',
  `ORDER_AMOUNT` float default '0' COMMENT '委托金额',
  `DEAL_PRICE` float default '0' COMMENT '成交价格',
  `DEAL_QUANTITY` int(11) default '0' COMMENT '成交数量',
  `CANCEL_QUANTITY` int(11) default '0' COMMENT '已撤数量',
  `WEITUOID` varchar(32) default '0' COMMENT '委托编号',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ROWID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_snap_cancel_order` WRITE;
/*!40000 ALTER TABLE `tb_snap_cancel_order` DISABLE KEYS */;

INSERT INTO `tb_snap_cancel_order` (`ROWID`, `ACCOUNTID`, `LOGTIME`, `ORDERTIME`, `GDDM`, `KIND`, `STOCKID`, `STOCKNAME`, `ORDER_PRICE`, `ORDER_QUANTITY`, `ORDER_AMOUNT`, `DEAL_PRICE`, `DEAL_QUANTITY`, `CANCEL_QUANTITY`, `WEITUOID`, `REMARK`)
VALUES
	(5,'309219249819','2017-03-29 10:41:30','10:38:41','0156011732',0,'002489','Õã½­ÓÀÇ¿',7.5,200,1500,0,0,0,'BJZRNGC2',NULL),
	(6,'5890000049','2017-03-29 10:41:31','10:38:42','0125561330',0,'002489','Õã½­ÓÀÇ¿',7.5,2000,15000,0,0,0,'7',NULL),
	(7,'309219249819','2017-03-29 11:16:40','10:38:41','0156011732',0,'002489','Õã½­ÓÀÇ¿',7.5,200,1500,0,0,0,'BJZRNGC2',NULL),
	(8,'5890000049','2017-03-29 11:16:40','10:38:42','0125561330',0,'002489','Õã½­ÓÀÇ¿',7.5,2000,15000,0,0,0,'7',NULL),
	(9,'309219249819','2017-03-29 11:16:54','10:38:41','0156011732',0,'002489','Õã½­ÓÀÇ¿',7.5,200,1500,0,0,0,'BJZRNGC2',NULL),
	(10,'5890000049','2017-03-29 11:16:55','10:38:42','0125561330',0,'002489','Õã½­ÓÀÇ¿',7.5,2000,15000,0,0,0,'7',NULL),
	(11,'309219249819','2017-03-29 13:30:53','13:29:58','0156011732',0,'002489','Õã½­ÓÀÇ¿',7.53,200,1506,0,0,0,'BJZRO74R',NULL),
	(12,'5890000049','2017-03-29 13:30:54','13:29:59','0125561330',0,'002489','Õã½­ÓÀÇ¿',7.53,2000,15060,0,0,0,'10',NULL),
	(13,'5890000049','2017-03-30 09:32:58','09:32:56','A738685727',0,'603138','º£Á¿Êý¾Ý',80.08,100,8008,0,0,0,'17',NULL),
	(14,'309219249819','2017-03-30 09:38:52','09:38:49','A720722620',1,'600545','ÐÂ½®³Ç½¨',15.04,100,1504,0,0,0,'95673061',NULL),
	(15,'5890000049','2017-03-30 09:45:49','09:45:46','0125561330',0,'002040','ÄÏ¾©¸Û',27.18,400,10872,0,0,0,'23',NULL),
	(16,'5890000049','2017-03-30 09:45:52','09:45:46','0125561330',0,'002040','ÄÏ¾©¸Û',27.18,400,10872,0,0,0,'23',NULL),
	(17,'309219249819','2017-03-30 10:08:37','10:00:27','0156011732',0,'002489','Õã½­ÓÀÇ¿',7.85,400,3140,0,0,0,'BJZRPPDS',NULL),
	(18,'5890000049','2017-03-30 10:08:38','10:00:28','0125561330',1,'002489','Õã½­ÓÀÇ¿',7.85,100,785,0,0,0,'26',NULL),
	(19,'309219249819','2017-03-30 10:08:40','10:00:27','0156011732',0,'002489','Õã½­ÓÀÇ¿',7.85,400,3140,0,0,0,'BJZRPPDS',NULL),
	(20,'5890000049','2017-03-30 10:08:41','10:00:28','0125561330',1,'002489','Õã½­ÓÀÇ¿',7.85,100,785,0,0,0,'26',NULL),
	(21,'309219249819','2017-03-30 10:09:09','10:00:27','0156011732',0,'002489','Õã½­ÓÀÇ¿',7.85,400,3140,0,0,0,'BJZRPPDS',NULL),
	(22,'5890000049','2017-03-30 10:09:09','10:00:28','0125561330',1,'002489','Õã½­ÓÀÇ¿',7.85,100,785,0,0,0,'26',NULL),
	(23,'309219249819','2017-03-30 10:09:10','10:00:27','0156011732',0,'002489','Õã½­ÓÀÇ¿',7.85,400,3140,0,0,0,'BJZRPPDS',NULL),
	(24,'5890000049','2017-03-30 10:09:11','10:00:28','0125561330',1,'002489','Õã½­ÓÀÇ¿',7.85,100,785,0,0,0,'26',NULL),
	(25,'5890000049','2017-03-30 23:00:07','22:57:44','0125561330',0,'002489','Õã½­ÓÀÇ¿',7.51,500,3755,0,0,0,'36',NULL);

/*!40000 ALTER TABLE `tb_snap_cancel_order` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_snap_capital
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_snap_capital`;

CREATE TABLE `tb_snap_capital` (
  `ROWID` bigint(20) NOT NULL auto_increment COMMENT '自增字段，主键',
  `ACCOUNTID` varchar(32) NOT NULL default '0' COMMENT '券商的帐号ID',
  `LOGTIME` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `REMAINING` float default '0' COMMENT '资金余额',
  `USEAVAIL` float default '0' COMMENT '可用资金',
  `WITHDROW` float default '0' COMMENT '可取资金',
  `FLIGHT` float default '0' COMMENT '在途资金',
  `FREEZE` float default '0' COMMENT '冻结资金',
  `STOCKVALUE` float default '0' COMMENT '最新市值',
  `SUMASSERTS` float default '0' COMMENT '总资产',
  `FLAG` int(11) default '0' COMMENT '标志位',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ROWID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_snap_capital` WRITE;
/*!40000 ALTER TABLE `tb_snap_capital` DISABLE KEYS */;

INSERT INTO `tb_snap_capital` (`ROWID`, `ACCOUNTID`, `LOGTIME`, `REMAINING`, `USEAVAIL`, `WITHDROW`, `FLIGHT`, `FREEZE`, `STOCKVALUE`, `SUMASSERTS`, `FLAG`, `REMARK`)
VALUES
	(1,'309219249819','2017-03-28 19:00:46',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(2,'5890000049','2017-03-28 19:00:46',30976.8,23471.8,30976.8,0,7505,0,23471.8,0,NULL),
	(3,'309219249819','2017-03-29 08:48:06',8068.67,3473.67,3473.67,0,4595,0,8068.67,0,NULL),
	(4,'5890000049','2017-03-29 08:48:06',30976.8,30976.8,30976.8,0,0,0,30976.8,0,NULL),
	(5,'309219249819','2017-03-29 11:16:39',8068.67,1968.67,1968.67,0,1505,4728,8201.67,0,NULL),
	(6,'5890000049','2017-03-29 11:16:39',30976.8,15971.8,30976.8,0,15005,0,15971.8,0,NULL),
	(7,'309219249819','2017-03-29 13:28:39',8068.67,3473.67,3473.67,0,0,4686,8159.67,0,NULL),
	(8,'5890000049','2017-03-29 13:28:39',30976.8,30976.8,30976.8,0,0,0,30976.8,0,NULL),
	(9,'309219249819','2017-03-29 13:43:01',8068.67,3473.67,3473.67,0,0,4716,8189.67,0,NULL),
	(10,'5890000049','2017-03-29 13:43:01',30976.8,29407.8,30976.8,0,0,0,29407.8,0,NULL),
	(11,'309219249819','2017-03-29 13:59:48',8068.67,3473.67,3473.67,0,0,4722,8195.67,0,NULL),
	(12,'5890000049','2017-03-29 13:59:48',30976.8,29407.8,29407.8,0,0,29407.8,58815.5,0,NULL),
	(13,'5890000049','2017-03-29 14:01:20',30976.8,29407.8,29407.8,0,0,29407.8,58815.5,0,NULL),
	(14,'5890000049','2017-03-29 14:03:01',30976.8,29407.8,29407.8,0,0,29407.8,58815.5,0,NULL),
	(15,'5890000049','2017-03-29 14:06:28',30976.8,29407.8,29407.8,0,0,29407.8,58815.5,0,NULL),
	(16,'5890000049','2017-03-29 14:08:24',30976.8,29407.8,29407.8,0,0,29407.8,58815.5,0,NULL),
	(17,'5890000049','2017-03-29 14:15:31',30976.8,29407.8,30976.8,0,0,29407.8,30976.8,0,NULL),
	(18,'309219249819','2017-03-30 08:49:48',3473.67,3473.67,3473.67,0,0,4752,8225.67,0,NULL),
	(19,'5890000049','2017-03-30 08:49:49',29407.8,29407.8,29407.8,0,0,29407.8,29407.8,0,NULL),
	(20,'309219249819','2017-03-30 09:02:49',3473.67,3473.67,3473.67,0,0,4752,8225.67,0,NULL),
	(21,'5890000049','2017-03-30 09:02:49',29407.8,29407.8,29407.8,0,0,29407.8,29407.8,0,NULL),
	(22,'309219249819','2017-03-30 17:59:18',3473.67,5184.53,3473.67,3131.86,0,2970,8154.53,0,NULL),
	(23,'5890000049','2017-03-30 17:59:18',29407.8,9548.99,9548.99,0,0,9548.99,29407.8,0,NULL),
	(24,'309219249819','2017-03-30 18:03:50',3473.67,5184.53,3473.67,3131.86,0,2970,8154.53,0,NULL),
	(25,'5890000049','2017-03-30 18:03:50',29407.8,9548.99,9548.99,0,0,9548.99,29407.8,0,NULL),
	(26,'309219249819','2017-03-30 18:06:48',3473.67,5184.53,3473.67,3131.86,0,2970,8154.53,0,NULL),
	(27,'5890000049','2017-03-30 18:06:49',29407.8,9548.99,9548.99,0,0,9548.99,29407.8,0,NULL),
	(28,'309219249819','2017-03-30 22:54:52',5184.53,5184.53,5184.53,0,0,2970,8154.53,0,NULL),
	(29,'5890000049','2017-03-30 22:54:52',9548.99,9548.99,9548.99,0,0,9548.99,9548.99,0,NULL),
	(30,'309219249819','2017-03-30 22:56:35',5184.53,5184.53,5184.53,0,0,2970,8154.53,0,NULL),
	(31,'5890000049','2017-03-30 22:56:35',9548.99,9548.99,9548.99,0,0,9548.99,9548.99,0,NULL),
	(32,'309219249819','2017-03-31 08:49:54',5184.53,5184.53,5184.53,0,0,2970,8154.53,0,NULL),
	(33,'5890000049','2017-03-31 08:49:55',9548.99,9548.99,9548.99,0,0,9548.99,9548.99,0,NULL),
	(34,'309219249819','2017-04-01 08:47:23',8209.49,8209.49,8209.49,0,0,0,8209.49,0,NULL);

/*!40000 ALTER TABLE `tb_snap_capital` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_snap_hisorder
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_snap_hisorder`;

CREATE TABLE `tb_snap_hisorder` (
  `ROWID` bigint(20) NOT NULL auto_increment COMMENT '自增字段，主键',
  `ACCOUNTID` int(11) default '0' COMMENT '券商的帐号ID',
  `LOGTIME` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `STOCKID` int(11) default '0' COMMENT '股票代码',
  `DIRTYPE` int(11) default '0' COMMENT '交易类型：0买入 1卖出',
  `AMOUNT` float default NULL COMMENT '交易金额',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ROWID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_snap_position
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_snap_position`;

CREATE TABLE `tb_snap_position` (
  `ROWID` bigint(20) NOT NULL auto_increment COMMENT '自增字段，主键',
  `ACCOUNTID` varchar(32) NOT NULL default '0' COMMENT '券商的帐号ID',
  `LOGTIME` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `STOCKID` varchar(64) NOT NULL COMMENT '股票代码',
  `STOCKNAME` varchar(64) default NULL COMMENT '股票名称',
  `REMAIN` int(11) default '0' COMMENT '股份余额',
  `SELL` int(11) default '0' COMMENT '可用股份',
  `COST` float default '0' COMMENT '成本价',
  `PRICE` float default '0' COMMENT '当前价',
  `NEWVALUE` float default '0' COMMENT '最新市值',
  `PROFIT` float default '0' COMMENT '浮动盈亏',
  `PROFITRATIO` float default '0' COMMENT '盈亏比例',
  `FREESE` int(11) default '0' COMMENT '冻结数量',
  `UNUFREESE` int(11) default '0' COMMENT '异常冻结',
  `FLIGHT` int(11) default '0' COMMENT '在途股份',
  `OWN` int(11) default '0' COMMENT '当前拥股',
  `GDDM` varchar(32) default NULL COMMENT '股东代码',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ROWID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_snap_position` WRITE;
/*!40000 ALTER TABLE `tb_snap_position` DISABLE KEYS */;

INSERT INTO `tb_snap_position` (`ROWID`, `ACCOUNTID`, `LOGTIME`, `STOCKID`, `STOCKNAME`, `REMAIN`, `SELL`, `COST`, `PRICE`, `NEWVALUE`, `PROFIT`, `PROFITRATIO`, `FREESE`, `UNUFREESE`, `FLIGHT`, `OWN`, `GDDM`, `REMARK`)
VALUES
	(1,'309219249819','2017-03-29 11:16:39','002489','Õã½­ÓÀÇ¿',0,0,7.658,7.87,4722,127,2.76,0,0,600,600,'0156011732',NULL),
	(2,'309219249819','2017-03-29 13:28:40','002489','Õã½­ÓÀÇ¿',0,0,7.658,7.82,4692,97,2.11,0,0,600,600,'0156011732',NULL),
	(3,'309219249819','2017-03-29 13:43:02','002489','Õã½­ÓÀÇ¿',0,0,7.658,7.85,4710,115,2.5,0,0,600,600,'0156011732',NULL),
	(4,'309219249819','2017-03-29 13:59:48','002489','Õã½­ÓÀÇ¿',0,0,7.658,7.88,4728,133,2.89,0,0,600,600,'0156011732',NULL),
	(5,'5890000049','2017-03-29 14:08:28','002489','Õã½­ÓÀÇ¿',200,0,7.845,7.87,1574,5,0.32,0,0,0,200,'0125561330',NULL),
	(6,'5890000049','2017-03-29 14:15:31','002489','Õã½­ÓÀÇ¿',200,0,7.845,7.88,1576,7,0.45,0,0,0,200,'0125561330',NULL),
	(7,'309219249819','2017-03-30 08:49:49','002489','Õã½­ÓÀÇ¿',600,600,7.658,7.92,4752,157,3.42,0,0,0,600,'0156011732',NULL),
	(8,'5890000049','2017-03-30 08:49:50','002489','Õã½­ÓÀÇ¿',200,200,7.845,7.92,1584,15,0.96,0,0,0,400,'0125561330',NULL),
	(9,'309219249819','2017-03-30 09:02:49','002489','Õã½­ÓÀÇ¿',600,600,7.658,7.92,4752,157,3.42,0,0,0,600,'0156011732',NULL),
	(10,'5890000049','2017-03-30 09:02:49','002489','Õã½­ÓÀÇ¿',200,200,7.845,7.92,1584,15,0.96,0,0,0,400,'0125561330',NULL),
	(11,'309219249819','2017-03-30 17:59:19','000993','Ãö¶«µçÁ¦',0,0,14.21,14.16,1416,-5,-0.35,0,0,100,100,'0156011732',NULL),
	(12,'309219249819','2017-03-30 17:59:19','002489','Õã½­ÓÀÇ¿',600,200,7.316,7.77,1554,90.86,6.21,0,0,0,200,'0156011732',NULL),
	(13,'5890000049','2017-03-30 17:59:19','002040','ÄÏ¾©¸Û',400,0,27.193,26.51,10604,-273,-2.51,0,0,0,400,'0125561330',NULL),
	(14,'5890000049','2017-03-30 17:59:19','002489','Õã½­ÓÀÇ¿',0,0,0,7.77,0,-17.57,0,0,0,0,0,'0125561330',NULL),
	(15,'5890000049','2017-03-30 17:59:19','600545','ÐÂ½®³Ç½¨',700,0,15.047,15.04,10528,-5.21,-0.05,0,0,0,700,'A738685727',NULL),
	(16,'309219249819','2017-03-30 18:03:50','000993','Ãö¶«µçÁ¦',0,0,14.21,14.16,1416,-5,-0.35,0,0,100,100,'0156011732',NULL),
	(17,'309219249819','2017-03-30 18:03:50','002489','Õã½­ÓÀÇ¿',600,200,7.316,7.77,1554,90.86,6.21,0,0,0,200,'0156011732',NULL),
	(18,'5890000049','2017-03-30 18:03:51','002040','ÄÏ¾©¸Û',400,0,27.193,26.51,10604,-273,-2.51,0,0,0,400,'0125561330',NULL),
	(19,'5890000049','2017-03-30 18:03:51','002489','Õã½­ÓÀÇ¿',0,0,0,7.77,0,-17.57,0,0,0,0,0,'0125561330',NULL),
	(20,'5890000049','2017-03-30 18:03:51','600545','ÐÂ½®³Ç½¨',700,0,15.047,15.04,10528,-5.21,-0.05,0,0,0,700,'A738685727',NULL),
	(21,'309219249819','2017-03-30 18:06:49','000993','Ãö¶«µçÁ¦',0,0,14.21,14.16,1416,-5,-0.35,0,0,100,100,'0156011732',NULL),
	(22,'309219249819','2017-03-30 18:06:49','002489','Õã½­ÓÀÇ¿',600,200,7.316,7.77,1554,90.86,6.21,0,0,0,200,'0156011732',NULL),
	(23,'5890000049','2017-03-30 18:06:49','002040','ÄÏ¾©¸Û',400,0,27.193,26.51,10604,-273,-2.51,0,0,0,400,'0125561330',NULL),
	(24,'5890000049','2017-03-30 18:06:49','002489','Õã½­ÓÀÇ¿',0,0,0,7.77,0,-17.57,0,0,0,0,0,'0125561330',NULL),
	(25,'5890000049','2017-03-30 18:06:50','600545','ÐÂ½®³Ç½¨',700,0,15.047,15.04,10528,-5.21,-0.05,0,0,0,700,'A738685727',NULL),
	(26,'309219249819','2017-03-30 22:54:52','000993','Ãö¶«µçÁ¦',100,100,14.21,14.16,1416,-5,-0.35,0,0,0,100,'0156011732',NULL),
	(27,'309219249819','2017-03-30 22:54:52','002489','Õã½­ÓÀÇ¿',200,200,7.316,7.77,1554,90.86,6.21,0,0,0,200,'0156011732',NULL),
	(28,'5890000049','2017-03-30 22:54:52','002040','ÄÏ¾©¸Û',400,400,27.193,26.51,10604,-273,-2.51,0,0,0,800,'0125561330',NULL),
	(29,'5890000049','2017-03-30 22:54:53','600545','ÐÂ½®³Ç½¨',700,700,15.047,15.04,10528,-5.21,-0.05,0,0,0,1400,'A738685727',NULL),
	(30,'309219249819','2017-03-30 22:56:35','000993','Ãö¶«µçÁ¦',100,100,14.21,14.16,1416,-5,-0.35,0,0,0,100,'0156011732',NULL),
	(31,'309219249819','2017-03-30 22:56:35','002489','Õã½­ÓÀÇ¿',200,200,7.316,7.77,1554,90.86,6.21,0,0,0,200,'0156011732',NULL),
	(32,'5890000049','2017-03-30 22:56:35','002040','ÄÏ¾©¸Û',400,400,27.193,26.51,10604,-273,-2.51,0,0,0,800,'0125561330',NULL),
	(33,'5890000049','2017-03-30 22:56:36','600545','ÐÂ½®³Ç½¨',700,700,15.047,15.04,10528,-5.21,-0.05,0,0,0,1400,'A738685727',NULL),
	(34,'309219249819','2017-03-31 08:49:55','000993','Ãö¶«µçÁ¦',100,100,14.21,14.16,1416,-5,-0.35,0,0,0,100,'0156011732',NULL),
	(35,'309219249819','2017-03-31 08:49:56','002489','Õã½­ÓÀÇ¿',200,200,7.316,7.77,1554,90.86,6.21,0,0,0,200,'0156011732',NULL),
	(36,'5890000049','2017-03-31 08:49:56','002040','ÄÏ¾©¸Û',400,400,27.193,26.51,10604,-273,-2.51,0,0,0,800,'0125561330',NULL),
	(37,'5890000049','2017-03-31 08:49:56','600545','ÐÂ½®³Ç½¨',700,700,15.047,15.04,10528,-5.21,-0.05,0,0,0,1400,'A738685727',NULL);

/*!40000 ALTER TABLE `tb_snap_position` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_trade_detail
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_trade_detail`;

CREATE TABLE `tb_trade_detail` (
  `ROWID` bigint(20) NOT NULL auto_increment COMMENT '自增字段，主键',
  `LOGTIME` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '系统时间',
  `ORDERID` varchar(64) default NULL COMMENT 'orderid',
  `POLICYID` int(11) default NULL COMMENT '策略ID',
  `STOCKID` varchar(64) NOT NULL COMMENT '股票代码',
  `DIRTYPE` smallint(6) default '9' COMMENT '0买入,1卖出,9撤单',
  `ISTEST` smallint(6) default '0' COMMENT '是否测试',
  `PRICE` float default '0' COMMENT '买卖价格',
  `QUANTITY` int(11) default '0' COMMENT '买卖数量',
  `USERID` int(11) default '0' COMMENT '用户ID',
  `ACCOUNTID` varchar(32) NOT NULL default '0' COMMENT '券商的帐号ID',
  `GDDM` varchar(32) default NULL COMMENT '股东代码',
  `EXCHGID` int(11) default '0' COMMENT '交易所ID， 上海1,深圳0(招商证券普通账户深圳是2)',
  `WEITUOID` varchar(32) default NULL COMMENT '委托编号',
  `DETAIL` varchar(256) default NULL COMMENT '券商返回-结果信息',
  `ERRORINFO` varchar(256) default '0' COMMENT '券商返回-错误信息',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ROWID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_user_account
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_user_account`;

CREATE TABLE `tb_user_account` (
  `USERID` int(11) NOT NULL default '0' COMMENT '用户ID,是tb_user_basic的外键.',
  `TRADEID` int(11) NOT NULL default '0' COMMENT '券商ID,对应中文含义参考字典表.tb_dict_trade',
  `ACCOUNTID` varchar(64) NOT NULL COMMENT '券商的登录帐号,如:平安帐号。表的主键',
  `PASSWORD` varchar(64) NOT NULL COMMENT '券商的登录密码',
  `CANAME` varchar(64) default NULL COMMENT '帐户中文名称',
  `EXCHGID_SH` varchar(32) NOT NULL COMMENT '上交所交易ID,创建用户自动查询获取',
  `EXCHGID_SZ` varchar(32) NOT NULL COMMENT '深交所交易ID,创建用户自动查询获取',
  `CANUSAGE` smallint(6) NOT NULL default '0' COMMENT '账户是否可用,如密码错误不可用帐号',
  `VISIBLE` smallint(6) default '1' COMMENT '是否页面可见,删除帐号',
  `ADDTIME` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '添加时间,添加之后不要修改',
  `MODTIME` datetime NOT NULL default '0000-00-00 00:00:00' COMMENT '信息最后修改时间',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`TRADEID`,`ACCOUNTID`),
  KEY `userid` (`USERID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_user_account` WRITE;
/*!40000 ALTER TABLE `tb_user_account` DISABLE KEYS */;

INSERT INTO `tb_user_account` (`USERID`, `TRADEID`, `ACCOUNTID`, `PASSWORD`, `CANAME`, `EXCHGID_SH`, `EXCHGID_SZ`, `CANUSAGE`, `VISIBLE`, `ADDTIME`, `MODTIME`, `REMARK`)
VALUES
	(20000,1,'309219249819','243167','Íõ¾ê','A720722620','0156011732',1,1,'2017-03-30 17:58:59','0000-00-00 00:00:00',NULL),
	(10000,2,'5890000049','207623','ÏÄÑå¸Õ','A738685727','0125561330',1,1,'2017-03-30 17:58:58','0000-00-00 00:00:00',NULL),
	(20000,4,'10500998','622792',NULL,'','',0,0,'2017-03-22 22:42:59','0000-00-00 00:00:00',NULL);

/*!40000 ALTER TABLE `tb_user_account` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_user_basic
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_user_basic`;

CREATE TABLE `tb_user_basic` (
  `USERID` int(11) unsigned NOT NULL auto_increment COMMENT '用户ID,可登录使用',
  `GROUPID` int(11) default '0' COMMENT '用户组ID,策略按分组控制.含义如:免费,vip1,vip2,vip3',
  `UENAME` varchar(64) NOT NULL COMMENT '英文名,可登录使用',
  `UCNAME` varchar(64) NOT NULL COMMENT '中文名,姓名',
  `PHONENUMBER` varchar(16) NOT NULL COMMENT '手机号,可登录使用',
  `PASSWORD` varchar(64) NOT NULL COMMENT '登录密码',
  `ADDRESS` varchar(255) NOT NULL COMMENT '通信地址',
  `ZIPCODE` varchar(16) NOT NULL COMMENT '邮编',
  `TYPEID` int(11) NOT NULL default '0' COMMENT '类型:0测试，1免费 2包月 3包年 9终身',
  `STATUS` int(11) NOT NULL default '0' COMMENT '禁用状态: 0正常 1管理员禁用 2测试到期 3付费过期',
  `LASTLOGIN` varchar(256) default NULL COMMENT '用户最后访问',
  `SESSIONID` varchar(256) default NULL,
  `ONLINE` smallint(6) NOT NULL default '0' COMMENT '登陆状态，0表示非登陆，1表示已登陆',
  `ADDTIME` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '首次添加时间,一经创建不要修改',
  `MODTIME` datetime NOT NULL default '0000-00-00 00:00:00' COMMENT '修改时间',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`USERID`),
  UNIQUE KEY `username` (`UENAME`),
  UNIQUE KEY `phonenumber` (`PHONENUMBER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_user_basic` WRITE;
/*!40000 ALTER TABLE `tb_user_basic` DISABLE KEYS */;

INSERT INTO `tb_user_basic` (`USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `LASTLOGIN`, `SESSIONID`, `ONLINE`, `ADDTIME`, `MODTIME`, `REMARK`)
VALUES
	(10000,1,'tester','测试用户','15810865503','ttttt','beijing chaoyang','100016',0,1,NULL,NULL,1,'2017-02-10 09:50:50','0000-00-00 00:00:00',NULL),
	(20000,2,'test2','正式用户','12','222222','beijing','100016',0,1,NULL,NULL,1,'2017-02-13 17:08:02','0000-00-00 00:00:00',NULL);

/*!40000 ALTER TABLE `tb_user_basic` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
