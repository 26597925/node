echo off
SET MAJOR_VERSION=0
SET MINOR_VERSION=9
SET BUILD_NUMBER=65

SET BUILD_DATE=%date:~0,10%
SET BUILD_TIME=%time:~0,8%

SET BUILD_DATE=%BUILD_DATE:/=-%

echo Replace build date, time to module ...
sed -e s/{date}/%BUILD_DATE%/g -e s/{time}/%BUILD_TIME%/g -e s/{majorVersion}/%MAJOR_VERSION%/g -e s/{minorVersion}/%MINOR_VERSION%/g -e s/{buildNumber}/%BUILD_NUMBER%/g module.js.tpl >..\libcde\src\com\webp2p\core\common\Module.js
