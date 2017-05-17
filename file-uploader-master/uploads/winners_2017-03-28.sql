# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 111.206.211.62 (MySQL 5.0.75)
# Database: winners
# Generation Time: 2017-03-28 03:45:43 +0000
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
  `BUYPERCENT` float NOT NULL default '0' COMMENT '一次买入的比例，默认为0.5',
  `SPLITCOUNT` int(11) default '1' COMMENT '拆成多少个单提交，默认为1',
  `ADDTIME` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '添加时间,添加之后不要修改',
  `MODTIME` datetime NOT NULL default '0000-00-00 00:00:00' COMMENT '信息最后修改时间',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ACCOUNTID`),
  KEY `userid` (`USERID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_capital_conf` WRITE;
/*!40000 ALTER TABLE `tb_capital_conf` DISABLE KEYS */;

INSERT INTO `tb_capital_conf` (`ACCOUNTID`, `USERID`, `MAXBUY`, `BUYAMOUNT`, `BUYPERCENT`, `SPLITCOUNT`, `ADDTIME`, `MODTIME`, `REMARK`)
VALUES
	('301719804403',20000,0,0,0.4,1,'2017-02-23 09:11:14','2017-02-23 09:10:06',''),
	('303900021793',20000,0,0,0.4,1,'2017-02-23 09:10:28','2017-02-23 09:10:06',''),
	('303900021796',10000,5000,0,0.4,1,'2017-03-17 10:50:05','2017-02-23 09:10:06',''),
	('390100060685',20000,0,0,0.4,1,'2017-02-23 09:11:16','2017-02-23 09:10:06',''),
	('5890000049',10000,1000,0,0.4,1,'2017-03-17 10:50:02','2017-02-23 09:10:06','');

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
  `STARTTIME` date default NULL COMMENT '策略可生效的开始时间',
  `ENDTIME` date default NULL COMMENT '策略可生效的终止时间',
  `STOCKSET` text COMMENT '策略生效于哪些股票代码',
  `ISTEST` smallint(6) default '1',
  `BUYAMOUNT` float default '0',
  `BUYPERCENT` float default '0',
  `STATUS` int(11) default '0' COMMENT '0:等待中,1:已读取,2:等待交易,3:部分成交,4:全部完成',
  `ADDTIME` timestamp NULL default NULL,
  `REMARK` varchar(255) default NULL,
  PRIMARY KEY  (`ORDERID`,`ACCOUNTID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



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
  `ISTEST` smallint(6) default '1' COMMENT '是否是测试策略',
  `PRICES` int(11) NOT NULL default '1000' COMMENT '策略的价值定义,原始策略价值',
  `ADDTIME` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '策略创建时间',
  `MODTIME` datetime NOT NULL default '0000-00-00 00:00:00' COMMENT '最后修改时间',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`POLICYID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_policy_usage
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_policy_usage`;

