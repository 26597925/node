p2p$.ns('com.webp2p.core.common');
p2p$.com.webp2p.core.common.Map = CdeBaseClass.extend_({
	/*
	 * MAP对象，实现MAP功能
	 * 
	 * 接口： 
	 * size() 获取MAP元素个数 
	 * isEmpty() 判断MAP是否为空 
	 * clear() 删除MAP所有元素
	 * put(key, value) 向MAP中增加元素（key, value) 
	 * remove(key) 删除指定KEY的元素，成功返回True，失败返回False 
	 * get(key)	  获取指定KEY的元素值VALUE，失败返回NULL 
	 * element(index) 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL 
	 * containsKey(key) 判断MAP中是否含有指定KEY的元素
	 * containsValue(value) 判断MAP中是否含有指定VALUE的元素 
	 * values() 获取MAP中所有VALUE的数组（ARRAY） 
	 * keys() 获取MAP中所有KEY的数组（ARRAY）
	 * 
	 * 例子： var map = new Map();
	 * 
	 * map.put("key", "value"); var val = map.get("key") ……
	 * 
	 */
	elements_ : null,
	length : 0,
	init : function() {
		this.elements_ = new Array();
		this.length = 0;
	},
	size : function() {
		return this.elements_.length;
	},

	isEmpty : function() {
		return (this.elements_.length < 1);
	},
	empty : function() {
		return (this.elements_.length < 1);
	},
	front : function() {
		if (!this.isEmpty()) {
			return this.elements_[0].value;
		}
		return null;
	},
	pop_front : function() {
		if (!this.isEmpty()) {
			this.elements_.splice(0, 1);
			this.length--;
			return true;
		}
		return false;
	},
	// 删除MAP所有元素
	clear : function() {
		this.elements_ = new Array();
		this.length = 0;
	},

	// 向MAP中增加元素（key, value)
	set : function(_key, _value, checkSame) {
		if (typeof checkSame == 'undefined') {
			checkSame = true;
		}
		if (checkSame) {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					this.elements_[i].value = _value;
					return;
				}
			}
		}

		this.elements_.push({
			key : _key,
			value : _value
		});
		this.length++;
	},

	// 删除指定KEY的元素，成功返回True，失败返回False
	remove : function(_key) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					this.elements_.splice(i, 1);
					this.length--;
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},
	erase : function(_key) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					this.elements_.splice(i, 1);
					this.length--;
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},
	// 获取指定KEY的元素值VALUE，失败返回NULL
	get : function(_key) {
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					return this.elements_[i].value;
				}
			}
			return null;
		} catch (e) {
			return null;
		}
	},

	// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	element : function(_index) {
		if (_index < 0 || _index >= this.elements_.length) {
			return null;
		}
		return this.elements_[_index];
	},

	// 判断MAP中是否含有指定KEY的元素
	has : function(_key) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},
	// 判断MAP中是否含有指定KEY的元素
	find : function(_key) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},
	find2 : function(_key, retValue) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					retValue.value = this.elements_[i].value;
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 判断MAP中是否含有指定VALUE的元素
	containsValue : function(_value) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 获取MAP中所有VALUE的数组（ARRAY）
	values : function() {
		var arr = new Array();
		for ( var i = 0; i < this.elements_.length; i++) {
			arr.push(this.elements_[i].value);
		}
		return arr;
	},

	// 获取MAP中所有KEY的数组（ARRAY）
	keys : function() {
		var arr = new Array();
		for ( var i = 0; i < this.elements_.length; i++) {
			arr.push(this.elements_[i].key);
		}
		return arr;
	},
});
