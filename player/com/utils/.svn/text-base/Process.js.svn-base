var h5$ = {
		nameSpace:function(value)
		{
			var names = String(value).split('.');
			var objs = this;
			for(var i = 0; i<names.length; i++)
			{
				var subName = names[i];
				var subType = typeof(objs[subName]);
				if(subType != 'object' && subType != 'undefined')
				{
					throw('Invalid namespace '+value+',subName='+subName);
				}
				objs = objs[subName] = objs[subName] || {};
			}
		},
		//把对象生成Class
		createClass:function(value)
		{
			var cls = function()
			{
				if(typeof(this.__ctor) == 'function')
				{
					this.__ctor.apply(this,arguments);
				}
			};
			cls.prototype = cls.prototype || {};
			var type = 0;
			var fname;
			var get_set_obj = {};
			for(var name in value)
			{
				if(name.indexOf('getter_') === 0)
				{
					fname = name.split('_')[1];
					type = 1;
				}
				else if(name.indexOf('setter_') === 0)
				{
					fname = name.split('_')[1];
					type = 2;
				}
				else
				{
					type = 0;
				}
				switch(type)
				{
					case 0:
						cls.prototype[name] = value[name];
						break;
					case 1:
						get_set_obj[fname] = get_set_obj[fname] || {};
						get_set_obj[fname].get = value[name];
						break;
					case 2:
						get_set_obj[fname] = get_set_obj[fname] || {};
						get_set_obj[fname].set = value[name];
						break;
				}
			}
			//设置属性的方法
			for(var i in get_set_obj)
			{
				Object.defineProperty(cls.prototype,i,{
					get:get_set_obj[i].get,
					set:get_set_obj[i].set,
				});
			}
			return cls;
		},
		apply:function(scope,source)
		{
			for(var name in source)
			{
				scope[name] = source[name];
			}
			return scope;
		},
		lzwEncode : function(s)
		{
			var dict = {};
			var data = (s + "").split("");
			var out = [];
			var currChar = 0;
			var phrase = data[0];
			var code = 256;
			var i;
			for (i = 1; i < data.length; i++)
			{
				currChar = data[i];
				if (dict[phrase + currChar])
				{
					phrase += currChar;
				}
				else
				{
					out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
					dict[phrase + currChar] = code;
					code++;
					phrase = currChar;
				}
			}
			out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
			for (i = 0; i < out.length; i++)
			{
				out[i] = String.fromCharCode(out[i]);
			}
			return out.join("");
		},

		// Decompress an LZW-encoded string
		lzwDecode : function(s)
		{
			var dict = {};
			var data = (s + "").split("");
			var currChar = data[0];
			var oldPhrase = currChar;
			var out = [ currChar ];
			var code = 256;
			var phrase;
			var i;
			for (i = 1; i < data.length; i++)
			{
				var currCode = data[i].charCodeAt(0);
				if (currCode < 256)
				{
					phrase = data[i];
				}
				else
				{
					phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
				}
				out.push(phrase);
				currChar = phrase.charAt(0);
				dict[code] = oldPhrase + currChar;
				code++;
				oldPhrase = phrase;
			}
			return out.join("");
		}
};