CREATE TABLE `tb_policy_usage` (
  `USERID` int(11) NOT NULL default '0' COMMENT '券商的帐号ID',
  `POLICYID` int(11) NOT NULL default '0' COMMENT '策略ID',
  `POLICYPARAM` varchar(8192) default NULL COMMENT '策略使用的参数',
  `STARTTIME` date default NULL COMMENT '策略可生效的开始时间',
  `ENDTIME` date default NULL COMMENT '策略可生效的终止时间',
  `STOCKSET` text COMMENT '策略生效于哪些股票代码',
  `ISTEST` smallint(6) default '1',
  `STATUS` smallint(6) default '0' COMMENT '0:等待中,1:已读取,2:等待交易,3:部分成交,4:全部完成',
  `FALG` smallint(6) default '0' COMMENT '策略是否启用,可临时关闭策略,而不删除DB记录',
  `REMARK` varchar(255) default NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_policy_usage` WRITE;
/*!40000 ALTER TABLE `tb_policy_usage` DISABLE KEYS */;

INSERT INTO `tb_policy_usage` (`USERID`, `POLICYID`, `POLICYPARAM`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `FALG`, `REMARK`)
VALUES
	(0,0,NULL,NULL,NULL,NULL,1,0,0,NULL);

/*!40000 ALTER TABLE `tb_policy_usage` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_snap_cancel_order
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_snap_cancel_order`;

CREATE TABLE `tb_snap_cancel_order` (
  `ROWID` bigint(20) NOT NULL auto_increment COMMENT '自增字段，主键',
  `ACCOUNTID` varchar(32) NOT NULL default '0' COMMENT '证券代码',
  `LOGTIME` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `ORDERTIME` int(11) default '0' COMMENT '委托时间',
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
  `SEQUENCE_NUM` int(11) default '0' COMMENT '批次号',
  `WEITUOID` int(11) default '0' COMMENT '委托编号',
  `REMARK` varchar(255) default NULL COMMENT '备注',
  PRIMARY KEY  (`ROWID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



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
	(2,'309219249819','2017-03-25 15:32:20',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(3,'309219249819','2017-03-25 15:58:00',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(4,'309219249819','2017-03-25 16:10:57',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(5,'309219249819','2017-03-26 08:50:07',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(6,'309219249819','2017-03-27 08:48:12',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(7,'309219249819','2017-03-27 08:58:49',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(8,'309219249819','2017-03-27 09:09:46',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(9,'309219249819','2017-03-27 15:56:37',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(10,'309219249819','2017-03-27 17:01:11',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(11,'309219249819','2017-03-28 08:02:55',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(12,'309219249819','2017-03-28 08:33:05',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL),
	(13,'309219249819','2017-03-28 08:49:52',8068.67,8068.67,8068.67,0,0,0,8068.67,0,NULL);

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



# Dump of table tb_trade_detail
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_trade_detail`;

CREATE TABLE `tb_trade_detail` (
  `ROWID` bigint(20) NOT NULL auto_increment COMMENT '自增字段,主键',
  `ACCOUNTID` int(11) default '0' COMMENT '券商的帐号ID',
  `STOCKID` int(11) default '0' COMMENT '股票代码',
  `EXCHANGEID` int(11) default NULL COMMENT '交易所代码,根据股票代码自动读取',
  `TRANTYPE` int(11) default '0' COMMENT '交易类型:0买入 1卖出 2撤单',
  `POLICYID` int(11) default '0' COMMENT '当前交易所采用的策略',
  `POLICYPARAM` varchar(8192) default NULL COMMENT '策略需要的参数数据',
  `POS_SHOU` int(11) default '0' COMMENT '挂单量-买卖多少手，单位是手',
  `POS_JINE` int(11) default '0' COMMENT '挂单量-买卖多少钱，单位是元',
  `POS_BILI` float default '0' COMMENT '挂单量-买卖比例，以9:00时的帐号资金持股为分母计算',
  `BILLSTATUS` int(11) default '0' COMMENT '单子状态：0提交成功 1部分成功 2全部成功',
  `IPADDRESS` varchar(32) default NULL COMMENT '用户的IP地址',
  `LOGTIME` datetime default NULL COMMENT '完成时间,日志时间',
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
	(20000,1,'309219249819','243167','Íõ¾ê','A720722620','0156011732',1,1,'2017-03-21 21:43:45','0000-00-00 00:00:00',NULL),
	(10000,2,'5890000049','207623','ÏÄÑå¸Õ','A738685727','0125561330',0,1,'2017-03-21 21:41:13','0000-00-00 00:00:00',NULL),
	(20000,4,'10500998','622792',NULL,'','',0,0,'2017-03-22 22:42:59','0000-00-00 00:00:00',NULL);

/*!40000 ALTER TABLE `tb_user_account` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_user_basic
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_user_basic`;

CREATE TABLE `tb_user_basic` (
  `USERID` int(11) unsigned NOT NULL default '0' COMMENT '用户ID,可登录使用',
  `GROUPID` int(11) default '0' COMMENT '用户组ID,策略按分组控制.含义如:免费,vip1,vip2,vip3',
  `UENAME` varchar(64) NOT NULL COMMENT '英文名,可登录使用',
  `UCNAME` varchar(64) NOT NULL COMMENT '中文名,姓名',
  `PHONENUMBER` varchar(16) NOT NULL COMMENT '手机号,可登录使用',
  `PASSWORD` varchar(64) NOT NULL COMMENT '登录密码',
  `ADDRESS` varchar(255) NOT NULL COMMENT '通信地址',
  `ZIPCODE` varchar(16) NOT NULL COMMENT '邮编',
  `TYPEID` int(11) NOT NULL default '0' COMMENT '类型:0测试，1免费 2包月 3包年 9终身',
  `STATUS` int(11) NOT NULL default '0' COMMENT '禁用状态: 0正常 1管理员禁用 2测试到期 3付费过期',
  `SESSIONID` varchar(266) default NULL,
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

INSERT INTO `tb_user_basic` (`USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `SESSIONID`, `ONLINE`, `ADDTIME`, `MODTIME`, `REMARK`)
VALUES
	(10000,1,'tester','测试用户','15810865503','ttttt','beijing chaoyang','100016',0,1,NULL,1,'2017-02-10 09:50:50','0000-00-00 00:00:00',NULL),
	(20000,2,'test2','正式用户','12','222222','beijing','100016',0,1,NULL,1,'2017-02-13 17:08:02','0000-00-00 00:00:00',NULL);

/*!40000 ALTER TABLE `tb_user_basic` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
