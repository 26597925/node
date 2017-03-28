echo off

SET MAJOR_VERSION=0
SET MINOR_VERSION=9
SET BUILD_NUMBER=65
SET BUILD_DATE=%date:~0,10%
SET BUILD_TIME=%time:~0,8%
SET BUILD_DATE=%BUILD_DATE:/=-%
SET BUILD_TIME=%BUILD_TIME: =0%

SET CDE_FILE_COUNT=0
SET CDE_RELEASE_PATH=%~dp0
SET CDE_DEMO_JS_PATH=%CDE_RELEASE_PATH%\..\demo\js
echo Tools path: %CDE_RELEASE_PATH%
cd/d %CDE_RELEASE_PATH%

echo Replace build date, time to module ...
sed -e s/{date}/%BUILD_DATE%/g -e s/{time}/%BUILD_TIME%/g -e s/{majorVersion}/%MAJOR_VERSION%/g -e s/{minorVersion}/%MINOR_VERSION%/g -e s/{buildNumber}/%BUILD_NUMBER%/g module.js.tpl >..\libcde\src\com\webp2p\core\common\Module.js

echo Build file list ...
cat "%CDE_RELEASE_PATH%\..\demo\debug.html" | grep "../libcde/" | sed -f replace.sed > filelist-full.txt
cat "%CDE_RELEASE_PATH%\..\demo\debug.html" | grep -v "norelease" | grep "../libcde/" | sed -f replace.sed > filelist-release.txt
rem cat "%CDE_RELEASE_PATH%\..\demo\debug.html" | grep "../libcde/" | sed -f replace.sed > filelist-full.txt
cat "%CDE_RELEASE_PATH%\..\demo\debug.html" | grep "../sdk/" | sed -f replace.sed >> filelist-full.txt
cat "%CDE_RELEASE_PATH%\..\demo\debug.html" | grep "../sdk/" | sed -f replace.sed >> filelist-release.txt

del libcde.full.js >NUL 2>&1
del libcde.release.js >NUL 2>&1

echo Combining full js ...
rem for /R "%CDE_RELEASE_PATH%\..\libcde\src" %%s in (*) do ( 
rem 	type %%s >>libcde.full.js
rem 	SET /a CDE_FILE_COUNT+=1
rem ) 

for /f %%s in (filelist-full.txt) do ( 
	type %%s >>libcde.full.js
	SET /a CDE_FILE_COUNT+=1
)

echo Combining release js ...
for /f %%s in (filelist-release.txt) do ( 
	type %%s >>libcde.release.js
	SET /a CDE_FILE_COUNT+=1
) 

echo Compressing js, %CDE_FILE_COUNT% items ...
java -jar %CDE_RELEASE_PATH%\yuicompressor-2.4.8.jar --type js --charset utf-8 libcde.full.js -o libcde.demo.js
java -jar %CDE_RELEASE_PATH%\yuicompressor-2.4.8.jar --type js --charset utf-8 libcde.release.js -o libcde.min.js

cp libcde.full.js "%CDE_DEMO_JS_PATH%\libcde.full.js"
cp libcde.release.js "%CDE_DEMO_JS_PATH%\libcde.release.js"

echo (function(){ >libcde.demo2.js
type libcde.demo.js >>libcde.demo2.js
echo })(); >>libcde.demo2.js

echo (function(){ >libcde.min2.js
type libcde.min.js >>libcde.min2.js
echo })(); >>libcde.min2.js

..\..\..\build\dbin\code-mixer libcde.demo2.js "%CDE_DEMO_JS_PATH%\libcde.demo.js" "%CDE_DEMO_JS_PATH%\libcde-demo.symbols.txt" "%CDE_RELEASE_PATH%\..\libcde\src"
..\..\..\build\dbin\code-mixer libcde.min2.js "%CDE_DEMO_JS_PATH%\libcde.min.js" "%CDE_DEMO_JS_PATH%\libcde-min.symbols.txt" "%CDE_RELEASE_PATH%\..\libcde\src"

del libcde.full.js >NUL 2>&1
del libcde.release.js >NUL 2>&1
del libcde.demo.js >NUL 2>&1
del libcde.demo2.js >NUL 2>&1
del libcde.min.js >NUL 2>&1
del libcde.min2.js >NUL 2>&1

dir %CDE_DEMO_JS_PATH%\libcde.*.js

echo Done
pause