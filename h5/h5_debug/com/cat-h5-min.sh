path="$( cd "$( dirname "$0" )" && pwd )"
isMin=""
filelist_=()
function connect()
{
	rm -f $1
	for i in ${filelist_[@]}
	do
		while read -r line
		do
			echo "$line" >> $1
		done < $i
	done
}
function encode()
{
	isMin=".min"
	rm -f $1
	for i in ${filelist_[@]}
	do
		echo "processFile->$i"
		#标记注释
		zsstart=false
		knum=0
		while read -r line
		do
			tmp=$line
			#查找类命名空间
			g=$( expr "$tmp" : '.*\.ns("\(.*\)").*' )
			if [ "$g" ]; then
				hasClass_=false
				for i in ${tmpClass_[@]}
				do
					if [ "$i" = "$g" ]; then
						hasClass_=true
						break
					fi
				done
				if $hasClass_; then
					continue
				fi
				len_=${#tmpClass_[@]}
				tmpClass_[$len_]=$g
				echo "新的类命名空间->$g"
			fi
			
			#查找//开头一直到结尾的注释
			a=$( expr "$tmp" : '^\(\/\{2,\}.*\)$' )
			if [ "$a" ]; then
				echo "删除整行->$tmp"
				continue
			fi
			
			#查找/**/包含的注释
			if ! $zsstart; then
				e=$( expr "$tmp" : '^\(\/\*\).*' )
			fi
			if [ "$e" ]; then
				zsstart=true
			fi
			if $zsstart; then
				f=$( expr "$tmp" : '.*\(\*\/\)$' )
				echo "注释->$tmp"
				if [ "$f" ]; then
					zsstart=false
				fi
				continue
			fi
			
			#查找//到结尾并且前面非：的注释
			b=$( expr "$tmp" : '.*[^:]\(\/\/[^"]*\)$' )
			#查找单行中/**/的注释
			c=$( expr "$tmp" : '.*\(\/\*.*\*\/\).*' )
			#查找//到结尾并且前面是：和任意字符的注释
			d=$( expr "$tmp" : '.*["A-Z0-9][:]\(\/\/[^"]*\)$' )
			if [ "$b" ]; then
				echo "删除->$b"
				tmp=${tmp%%$b}
			elif [ "$c" ]; then
				echo "删除->$c"
				tmp=${tmp//$c/}
			elif [ "$d" ]; then
				echo "删除->$d"
				tmp=${tmp%%$d}
			fi
			echo -n "$tmp" >> $1
			#替换内部变量
		done < $i
	done
}
function combindFile()
{
	for file_ in $1/*
	do  
        if [ -d $file_ ]; then 
            combindFile $file_
        else
            filelist_[${#filelist_[@]}]=$file_
        fi  
    done
}
cd $path
#根据文件夹生成合并文件
dirs=("$path/common" "$path/player" "$path/selector" "$path/utils" "$path/enter" "$path/loaders" "$path/webp2p/core" "$path/webp2p/logic" "$path/webp2p/protocol" "$path/webp2p/segmentmp4" "$path/tools")
for i in ${dirs[@]}
do
	unset filelist_
	combindFile $i
	dir_=${i:${#path}}
	filename_="com"${dir_////.}".js"
	connect $filename_
done
#合成mp4lib与tslib
cp com.selector.js ../debug/js/Selector.js
cat com.utils.js com.common.js com.enter.js com.loaders.js > ../debug/js/H5.js
cat com.player.js com.webp2p.core.js com.webp2p.logic.js com.webp2p.protocol.js com.webp2p.segmentmp4.js > ../debug/js/lib.mp4.min.js
cat com.player.js com.webp2p.core.js com.webp2p.logic.js com.webp2p.protocol.js > ../debug/js/lib.ts.min.js
cat com.player.js > ../debug/js/lib.js
cat com.tools.js > ../debug/js/tools.js

#copy
cp -r ../debug/ ../svn/h5/debug/