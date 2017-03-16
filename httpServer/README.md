# web server
<li>
js
</li>
function(){<br />
	console.log(JSON.stringify(arguments));<br />
}<br />

ALTER TABLE `tb_user_basic` ADD `userLastLogin` INT NULL DEFAULT NULL COMMENT '用户最后访问时间' AFTER `STATUS`;