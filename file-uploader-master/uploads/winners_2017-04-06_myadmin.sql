-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: 2017-04-06 04:48:04
-- 服务器版本： 5.6.35
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `winners`
--

-- --------------------------------------------------------

--
-- 表的结构 `tb_capital_conf`
--

CREATE TABLE `tb_capital_conf` (
  `ACCOUNTID` varchar(64) NOT NULL COMMENT '券商的登录帐号,如:平安帐号。表的主键',
  `USERID` int(11) NOT NULL DEFAULT '0' COMMENT '用户ID,是tb_user_basic的外键.',
  `MAXBUY` float NOT NULL DEFAULT '0' COMMENT '最大可买金额,单位:RMB,元.取float最大值',
  `BUYAMOUNT` float DEFAULT '0' COMMENT '取最大值，同上',
  `BUYPERCENT` float NOT NULL DEFAULT '0.5' COMMENT '一次买入的比例，默认为0.5',
  `SELLPERCENT` float DEFAULT '1' COMMENT '一次卖出的比例,默认为1.0',
  `SPLITCOUNT` int(11) DEFAULT '1' COMMENT '拆成多少个单提交，默认为1',
  `ADDTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '添加时间,添加之后不要修改',
  `MODTIME` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '信息最后修改时间',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_capital_conf`
--

INSERT INTO `tb_capital_conf` (`ACCOUNTID`, `USERID`, `MAXBUY`, `BUYAMOUNT`, `BUYPERCENT`, `SELLPERCENT`, `SPLITCOUNT`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES
('301719804403', 20000, 0, 0, 0.4, 1, 1, '2017-02-23 01:11:14', '2017-02-23 09:10:06', ''),
('303900021793', 20000, 0, 0, 0.4, 1, 1, '2017-02-23 01:10:28', '2017-02-23 09:10:06', ''),
('303900021796', 10000, 5000, 0, 0.4, 1, 1, '2017-03-17 02:50:05', '2017-02-23 09:10:06', ''),
('390100060685', 20000, 0, 0, 0.4, 1, 1, '2017-02-23 01:11:16', '2017-02-23 09:10:06', ''),
('5890000049', 10000, 1000, 0, 0.4, 1, 1, '2017-03-17 02:50:02', '2017-02-23 09:10:06', '');

-- --------------------------------------------------------

--
-- 表的结构 `tb_dict_group`
--

CREATE TABLE `tb_dict_group` (
  `ID` int(11) NOT NULL COMMENT '分组ID值,主键',
  `NAME` varchar(64) DEFAULT NULL COMMENT '组名称,主要为策略使用分配',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_dict_group`
--

INSERT INTO `tb_dict_group` (`ID`, `NAME`, `REMARK`) VALUES
(0, '普通用户', NULL),
(1, '银牌客户', NULL),
(2, '金牌客户', NULL),
(3, 'VIP1', NULL),
(4, 'VIP2', NULL),
(5, 'VIP3', NULL),
(6, '私募', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tb_dict_policygid`
--

CREATE TABLE `tb_dict_policygid` (
  `ID` int(11) UNSIGNED NOT NULL,
  `NAME` varchar(256) DEFAULT NULL,
  `REMARK` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `tb_dict_trade`
--

CREATE TABLE `tb_dict_trade` (
  `ID` int(11) NOT NULL COMMENT '券商公司ID，主键',
  `NAME` varchar(64) DEFAULT NULL COMMENT '券商中文名称，用于页面展示下拉列表',
  `ENDPOINT` varchar(8192) NOT NULL COMMENT '服务器IP:port:stats状态列表,可使用的服务器列表',
  `VERSION` varchar(32) DEFAULT NULL,
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_dict_trade`
--

INSERT INTO `tb_dict_trade` (`ID`, `NAME`, `ENDPOINT`, `VERSION`, `REMARK`) VALUES
(0, '未知券商', '', '1.0.0', NULL),
(1, '平安证券', '202.69.19.56:7738,116.228.52.78:7738,202.69.19.56:7708,116.228.52.71:80', '1.68', NULL),
(2, '招商证券', '119.145.12.67:443;221.130.42.52:443;202.106.83.199:443', '2.87', NULL),
(3, '广发证券', '222.221.241.178:7708', '1.1', NULL),
(4, '国泰君安', '1.1.1.1:11', '1.1', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tb_log_login`
--

CREATE TABLE `tb_log_login` (
  `ROWID` bigint(20) NOT NULL COMMENT '自增，主键',
  `USERID` int(11) DEFAULT '0' COMMENT '用户ID',
  `LOGIN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '登录时间',
  `LOGOUT` datetime DEFAULT NULL COMMENT '退出系统时间',
  `IPADDRESS` varchar(32) DEFAULT NULL COMMENT '登录IP地址',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `tb_order_id`
--

CREATE TABLE `tb_order_id` (
  `ORDERID` int(11) NOT NULL,
  `USERID` int(11) DEFAULT '0',
  `ACCOUNTID` varchar(64) NOT NULL DEFAULT '0',
  `POLICYID` int(11) NOT NULL DEFAULT '0' COMMENT '策略ID',
  `POLICYPARAM` varchar(8192) DEFAULT NULL COMMENT '策略使用的参数',
  `DIRTYPE` smallint(6) DEFAULT '1' COMMENT '0买入|1卖出|9撤单',
  `STARTTIME` date DEFAULT NULL COMMENT '策略可生效的开始时间',
  `ENDTIME` date DEFAULT NULL COMMENT '策略可生效的终止时间',
  `STOCKSET` text COMMENT '策略生效于哪些股票代码',
  `ISTEST` smallint(6) DEFAULT '1',
  `BUYAMOUNT` float DEFAULT '0',
  `BUYPERCENT` float DEFAULT '0',
  `SELLPERCENT` float DEFAULT '1',
  `STATUS` int(11) DEFAULT '0' COMMENT '0:等待中,1:已读取,2:等待交易,3:部分成交,4:全部完成',
  `ADDTIME` timestamp NULL DEFAULT NULL,
  `REMARK` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_order_id`
--

INSERT INTO `tb_order_id` (`ORDERID`, `USERID`, `ACCOUNTID`, `POLICYID`, `POLICYPARAM`, `DIRTYPE`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `ISTEST`, `BUYAMOUNT`, `BUYPERCENT`, `SELLPERCENT`, `STATUS`, `ADDTIME`, `REMARK`) VALUES
(1, 20000, '309219249819', 11, NULL, 0, NULL, NULL, NULL, 0, 0, 0.5, 1, 0, NULL, NULL),
(1, 10000, '5890000049', 11, NULL, 0, NULL, NULL, NULL, 0, 0, 0.2, 1, 0, NULL, NULL),
(2, 20000, '309219249819', 22, NULL, 1, NULL, NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(2, 10000, '5890000049', 22, NULL, 1, NULL, NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tb_policy_define`
--

CREATE TABLE `tb_policy_define` (
  `POLICYID` int(11) NOT NULL DEFAULT '0' COMMENT '策略ID,主键',
  `PGROUPID` int(11) DEFAULT '0' COMMENT '策略组ID,打板，低吸',
  `PNAME` varchar(255) NOT NULL COMMENT '策略名称,对策略的简要描述',
  `DIRTYPE` int(11) NOT NULL DEFAULT '0' COMMENT '策略类型:0买入/1卖出',
  `USERID` int(11) NOT NULL COMMENT '创建策略的用户ID',
  `USETYPE` varchar(255) NOT NULL COMMENT '可被免费，付费，包月使用？',
  `POLICYPARAM` varchar(8192) DEFAULT NULL COMMENT '策略使用的参数',
  `STARTTIME` date DEFAULT NULL COMMENT '策略可生效的开始时间',
  `ENDTIME` date DEFAULT NULL COMMENT '策略可生效的终止时间',
  `STOCKSET` text COMMENT '策略生效于哪些股票代码',
  `BUYPERCENT` float DEFAULT '0.3' COMMENT '策略买入比例',
  `SELLPERCENT` float DEFAULT '1' COMMENT '卖出比例，默认为1',
  `ISTEST` smallint(6) DEFAULT '1' COMMENT '是否是测试策略',
  `PRICES` int(11) NOT NULL DEFAULT '1000' COMMENT '策略的价值定义,原始策略价值',
  `ADDTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '策略创建时间',
  `MODTIME` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '最后修改时间',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_policy_define`
--

INSERT INTO `tb_policy_define` (`POLICYID`, `PGROUPID`, `PNAME`, `DIRTYPE`, `USERID`, `USETYPE`, `POLICYPARAM`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `BUYPERCENT`, `SELLPERCENT`, `ISTEST`, `PRICES`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES
(10, 0, '打板买入', 0, 0, '1,3,4', '1500', 86390, 86399, NULL, 0.3, 1, 1, 1000, '2017-03-29 18:49:12', '0000-00-00 00:00:00', NULL),
(11, 0, '打板买入', 0, 0, '1,3,4', '1500', 76390, 76399, NULL, 0.3, 1, 1, 1000, '2017-03-30 02:49:12', '0000-00-00 00:00:00', NULL),
(12, 3, '打板买入', 0, 0, '1,3,4', '1500', 66390, 66399, NULL, 0.3, 1, 0, 1000, '2017-03-30 22:19:57', '0000-00-00 00:00:00', NULL),
(13, 2, '打板买入1', 1, 20000, '1,2,3,4,5', '1400', 56390, 66399, '123,234,789', 0.4, 1, 0, 1000, '2017-04-03 06:17:54', '0000-00-00 00:00:00', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tb_policy_usage`
--

CREATE TABLE `tb_policy_usage` (
  `USERID` int(11) NOT NULL DEFAULT '0' COMMENT '券商的帐号ID',
  `PNAME` varchar(256) DEFAULT NULL COMMENT '策略名称,对策略的简要描述',
  `PGROUPID` int(11) NOT NULL COMMENT '策略组ID,打板，低吸',
  `POLICYID` int(11) NOT NULL DEFAULT '0' COMMENT '策略ID',
  `POLICYPARAM` varchar(8192) DEFAULT NULL COMMENT '策略使用的参数',
  `DIRTYPE` smallint(6) DEFAULT '1' COMMENT '0买入|1卖出|9撤单',
  `STARTTIME` date DEFAULT NULL COMMENT '策略可生效的开始时间',
  `ENDTIME` date DEFAULT NULL COMMENT '策略可生效的终止时间',
  `STOCKSET` text COMMENT '策略生效于哪些股票代码',
  `ISTEST` smallint(6) DEFAULT '1',
  `STATUS` smallint(6) DEFAULT '0' COMMENT '0:等待中,1:已读取,2:等待交易,3:部分成交,4:全部完成',
  `FALG` smallint(6) DEFAULT '0' COMMENT '策略是否启用,可临时关闭策略,而不删除DB记录',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注',
  `SUBSCRBLE` tinyint(1) DEFAULT NULL COMMENT '是否订阅，1订阅，0退订',
  `BUYPERCENT` float DEFAULT '0.3' COMMENT '策略买入比例'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_policy_usage`
--

INSERT INTO `tb_policy_usage` (`USERID`, `PNAME`, `PGROUPID`, `POLICYID`, `POLICYPARAM`, `DIRTYPE`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `FALG`, `REMARK`, `SUBSCRBLE`, `BUYPERCENT`) VALUES
(0, '打板买入', 3, 12, '1500', 0, 56390, 56399, 'null', 0, 0, 0, NULL, 1, 0.3),
(0, '打板买入', 0, 18, 'null', 1, 46390, 46399, '111,222', 0, 0, 0, NULL, 0, 0.3),
(0, '打板买入', 0, 20, 'null', 1, 36390, 36399, 'null', 0, 0, 0, NULL, 0, 0.3),
(20000, '打板买入', 0, 10, '0', 1, 26390, 26399, '123,456', 0, 0, 0, NULL, 0, 0.3),
(20000, '打板买入', 0, 12, '3000', 1, 16390, 16399, 'null', 0, 0, 0, NULL, 1, 0.3);

-- --------------------------------------------------------

--
-- 表的结构 `tb_snap_cancel_order`
--

CREATE TABLE `tb_snap_cancel_order` (
  `ROWID` bigint(20) NOT NULL COMMENT '自增字段，主键',
  `ACCOUNTID` varchar(32) NOT NULL DEFAULT '0' COMMENT '证券代码',
  `LOGTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `ORDERTIME` varchar(32) DEFAULT '0' COMMENT '委托时间',
  `GDDM` varchar(32) DEFAULT NULL COMMENT '股东代码',
  `KIND` smallint(6) DEFAULT '0' COMMENT '帐号类别',
  `STOCKID` varchar(64) NOT NULL COMMENT '股票代码',
  `STOCKNAME` varchar(64) DEFAULT NULL COMMENT '股票名称',
  `ORDER_PRICE` float DEFAULT '0' COMMENT '委托价格',
  `ORDER_QUANTITY` int(11) DEFAULT '0' COMMENT '委托数量',
  `ORDER_AMOUNT` float DEFAULT '0' COMMENT '委托金额',
  `DEAL_PRICE` float DEFAULT '0' COMMENT '成交价格',
  `DEAL_QUANTITY` int(11) DEFAULT '0' COMMENT '成交数量',
  `CANCEL_QUANTITY` int(11) DEFAULT '0' COMMENT '已撤数量',
  `WEITUOID` varchar(32) DEFAULT '0' COMMENT '委托编号',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_snap_cancel_order`
--

INSERT INTO `tb_snap_cancel_order` (`ROWID`, `ACCOUNTID`, `LOGTIME`, `ORDERTIME`, `GDDM`, `KIND`, `STOCKID`, `STOCKNAME`, `ORDER_PRICE`, `ORDER_QUANTITY`, `ORDER_AMOUNT`, `DEAL_PRICE`, `DEAL_QUANTITY`, `CANCEL_QUANTITY`, `WEITUOID`, `REMARK`) VALUES
(5, '309219249819', '2017-03-29 02:41:30', '10:38:41', '0156011732', 0, '002489', 'Õã½­ÓÀÇ¿', 7.5, 200, 1500, 0, 0, 0, 'BJZRNGC2', NULL),
(6, '5890000049', '2017-03-29 02:41:31', '10:38:42', '0125561330', 0, '002489', 'Õã½­ÓÀÇ¿', 7.5, 2000, 15000, 0, 0, 0, '7', NULL),
(7, '309219249819', '2017-03-29 03:16:40', '10:38:41', '0156011732', 0, '002489', 'Õã½­ÓÀÇ¿', 7.5, 200, 1500, 0, 0, 0, 'BJZRNGC2', NULL),
(8, '5890000049', '2017-03-29 03:16:40', '10:38:42', '0125561330', 0, '002489', 'Õã½­ÓÀÇ¿', 7.5, 2000, 15000, 0, 0, 0, '7', NULL),
(9, '309219249819', '2017-03-29 03:16:54', '10:38:41', '0156011732', 0, '002489', 'Õã½­ÓÀÇ¿', 7.5, 200, 1500, 0, 0, 0, 'BJZRNGC2', NULL),
(10, '5890000049', '2017-03-29 03:16:55', '10:38:42', '0125561330', 0, '002489', 'Õã½­ÓÀÇ¿', 7.5, 2000, 15000, 0, 0, 0, '7', NULL),
(11, '309219249819', '2017-03-29 05:30:53', '13:29:58', '0156011732', 0, '002489', 'Õã½­ÓÀÇ¿', 7.53, 200, 1506, 0, 0, 0, 'BJZRO74R', NULL),
(12, '5890000049', '2017-03-29 05:30:54', '13:29:59', '0125561330', 0, '002489', 'Õã½­ÓÀÇ¿', 7.53, 2000, 15060, 0, 0, 0, '10', NULL),
(13, '5890000049', '2017-03-30 01:32:58', '09:32:56', 'A738685727', 0, '603138', 'º£Á¿Êý¾Ý', 80.08, 100, 8008, 0, 0, 0, '17', NULL),
(14, '309219249819', '2017-03-30 01:38:52', '09:38:49', 'A720722620', 1, '600545', 'ÐÂ½®³Ç½¨', 15.04, 100, 1504, 0, 0, 0, '95673061', NULL),
(15, '5890000049', '2017-03-30 01:45:49', '09:45:46', '0125561330', 0, '002040', 'ÄÏ¾©¸Û', 27.18, 400, 10872, 0, 0, 0, '23', NULL),
(16, '5890000049', '2017-03-30 01:45:52', '09:45:46', '0125561330', 0, '002040', 'ÄÏ¾©¸Û', 27.18, 400, 10872, 0, 0, 0, '23', NULL),
(17, '309219249819', '2017-03-30 02:08:37', '10:00:27', '0156011732', 0, '002489', 'Õã½­ÓÀÇ¿', 7.85, 400, 3140, 0, 0, 0, 'BJZRPPDS', NULL),
(18, '5890000049', '2017-03-30 02:08:38', '10:00:28', '0125561330', 1, '002489', 'Õã½­ÓÀÇ¿', 7.85, 100, 785, 0, 0, 0, '26', NULL),
(19, '309219249819', '2017-03-30 02:08:40', '10:00:27', '0156011732', 0, '002489', 'Õã½­ÓÀÇ¿', 7.85, 400, 3140, 0, 0, 0, 'BJZRPPDS', NULL),
(20, '5890000049', '2017-03-30 02:08:41', '10:00:28', '0125561330', 1, '002489', 'Õã½­ÓÀÇ¿', 7.85, 100, 785, 0, 0, 0, '26', NULL),
(21, '309219249819', '2017-03-30 02:09:09', '10:00:27', '0156011732', 0, '002489', 'Õã½­ÓÀÇ¿', 7.85, 400, 3140, 0, 0, 0, 'BJZRPPDS', NULL),
(22, '5890000049', '2017-03-30 02:09:09', '10:00:28', '0125561330', 1, '002489', 'Õã½­ÓÀÇ¿', 7.85, 100, 785, 0, 0, 0, '26', NULL),
(23, '309219249819', '2017-03-30 02:09:10', '10:00:27', '0156011732', 0, '002489', 'Õã½­ÓÀÇ¿', 7.85, 400, 3140, 0, 0, 0, 'BJZRPPDS', NULL),
(24, '5890000049', '2017-03-30 02:09:11', '10:00:28', '0125561330', 1, '002489', 'Õã½­ÓÀÇ¿', 7.85, 100, 785, 0, 0, 0, '26', NULL),
(25, '5890000049', '2017-03-30 15:00:07', '22:57:44', '0125561330', 0, '002489', 'Õã½­ÓÀÇ¿', 7.51, 500, 3755, 0, 0, 0, '36', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tb_snap_capital`
--

CREATE TABLE `tb_snap_capital` (
  `ROWID` bigint(20) NOT NULL COMMENT '自增字段，主键',
  `ACCOUNTID` varchar(32) NOT NULL DEFAULT '0' COMMENT '券商的帐号ID',
  `LOGTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `REMAINING` float DEFAULT '0' COMMENT '资金余额',
  `USEAVAIL` float DEFAULT '0' COMMENT '可用资金',
  `WITHDROW` float DEFAULT '0' COMMENT '可取资金',
  `FLIGHT` float DEFAULT '0' COMMENT '在途资金',
  `FREEZE` float DEFAULT '0' COMMENT '冻结资金',
  `STOCKVALUE` float DEFAULT '0' COMMENT '最新市值',
  `SUMASSERTS` float DEFAULT '0' COMMENT '总资产',
  `FLAG` int(11) DEFAULT '0' COMMENT '标志位',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_snap_capital`
--

INSERT INTO `tb_snap_capital` (`ROWID`, `ACCOUNTID`, `LOGTIME`, `REMAINING`, `USEAVAIL`, `WITHDROW`, `FLIGHT`, `FREEZE`, `STOCKVALUE`, `SUMASSERTS`, `FLAG`, `REMARK`) VALUES
(1, '309219249819', '2017-03-28 11:00:46', 8068.67, 8068.67, 8068.67, 0, 0, 0, 8068.67, 0, NULL),
(2, '5890000049', '2017-03-28 11:00:46', 30976.8, 23471.8, 30976.8, 0, 7505, 0, 23471.8, 0, NULL),
(3, '309219249819', '2017-03-29 00:48:06', 8068.67, 3473.67, 3473.67, 0, 4595, 0, 8068.67, 0, NULL),
(4, '5890000049', '2017-03-29 00:48:06', 30976.8, 30976.8, 30976.8, 0, 0, 0, 30976.8, 0, NULL),
(5, '309219249819', '2017-03-29 03:16:39', 8068.67, 1968.67, 1968.67, 0, 1505, 4728, 8201.67, 0, NULL),
(6, '5890000049', '2017-03-29 03:16:39', 30976.8, 15971.8, 30976.8, 0, 15005, 0, 15971.8, 0, NULL),
(7, '309219249819', '2017-03-29 05:28:39', 8068.67, 3473.67, 3473.67, 0, 0, 4686, 8159.67, 0, NULL),
(8, '5890000049', '2017-03-29 05:28:39', 30976.8, 30976.8, 30976.8, 0, 0, 0, 30976.8, 0, NULL),
(9, '309219249819', '2017-03-29 05:43:01', 8068.67, 3473.67, 3473.67, 0, 0, 4716, 8189.67, 0, NULL),
(10, '5890000049', '2017-03-29 05:43:01', 30976.8, 29407.8, 30976.8, 0, 0, 0, 29407.8, 0, NULL),
(11, '309219249819', '2017-03-29 05:59:48', 8068.67, 3473.67, 3473.67, 0, 0, 4722, 8195.67, 0, NULL),
(12, '5890000049', '2017-03-29 05:59:48', 30976.8, 29407.8, 29407.8, 0, 0, 29407.8, 58815.5, 0, NULL),
(13, '5890000049', '2017-03-29 06:01:20', 30976.8, 29407.8, 29407.8, 0, 0, 29407.8, 58815.5, 0, NULL),
(14, '5890000049', '2017-03-29 06:03:01', 30976.8, 29407.8, 29407.8, 0, 0, 29407.8, 58815.5, 0, NULL),
(15, '5890000049', '2017-03-29 06:06:28', 30976.8, 29407.8, 29407.8, 0, 0, 29407.8, 58815.5, 0, NULL),
(16, '5890000049', '2017-03-29 06:08:24', 30976.8, 29407.8, 29407.8, 0, 0, 29407.8, 58815.5, 0, NULL),
(17, '5890000049', '2017-03-29 06:15:31', 30976.8, 29407.8, 30976.8, 0, 0, 29407.8, 30976.8, 0, NULL),
(18, '309219249819', '2017-03-30 00:49:48', 3473.67, 3473.67, 3473.67, 0, 0, 4752, 8225.67, 0, NULL),
(19, '5890000049', '2017-03-30 00:49:49', 29407.8, 29407.8, 29407.8, 0, 0, 29407.8, 29407.8, 0, NULL),
(20, '309219249819', '2017-03-30 01:02:49', 3473.67, 3473.67, 3473.67, 0, 0, 4752, 8225.67, 0, NULL),
(21, '5890000049', '2017-03-30 01:02:49', 29407.8, 29407.8, 29407.8, 0, 0, 29407.8, 29407.8, 0, NULL),
(22, '309219249819', '2017-03-30 09:59:18', 3473.67, 5184.53, 3473.67, 3131.86, 0, 2970, 8154.53, 0, NULL),
(23, '5890000049', '2017-03-30 09:59:18', 29407.8, 9548.99, 9548.99, 0, 0, 9548.99, 29407.8, 0, NULL),
(24, '309219249819', '2017-03-30 10:03:50', 3473.67, 5184.53, 3473.67, 3131.86, 0, 2970, 8154.53, 0, NULL),
(25, '5890000049', '2017-03-30 10:03:50', 29407.8, 9548.99, 9548.99, 0, 0, 9548.99, 29407.8, 0, NULL),
(26, '309219249819', '2017-03-30 10:06:48', 3473.67, 5184.53, 3473.67, 3131.86, 0, 2970, 8154.53, 0, NULL),
(27, '5890000049', '2017-03-30 10:06:49', 29407.8, 9548.99, 9548.99, 0, 0, 9548.99, 29407.8, 0, NULL),
(28, '309219249819', '2017-03-30 14:54:52', 5184.53, 5184.53, 5184.53, 0, 0, 2970, 8154.53, 0, NULL),
(29, '5890000049', '2017-03-30 14:54:52', 9548.99, 9548.99, 9548.99, 0, 0, 9548.99, 9548.99, 0, NULL),
(30, '309219249819', '2017-03-30 14:56:35', 5184.53, 5184.53, 5184.53, 0, 0, 2970, 8154.53, 0, NULL),
(31, '5890000049', '2017-03-30 14:56:35', 9548.99, 9548.99, 9548.99, 0, 0, 9548.99, 9548.99, 0, NULL),
(32, '309219249819', '2017-03-31 00:49:54', 5184.53, 5184.53, 5184.53, 0, 0, 2970, 8154.53, 0, NULL),
(33, '5890000049', '2017-03-31 00:49:55', 9548.99, 9548.99, 9548.99, 0, 0, 9548.99, 9548.99, 0, NULL),
(34, '309219249819', '2017-04-01 00:47:23', 8209.49, 8209.49, 8209.49, 0, 0, 0, 8209.49, 0, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tb_snap_hisorder`
--

CREATE TABLE `tb_snap_hisorder` (
  `ROWID` bigint(20) NOT NULL COMMENT '自增字段，主键',
  `ACCOUNTID` int(11) DEFAULT '0' COMMENT '券商的帐号ID',
  `LOGTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `STOCKID` int(11) DEFAULT '0' COMMENT '股票代码',
  `DIRTYPE` int(11) DEFAULT '0' COMMENT '交易类型：0买入 1卖出',
  `AMOUNT` float DEFAULT NULL COMMENT '交易金额',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `tb_snap_position`
--

CREATE TABLE `tb_snap_position` (
  `ROWID` bigint(20) NOT NULL COMMENT '自增字段，主键',
  `ACCOUNTID` varchar(32) NOT NULL DEFAULT '0' COMMENT '券商的帐号ID',
  `LOGTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '获取数据时间',
  `STOCKID` varchar(64) NOT NULL COMMENT '股票代码',
  `STOCKNAME` varchar(64) DEFAULT NULL COMMENT '股票名称',
  `REMAIN` int(11) DEFAULT '0' COMMENT '股份余额',
  `SELL` int(11) DEFAULT '0' COMMENT '可用股份',
  `COST` float DEFAULT '0' COMMENT '成本价',
  `PRICE` float DEFAULT '0' COMMENT '当前价',
  `NEWVALUE` float DEFAULT '0' COMMENT '最新市值',
  `PROFIT` float DEFAULT '0' COMMENT '浮动盈亏',
  `PROFITRATIO` float DEFAULT '0' COMMENT '盈亏比例',
  `FREESE` int(11) DEFAULT '0' COMMENT '冻结数量',
  `UNUFREESE` int(11) DEFAULT '0' COMMENT '异常冻结',
  `FLIGHT` int(11) DEFAULT '0' COMMENT '在途股份',
  `OWN` int(11) DEFAULT '0' COMMENT '当前拥股',
  `GDDM` varchar(32) DEFAULT NULL COMMENT '股东代码',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_snap_position`
--

INSERT INTO `tb_snap_position` (`ROWID`, `ACCOUNTID`, `LOGTIME`, `STOCKID`, `STOCKNAME`, `REMAIN`, `SELL`, `COST`, `PRICE`, `NEWVALUE`, `PROFIT`, `PROFITRATIO`, `FREESE`, `UNUFREESE`, `FLIGHT`, `OWN`, `GDDM`, `REMARK`) VALUES
(1, '309219249819', '2017-03-29 03:16:39', '002489', 'Õã½­ÓÀÇ¿', 0, 0, 7.658, 7.87, 4722, 127, 2.76, 0, 0, 600, 600, '0156011732', NULL),
(2, '309219249819', '2017-03-29 05:28:40', '002489', 'Õã½­ÓÀÇ¿', 0, 0, 7.658, 7.82, 4692, 97, 2.11, 0, 0, 600, 600, '0156011732', NULL),
(3, '309219249819', '2017-03-29 05:43:02', '002489', 'Õã½­ÓÀÇ¿', 0, 0, 7.658, 7.85, 4710, 115, 2.5, 0, 0, 600, 600, '0156011732', NULL),
(4, '309219249819', '2017-03-29 05:59:48', '002489', 'Õã½­ÓÀÇ¿', 0, 0, 7.658, 7.88, 4728, 133, 2.89, 0, 0, 600, 600, '0156011732', NULL),
(5, '5890000049', '2017-03-29 06:08:28', '002489', 'Õã½­ÓÀÇ¿', 200, 0, 7.845, 7.87, 1574, 5, 0.32, 0, 0, 0, 200, '0125561330', NULL),
(6, '5890000049', '2017-03-29 06:15:31', '002489', 'Õã½­ÓÀÇ¿', 200, 0, 7.845, 7.88, 1576, 7, 0.45, 0, 0, 0, 200, '0125561330', NULL),
(7, '309219249819', '2017-03-30 00:49:49', '002489', 'Õã½­ÓÀÇ¿', 600, 600, 7.658, 7.92, 4752, 157, 3.42, 0, 0, 0, 600, '0156011732', NULL),
(8, '5890000049', '2017-03-30 00:49:50', '002489', 'Õã½­ÓÀÇ¿', 200, 200, 7.845, 7.92, 1584, 15, 0.96, 0, 0, 0, 400, '0125561330', NULL),
(9, '309219249819', '2017-03-30 01:02:49', '002489', 'Õã½­ÓÀÇ¿', 600, 600, 7.658, 7.92, 4752, 157, 3.42, 0, 0, 0, 600, '0156011732', NULL),
(10, '5890000049', '2017-03-30 01:02:49', '002489', 'Õã½­ÓÀÇ¿', 200, 200, 7.845, 7.92, 1584, 15, 0.96, 0, 0, 0, 400, '0125561330', NULL),
(11, '309219249819', '2017-03-30 09:59:19', '000993', 'Ãö¶«µçÁ¦', 0, 0, 14.21, 14.16, 1416, -5, -0.35, 0, 0, 100, 100, '0156011732', NULL),
(12, '309219249819', '2017-03-30 09:59:19', '002489', 'Õã½­ÓÀÇ¿', 600, 200, 7.316, 7.77, 1554, 90.86, 6.21, 0, 0, 0, 200, '0156011732', NULL),
(13, '5890000049', '2017-03-30 09:59:19', '002040', 'ÄÏ¾©¸Û', 400, 0, 27.193, 26.51, 10604, -273, -2.51, 0, 0, 0, 400, '0125561330', NULL),
(14, '5890000049', '2017-03-30 09:59:19', '002489', 'Õã½­ÓÀÇ¿', 0, 0, 0, 7.77, 0, -17.57, 0, 0, 0, 0, 0, '0125561330', NULL),
(15, '5890000049', '2017-03-30 09:59:19', '600545', 'ÐÂ½®³Ç½¨', 700, 0, 15.047, 15.04, 10528, -5.21, -0.05, 0, 0, 0, 700, 'A738685727', NULL),
(16, '309219249819', '2017-03-30 10:03:50', '000993', 'Ãö¶«µçÁ¦', 0, 0, 14.21, 14.16, 1416, -5, -0.35, 0, 0, 100, 100, '0156011732', NULL),
(17, '309219249819', '2017-03-30 10:03:50', '002489', 'Õã½­ÓÀÇ¿', 600, 200, 7.316, 7.77, 1554, 90.86, 6.21, 0, 0, 0, 200, '0156011732', NULL),
(18, '5890000049', '2017-03-30 10:03:51', '002040', 'ÄÏ¾©¸Û', 400, 0, 27.193, 26.51, 10604, -273, -2.51, 0, 0, 0, 400, '0125561330', NULL),
(19, '5890000049', '2017-03-30 10:03:51', '002489', 'Õã½­ÓÀÇ¿', 0, 0, 0, 7.77, 0, -17.57, 0, 0, 0, 0, 0, '0125561330', NULL),
(20, '5890000049', '2017-03-30 10:03:51', '600545', 'ÐÂ½®³Ç½¨', 700, 0, 15.047, 15.04, 10528, -5.21, -0.05, 0, 0, 0, 700, 'A738685727', NULL),
(21, '309219249819', '2017-03-30 10:06:49', '000993', 'Ãö¶«µçÁ¦', 0, 0, 14.21, 14.16, 1416, -5, -0.35, 0, 0, 100, 100, '0156011732', NULL),
(22, '309219249819', '2017-03-30 10:06:49', '002489', 'Õã½­ÓÀÇ¿', 600, 200, 7.316, 7.77, 1554, 90.86, 6.21, 0, 0, 0, 200, '0156011732', NULL),
(23, '5890000049', '2017-03-30 10:06:49', '002040', 'ÄÏ¾©¸Û', 400, 0, 27.193, 26.51, 10604, -273, -2.51, 0, 0, 0, 400, '0125561330', NULL),
(24, '5890000049', '2017-03-30 10:06:49', '002489', 'Õã½­ÓÀÇ¿', 0, 0, 0, 7.77, 0, -17.57, 0, 0, 0, 0, 0, '0125561330', NULL),
(25, '5890000049', '2017-03-30 10:06:50', '600545', 'ÐÂ½®³Ç½¨', 700, 0, 15.047, 15.04, 10528, -5.21, -0.05, 0, 0, 0, 700, 'A738685727', NULL),
(26, '309219249819', '2017-03-30 14:54:52', '000993', 'Ãö¶«µçÁ¦', 100, 100, 14.21, 14.16, 1416, -5, -0.35, 0, 0, 0, 100, '0156011732', NULL),
(27, '309219249819', '2017-03-30 14:54:52', '002489', 'Õã½­ÓÀÇ¿', 200, 200, 7.316, 7.77, 1554, 90.86, 6.21, 0, 0, 0, 200, '0156011732', NULL),
(28, '5890000049', '2017-03-30 14:54:52', '002040', 'ÄÏ¾©¸Û', 400, 400, 27.193, 26.51, 10604, -273, -2.51, 0, 0, 0, 800, '0125561330', NULL),
(29, '5890000049', '2017-03-30 14:54:53', '600545', 'ÐÂ½®³Ç½¨', 700, 700, 15.047, 15.04, 10528, -5.21, -0.05, 0, 0, 0, 1400, 'A738685727', NULL),
(30, '309219249819', '2017-03-30 14:56:35', '000993', 'Ãö¶«µçÁ¦', 100, 100, 14.21, 14.16, 1416, -5, -0.35, 0, 0, 0, 100, '0156011732', NULL),
(31, '309219249819', '2017-03-30 14:56:35', '002489', 'Õã½­ÓÀÇ¿', 200, 200, 7.316, 7.77, 1554, 90.86, 6.21, 0, 0, 0, 200, '0156011732', NULL),
(32, '5890000049', '2017-03-30 14:56:35', '002040', 'ÄÏ¾©¸Û', 400, 400, 27.193, 26.51, 10604, -273, -2.51, 0, 0, 0, 800, '0125561330', NULL),
(33, '5890000049', '2017-03-30 14:56:36', '600545', 'ÐÂ½®³Ç½¨', 700, 700, 15.047, 15.04, 10528, -5.21, -0.05, 0, 0, 0, 1400, 'A738685727', NULL),
(34, '309219249819', '2017-03-31 00:49:55', '000993', 'Ãö¶«µçÁ¦', 100, 100, 14.21, 14.16, 1416, -5, -0.35, 0, 0, 0, 100, '0156011732', NULL),
(35, '309219249819', '2017-03-31 00:49:56', '002489', 'Õã½­ÓÀÇ¿', 200, 200, 7.316, 7.77, 1554, 90.86, 6.21, 0, 0, 0, 200, '0156011732', NULL),
(36, '5890000049', '2017-03-31 00:49:56', '002040', 'ÄÏ¾©¸Û', 400, 400, 27.193, 26.51, 10604, -273, -2.51, 0, 0, 0, 800, '0125561330', NULL),
(37, '5890000049', '2017-03-31 00:49:56', '600545', 'ÐÂ½®³Ç½¨', 700, 700, 15.047, 15.04, 10528, -5.21, -0.05, 0, 0, 0, 1400, 'A738685727', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tb_trade_detail`
--

CREATE TABLE `tb_trade_detail` (
  `ROWID` bigint(20) NOT NULL COMMENT '自增字段，主键',
  `LOGTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '系统时间',
  `ORDERID` varchar(64) DEFAULT NULL COMMENT 'orderid',
  `POLICYID` int(11) DEFAULT NULL COMMENT '策略ID',
  `STOCKID` varchar(64) NOT NULL COMMENT '股票代码',
  `DIRTYPE` smallint(6) DEFAULT '9' COMMENT '0买入,1卖出,9撤单',
  `ISTEST` smallint(6) DEFAULT '0' COMMENT '是否测试',
  `PRICE` float DEFAULT '0' COMMENT '买卖价格',
  `QUANTITY` int(11) DEFAULT '0' COMMENT '买卖数量',
  `USERID` int(11) DEFAULT '0' COMMENT '用户ID',
  `ACCOUNTID` varchar(32) NOT NULL DEFAULT '0' COMMENT '券商的帐号ID',
  `GDDM` varchar(32) DEFAULT NULL COMMENT '股东代码',
  `EXCHGID` int(11) DEFAULT '0' COMMENT '交易所ID， 上海1,深圳0(招商证券普通账户深圳是2)',
  `WEITUOID` varchar(32) DEFAULT NULL COMMENT '委托编号',
  `DETAIL` varchar(256) DEFAULT NULL COMMENT '券商返回-结果信息',
  `ERRORINFO` varchar(256) DEFAULT '0' COMMENT '券商返回-错误信息',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `tb_user_account`
--

CREATE TABLE `tb_user_account` (
  `USERID` int(11) NOT NULL DEFAULT '0' COMMENT '用户ID,是tb_user_basic的外键.',
  `TRADEID` int(11) NOT NULL DEFAULT '0' COMMENT '券商ID,对应中文含义参考字典表.tb_dict_trade',
  `ACCOUNTID` varchar(64) NOT NULL COMMENT '券商的登录帐号,如:平安帐号。表的主键',
  `PASSWORD` varchar(64) NOT NULL COMMENT '券商的登录密码',
  `CANAME` varchar(64) DEFAULT NULL COMMENT '帐户中文名称',
  `EXCHGID_SH` varchar(32) NOT NULL COMMENT '上交所交易ID,创建用户自动查询获取',
  `EXCHGID_SZ` varchar(32) NOT NULL COMMENT '深交所交易ID,创建用户自动查询获取',
  `CANUSAGE` smallint(6) NOT NULL DEFAULT '0' COMMENT '账户是否可用,如密码错误不可用帐号',
  `VISIBLE` smallint(6) DEFAULT '1' COMMENT '是否页面可见,删除帐号',
  `ADDTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '添加时间,添加之后不要修改',
  `MODTIME` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '信息最后修改时间',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_user_account`
--

INSERT INTO `tb_user_account` (`USERID`, `TRADEID`, `ACCOUNTID`, `PASSWORD`, `CANAME`, `EXCHGID_SH`, `EXCHGID_SZ`, `CANUSAGE`, `VISIBLE`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES
(20000, 1, '309219249819', '243167', 'Íõ¾ê', 'A720722620', '0156011732', 1, 1, '2017-03-30 09:58:59', '0000-00-00 00:00:00', NULL),
(10000, 2, '5890000049', '207623', 'ÏÄÑå¸Õ', 'A738685727', '0125561330', 1, 1, '2017-03-30 09:58:58', '0000-00-00 00:00:00', NULL),
(20000, 4, '10500998', '622792', NULL, '', '', 0, 0, '2017-03-22 14:42:59', '0000-00-00 00:00:00', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tb_user_basic`
--

CREATE TABLE `tb_user_basic` (
  `USERID` int(11) UNSIGNED NOT NULL COMMENT '用户ID,可登录使用',
  `GROUPID` int(11) DEFAULT '0' COMMENT '用户组ID,策略按分组控制.含义如:免费,vip1,vip2,vip3',
  `UENAME` varchar(64) NOT NULL COMMENT '英文名,可登录使用',
  `UCNAME` varchar(64) NOT NULL COMMENT '中文名,姓名',
  `PHONENUMBER` varchar(16) NOT NULL COMMENT '手机号,可登录使用',
  `PASSWORD` varchar(64) NOT NULL COMMENT '登录密码',
  `ADDRESS` varchar(255) NOT NULL COMMENT '通信地址',
  `ZIPCODE` varchar(16) NOT NULL COMMENT '邮编',
  `TYPEID` int(11) NOT NULL DEFAULT '0' COMMENT '类型:0测试，1免费 2包月 3包年 9终身',
  `STATUS` int(11) NOT NULL DEFAULT '0' COMMENT '禁用状态: 0正常 1管理员禁用 2测试到期 3付费过期',
  `LASTLOGIN` varchar(256) DEFAULT NULL COMMENT '用户最后访问',
  `SESSIONID` varchar(256) DEFAULT NULL,
  `ONLINE` smallint(6) NOT NULL DEFAULT '0' COMMENT '登陆状态，0表示非登陆，1表示已登陆',
  `ADDTIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次添加时间,一经创建不要修改',
  `MODTIME` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '修改时间',
  `REMARK` varchar(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tb_user_basic`
--

INSERT INTO `tb_user_basic` (`USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `LASTLOGIN`, `SESSIONID`, `ONLINE`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES
(10000, 1, 'tester', '测试用户', '15810865503', 'ttttt', 'beijing chaoyang', '100016', 0, 1, NULL, NULL, 1, '2017-02-10 01:50:50', '0000-00-00 00:00:00', NULL),
(20000, 2, 'test2', '正式用户', '12', '222222', 'beijing', '100016', 0, 1, '20170401_59302_897', NULL, 1, '2017-02-13 09:08:02', '0000-00-00 00:00:00', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_capital_conf`
--
ALTER TABLE `tb_capital_conf`
  ADD PRIMARY KEY (`ACCOUNTID`),
  ADD KEY `userid` (`USERID`);

--
-- Indexes for table `tb_dict_group`
--
ALTER TABLE `tb_dict_group`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `tb_dict_policygid`
--
ALTER TABLE `tb_dict_policygid`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `tb_dict_trade`
--
ALTER TABLE `tb_dict_trade`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `tb_log_login`
--
ALTER TABLE `tb_log_login`
  ADD UNIQUE KEY `ROWID` (`ROWID`);

--
-- Indexes for table `tb_order_id`
--
ALTER TABLE `tb_order_id`
  ADD PRIMARY KEY (`ORDERID`,`ACCOUNTID`);

--
-- Indexes for table `tb_policy_define`
--
ALTER TABLE `tb_policy_define`
  ADD PRIMARY KEY (`POLICYID`);

--
-- Indexes for table `tb_policy_usage`
--
ALTER TABLE `tb_policy_usage`
  ADD PRIMARY KEY (`USERID`,`POLICYID`);

--
-- Indexes for table `tb_snap_cancel_order`
--
ALTER TABLE `tb_snap_cancel_order`
  ADD PRIMARY KEY (`ROWID`);

--
-- Indexes for table `tb_snap_capital`
--
ALTER TABLE `tb_snap_capital`
  ADD PRIMARY KEY (`ROWID`);

--
-- Indexes for table `tb_snap_hisorder`
--
ALTER TABLE `tb_snap_hisorder`
  ADD PRIMARY KEY (`ROWID`);

--
-- Indexes for table `tb_snap_position`
--
ALTER TABLE `tb_snap_position`
  ADD PRIMARY KEY (`ROWID`);

--
-- Indexes for table `tb_trade_detail`
--
ALTER TABLE `tb_trade_detail`
  ADD PRIMARY KEY (`ROWID`);

--
-- Indexes for table `tb_user_account`
--
ALTER TABLE `tb_user_account`
  ADD PRIMARY KEY (`TRADEID`,`ACCOUNTID`),
  ADD KEY `userid` (`USERID`);

--
-- Indexes for table `tb_user_basic`
--
ALTER TABLE `tb_user_basic`
  ADD PRIMARY KEY (`USERID`),
  ADD UNIQUE KEY `username` (`UENAME`),
  ADD UNIQUE KEY `phonenumber` (`PHONENUMBER`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `tb_dict_policygid`
--
ALTER TABLE `tb_dict_policygid`
  MODIFY `ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `tb_log_login`
--
ALTER TABLE `tb_log_login`
  MODIFY `ROWID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增，主键';
--
-- 使用表AUTO_INCREMENT `tb_order_id`
--
ALTER TABLE `tb_order_id`
  MODIFY `ORDERID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- 使用表AUTO_INCREMENT `tb_snap_cancel_order`
--
ALTER TABLE `tb_snap_cancel_order`
  MODIFY `ROWID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增字段，主键', AUTO_INCREMENT=26;
--
-- 使用表AUTO_INCREMENT `tb_snap_capital`
--
ALTER TABLE `tb_snap_capital`
  MODIFY `ROWID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增字段，主键', AUTO_INCREMENT=35;
--
-- 使用表AUTO_INCREMENT `tb_snap_hisorder`
--
ALTER TABLE `tb_snap_hisorder`
  MODIFY `ROWID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增字段，主键';
--
-- 使用表AUTO_INCREMENT `tb_snap_position`
--
ALTER TABLE `tb_snap_position`
  MODIFY `ROWID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增字段，主键', AUTO_INCREMENT=38;
--
-- 使用表AUTO_INCREMENT `tb_trade_detail`
--
ALTER TABLE `tb_trade_detail`
  MODIFY `ROWID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增字段，主键';
--
-- 使用表AUTO_INCREMENT `tb_user_basic`
--
ALTER TABLE `tb_user_basic`
  MODIFY `USERID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID,可登录使用', AUTO_INCREMENT=20001;