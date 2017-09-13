var video_ = null;
var playParams = {};
var player = null;
var range = null;

function initDemoPlayer() {
    var channelUrls = [];
    var channelUrl = "http://g3.letv.cn/vod/v2/MTMyLzI1LzM3L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMTg4NTAwOTMtYXZjLTIyNDk5MC1hYWMtMzIwMDAtMjcwODQwMC04OTk3NTgwMi0xYzc5MTUxMGM0YWViYWRiNTZhOGYzYTY3ODFhMjMxMC0xNDMxMzI2NDQ1NTc3Lm1wNA==?b=265&mmsid=30609515&tm=1431397100&key=23ecfcb28d589b6e24851f31b1e0bdbc&key2=XXXX&platid=5&splatid=511&playid=0&tss=ios&vtype=21&cvid=531532153054&payff=0&pip=7a8f598027a4ff6d1bde3023be1e453c&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.0344656640663743&pay=1&uinfo=cS1QZHAafXHG9StKK-JbRmCtiRAhUzHuN5aH9coO8AB0w8Ap2iLLmg==&iscpn=f9051&uuid=500D276C23D34EDDB8F869E8E63C6A8B7BC72F6B&rateid=350&ch=111";
    var channelUrl1 = "http://live.gslb.letv.com/gslb?stream_id=cctv5&tag=live_web&ext=m3u8&sign=live_web&format=2&expect=2&termid=1&pay=0&uid=-&ostype=Windows%207&hwtype=un&platid=10&splatid=1009&playid=1";
    var channelUrl2 = "http://live.gslb.letv.com/gslb?stream_id=bjws&tag=live_web&ext=m3u8&sign=live_web&format=2&expect=2&termid=1&pay=0&uid=-&ostype=Windows%207&hwtype=un&platid=10&splatid=1009&playid=1";
    var channelUrl3 = "http://live.gslb.letv.com/gslb?stream_id=cctv1HD_1300&tag=live_web&ext=m3u8&sign=live_web&format=2&expect=2&termid=1&pay=0&uid=-&ostype=Windows%207&hwtype=un&platid=10&splatid=1009&playid=1";
    var channelUrl4 = "http://g3.letv.cn/vod/v2/MTM2LzcvMjAvbGV0di11dHMvMTQvdmVyXzAwXzIyLTMxODMyMjAxNy1hdmMtMTc5NDI4Ni1hYWMtOTYwMDAtMjczNTMyMC02NTAzNTcyNjItM2Y3OGIwYTA1OGU4ODUwYWU4YzdhYWJiZTU5NWZmMGQtMTQzMDcyNzgyMTQ5Ny5tcDQ=?b=1902&cvid=409018809070&key=2ab69a8bfa67d4941ec47b55ea431103&lsbv=2bI&lsdg=2oUY4wanttREcnGEkRv0LmdtgfX&lsst=1&lssv=1zuuCM_T1_S85_Vd8G_PF710C8A317F66FB9CE4F161F5066FC3F_IW_M8ojjxHWm_LBc3F4&lstm=1YqHIE&mmsid=30317425&payff=0&pip=f24c132d7909a1041cc551489ab47037&platid=5&playid=0&splatid=511&tm=1430987790&token=97dbd03bb22fab27bca4a5305ca56bd8&tss=tvts&uid=35978477&uinfo=cx0pWSBPawUAXLAiYv1CE-l-NPe4tfXiaJJQj0spw6a8VvcMno6CBg==&vtype=51&key2=XXXX&ch=111";
    var channelUrl5 = "http://live.gslb.letv.com/gslb?stream_id=lb_erge_1300&tag=live_web&ext=m3u8&sign=live_web&format=2&expect=2&termid=1&pay=0&uid=-&ostype=Windows%207&hwtype=un&platid=10&splatid=1009&playid=1";
    var channelUrl6 = "http://g3.letv.cn/vod/v2/MTA3LzI0LzQ1L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMDI0MjUwOTQtYXZjLTIyOTg0MS1hYWMtMzIwMzAtOTEwNjctMzA5MzE0OS1jOGNlNGZhYmE2NDYyNWNlNDA0NTM0NGNlMzMwMGE5Mi0xNDIxMTMxODc1ODYzLm1wNA==?b=271&mmsid=2934275&tm=1434371533&key=2f81d42fb2203878a1833627e97c5076&key2=XXXX&platid=5&splatid=511&playid=0&tss=ios&vtype=21&cvid=531532153054&payff=0&pip=7a8f598027a4ff6d1bde3023be1e453c&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.1902720551006496&pay=1&uinfo=AAAAAAAAAADU8HGUiocJZiAfJ7hwrykO0fPOOWIV5-B3N7_B-QxzYg==&iscpn=f9051&uuid=E4ED92AD41E46033AD51C27AD5ACCAB2DC1C0236&token=null&uid=28048097&rateid=350";
    // xiao ban long er ge
    var channelUrl7 = "http://g3.letv.cn/vod/v2/MjU1LzYvNTIvbGV0di11dHMvMTQvdmVyXzAwXzIyLTExMDE3NjA2NDYtYXZjLTQxOTI2Ni1hYWMtNDgwMDAtMjc2NDYwMC0xNjU3MDc3NzctNmZmZGQzYWZlZTk3NzUxYWNmNzE2Zjg4Y2ZiNWQ4MTctMTQ5NTA5OTEwNDMxMC5tcDQ=?b=479&mmsid=64894735&tm=1495159251&key=e3ee62d1bb4b0774a99a90ba8123df9e&platid=3&splatid=301&playid=0&tss=no&vtype=13&cvid=253646360256&payff=0&pip=658afe18efdce82954d137ae6f1f5f90&format=1&jsonp=vjs_14951592516702&expect=3&p1=0&p2=04&termid=2&ostype=android&hwtype=un&uuid=1159251551180219&vid=29526551&";
//    var channelUrl7 = "http://g3.letv.com/vod/v2/MjQ2LzQvMTYvbGV0di1ndWcvMTcvdmVyXzAwXzIyLTEwOTI3MjMzMDctYXZjLTU4OTI2OC1hYWMtNjQzNDMtMTUwNDAtMTI1Mzg1My1mOGJmNDFlMDc4YWVhZTllNWExNWQ1YzgyOGFhMGMwOS0xNDkwNjkzNjUwNTc4Lm1wNA==?b=271&mmsid=29883293&tm=1435130343&key=9f9312281a949c98cd09a95eba15a731&playid=0&tss=ios&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.570736956782639&pay=1&uinfo=AAAAAAAAAAAuCaFFFBjFBuz5Elc90DkG0gyX3QXv7fdIFqlrzUoI6w==&iscpn=f9051&uuid=A3FD19A78FD3B9AE941CB0BA754A167352241E7F&token=null&uid=68923082&rateid=1000&key2=XXXX&platid=5&splatid=511";
//    var channelUrl7 = "http://g3.letv.cn/vod/v2/MTQwLzIwLzk2L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMTg5MTc4MzQtYXZjLTQ0ODY5Mi1hYWMtMzIwMzItMTA2MjgwLTY0OTU5NTUtMjc4NmI2NjhmZTQ4NTczOGNhMzI2NGIxOTQ5YmY4YjItMTQzMTQxMDc0NzE0NS5tcDQ=?b=488&mmsid=29806813&tm=1435115657&key=5ca2c364b10f1b5dd4bb55ca9f1ea7c0&playid=0&tss=ios&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.19093265710398555&pay=1&uinfo=AAAAAAAAAACEAMq8OlKcd_j8yzuQAajngrgVb86e3uBWZnpGr4zVNQ==&iscpn=f9051&uuid=BBF23F1E6EAD8E3BE730E6B38B1D60C0C7D18E7A&token=null&uid=68923082&rateid=1000&key2=XXXX&platid=5&splatid=511";
    // xiao ban long fan shu
    var channelUrl8 = "http://g3.letv.cn/vod/v2/MTMzLzEzLzMyL2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMTczNjcyNjYtYXZjLTEzOTc4NS1hYWMtMzIwMDYtNzYxMzAwLTE2ODUwNDc0LTA1MDhkNTBlZGUxNjc4OGE0YmU2ZmExOTY4MWY0Y2UyLTE0Mjk2MDE5NTUzNDMubXA0?b=177&mmsid=29883293&tm=1435130343&key=9f9312281a949c98cd09a95eba15a731&playid=0&tss=ios&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.570736956782639&pay=1&uinfo=AAAAAAAAAAAuCaFFFBjFBuz5Elc90DkG0gyX3QXv7fdIFqlrzUoI6w==&iscpn=f9051&uuid=A3FD19A78FD3B9AE941CB0BA754A167352241E7F&token=null&uid=68923082&rateid=1000&key2=XXXX&platid=5&splatid=511";
    // 失孤
    var channelUrl9 = "http://g3.letv.cn/vod/v2/MjUyLzMwLzcxL2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0xMTAxNDI5NzgzLWF2Yy00MTkwMzUtYWFjLTQ4MDAwLTI3NTg2MDAtMTY1MjU4ODM4LTVlNDE3MDY2YmZhNzhhYTgwZmVjODk3ZmFjMjY1MTNiLTE0OTQ5MzIwNTIxNDkubXA0?b=479&mmsid=64860349&tm=1495003483&key=9b404475c61e5334a78019bb5e027d87&platid=3&splatid=301&playid=0&tss=ios&vtype=13&cvid=751966263640&payff=0&pip=63ba90c5c5ec050228d84f8bc814177f&format=1&expect=3&p1=0&p2=04&termid=2&ostype=android&hwtype=un&uuid=1003485516368576&vid=29493019&";
//    var channelUrl9 = "http://g3.letv.cn/vod/v2/MTMyLzQ2Lzc5L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMTg1NzI2MzMtYXZjLTQ3NzE0OS1hYWMtMzIwMDAtNjIzNDcyMC00MDM5MDkzMDUtYWIwNjYyYzI4MDM0MmNhZTNkN2Q0YjMxZGY3M2FhMTMtMTQzMDk5MzMyMDU5OC5tcDQ=?b=518&mmsid=30455252&tm=1435212113&key=b9a3177a369c51be36c9123bc62c76d9&playid=0&tss=ios&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.3153977831825614&pay=1&uinfo=AAAAAAAAAACN3TWSJxqyw0ilfjmV7hiZe-S11VzXq7EanpvO8uKV-g==&iscpn=f9051&uuid=AC9106EEA0F18DBE322232FB34F70D507CEEF0C3&token=null&uid=68923082&rateid=1000&key2=XXXX&platid=5&splatid=511";
    // 西游记之大闹天宫
    var channelUrl10 = "http://g3.letv.cn/vod/v2/MjQ4LzUzLzEvbGV0di11dHMvMTQvdmVyXzAwXzIyLTExMDI3NTM5MTAtYXZjLTQxNzg5My1hYWMtNDgwMDAtNjI2NjgzNC0zNzQ0NzEyOTMtZjc3MzRhMGIzZjIzOTlhNjM5NDExMjFhMzA5NmI4YWQtMTQ5NTYzNzEwMzQzMS5tcDQ=?b=478&mmsid=64993949&tm=1496383821&key=d20b55f47025c4cc22aa55c3c0ddb096&platid=5&splatid=511&playid=0&tss=no&vtype=13&cvid=686612833688&payff=1&pip=a07c163997218f5f407c4592261d1c9f&token=ec07862b46afc9c94a73978db6d623fc&uid=140140087&format=1&expect=3&p1=0&p2=04&termid=2&ostype=android&hwtype=un&uuid=1383821487499073&vid=29621955&";
    // 澳门风云
    var channelUrl11 = "http://g3.letv.cn/vod/v2/MTIzLzQ5LzEwMy9sZXR2LXV0cy8xNC92ZXJfMDBfMjItMzAzMzgwMTYxLWF2Yy00ODAwNjktYWFjLTMyMDAxLTU2MTExMjUtMzY1MzY2NTE3LTAzYzgyMjExNmM5MzEzZGRhOWFkNWRhYTBiZDBlNzcxLTE0MjIwNTY3NzIwMjAubXA0?b=520&mmsid=20361352&tm=1435212290&key=da7ab8fb0f1db871aa04603ef62bea93&playid=0&tss=ios&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.12527999049052596&pay=1&uinfo=AAAAAAAAAACN3TWSJxqyw0ilfjmV7hiZU0SzK2ewq1aGWWMfTC8A4w==&iscpn=f9051&uuid=A5C083AAF5789F4CDEC1C53B4A25747DB7DFF16C&token=null&uid=68923082&rateid=1000&key2=XXXX&platid=5&splatid=511";
    // 奔跑吧 兄弟0619
    var channelUrl12 = "http://g3.letv.cn/vod/v2/MTQ4LzEyLzc3L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMjEyNTk0OTctYXZjLTQ3OTg3OS1hYWMtMzIwMDEtNTY4NDY4MC0zNzAxNTk1NjktNzhiYzIyYmRmMzQyOTAzMmMxMTVhM2U1ZTgxOWI0Y2YtMTQzNDc4NTgxNTYzOS5tcDQ=?b=520&mmsid=32216530&tm=1435212430&key=aefe6e63408f2946742ac6ee8356e0af&playid=0&tss=ios&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.1521388436667621&pay=1&uinfo=AAAAAAAAAACN3TWSJxqyw0ilfjmV7hiZYrwfAs3kG8-418n3gfiGWw==&iscpn=f9051&uuid=A502AA342BF519D956193A99555CE84C03B1E4EC&token=null&uid=68923082&rateid=1000&key2=XXXX&platid=5&splatid=511";
    // 奔跑吧 兄弟0612
    var channelUrl13 = "http://g3.letv.cn/vod/v2/MTQ2LzEyLzEwOC9sZXR2LXV0cy8xNC92ZXJfMDBfMjItMzIwODE2NDM2LWF2Yy00Nzk4NzQtYWFjLTMyMDAxLTU0NTM4ODAtMzU1MTIxNjAxLWVlNTZhZDUyOGRmYTZhNTMwNTAyZGNlNWVjMWY1MzA0LTE0MzQxNDk1Mjg2MjUubXA0?b=520&mmsid=31972033&tm=1435212554&key=6f32e4157ebe98e8d8b01fa13ac2e01c&playid=0&tss=ios&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.75779126631096&pay=1&uinfo=AAAAAAAAAACN3TWSJxqyw0ilfjmV7hiZL4SXfYFLg7yVYxmAZp2Caw==&iscpn=f9051&uuid=FD97E844D952DFE1511DCFE5AE5F8BB35D3A9F5F&token=null&uid=68923082&rateid=1000&key2=XXXX&platid=5&splatid=511";

    // 奔跑吧 兄弟0619 1080P 超清 高清
    var channelUrl14 = "http://g3.letv.cn/vod/v2/MTQ1LzQzLzMvbGV0di11dHMvMTQvdmVyXzAwXzIyLTMyMTI1OTQ5OC1hdmMtODc5ODA5LWFhYy02NDAwMS01Njg0NjgwLTY3NzA5NTQ0My0zYTc2MDZjOTdhNTU2ODc3ZTMxMGY0MDA3NmMzMjM3YS0xNDM0NzkxMzk3NTczLm1wNA==?b=952&mmsid=32216530&tm=1435212884&key=e6adb3128873819f19edd44902b961b5&key2=XXXX&platid=5&splatid=511&playid=0&tss=ios&vtype=22&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.6636255555786192&pay=1&uinfo=AAAAAAAAAACN3TWSJxqyw0ilfjmV7hiZ3Lt2tnoLdq4tkXInI2DIEw==&iscpn=f9051&uuid=E4DBB2A14CA1CD657AD1B13CACB34A5485E4BBB1_1&token=null&uid=68923082&rateid=1300";
    var channelUrl15 = "http://g3.letv.cn/vod/v2/MTQ2LzcvOTEvbGV0di11dHMvMTQvdmVyXzAwXzIyLTMyMTI1OTUwMC1hdmMtMTc5OTYzNS1hYWMtOTYwMDAtNTY4NDY4MC0xMzU1NTYyNTA3LTY2MzQwZjkwMzU3NmNhYzUwZGYzMDE1OTZlNWY4MGY0LTE0MzQ3OTMyNjcyMzkubXA0?b=1907&mmsid=32216530&tm=1435212884&key=18c3a5849bcf80ad48763e9806ca4f5b&key2=XXXX&platid=5&splatid=511&playid=0&tss=ios&vtype=51&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.46352251060307026&pay=1&uinfo=AAAAAAAAAACN3TWSJxqyw0ilfjmV7hiZ3Lt2tnoLdq4tkXInI2DIEw==&iscpn=f9051&uuid=E4DBB2A14CA1CD657AD1B13CACB34A5485E4BBB1_2&token=null&uid=68923082&rateid=720p";
    var channelUrl16 = "http://g3.letv.cn/vod/v2/MTQ2LzEwLzIvbGV0di11dHMvMTQvdmVyXzAwXzIyLTMyMTI1OTUwMS1hdmMtMjk5OTUwNi1hYWMtMTI4MDAxLTU2ODQ2ODAtMjIzMDk0ODE2OS1kMjhmNDkwYjMyZDI0YjNlZDkxZTUxZTA0YzJjOWY2MC0xNDM0ODAyODczMzYxLm1wNA==?b=3139&mmsid=32216530&tm=1435212884&key=dfda45d9aa9b57724d938b0ed64465a5&key2=XXXX&platid=5&splatid=511&playid=0&tss=ios&vtype=52&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.5958768306300044&pay=1&uinfo=AAAAAAAAAACN3TWSJxqyw0ilfjmV7hiZ3Lt2tnoLdq4tkXInI2DIEw==&iscpn=f9051&uuid=E4DBB2A14CA1CD657AD1B13CACB34A5485E4BBB1_3&token=null&uid=68923082&rateid=1080p";

    // 奔跑吧 兄弟0612 1080P 超清 高清
    var channelUrl17 = "http://g3.letv.cn/vod/v2/MTQzLzQyLzEvbGV0di11dHMvMTQvdmVyXzAwXzIyLTMyMDgxNjQ0MC1hdmMtMjk5OTY1Ni1hYWMtMTI4MDAxLTU0NTM4ODAtMjE0MDQ2ODU0MS0xMmQ0MzYzNTRlOTI2OTk5YTg4NDMyN2MzOGIxM2QyNS0xNDM0MTY1MTMwMjExLm1wNA==?b=3139&mmsid=31972033&tm=1435213068&key=10b4a9c29f240d7c8c3007254bdc9887&key2=XXXX&platid=5&splatid=511&playid=0&tss=ios&vtype=52&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.8115562689490616&pay=1&uinfo=AAAAAAAAAAAqlolo2JdRxJbrs7nAEj8XajAYhSjFZG6xMlQo8Z-cwA==&iscpn=f9051&uuid=B7040545E71ED9838A92D9933712839DEC29304B&token=null&uid=68923082&rateid=1080p";
    var channelUrl18 = "http://g3.letv.cn/vod/v2/MTQ3LzE3LzEvbGV0di11dHMvMTQvdmVyXzAwXzIyLTMyMDgxNjQzOS1hdmMtMTc5ODczMC1hYWMtOTYwMDAtNTQ1Mzg4MC0xMjk5OTAzNzM0LWRkNjg3ZjRjNjcwYTljN2FmNGU5OTg5ODQ2YzBkMjY1LTE0MzQxNTY3NDczNjgubXA0?b=1906&mmsid=31972033&tm=1435213068&key=653a96e1363e3341dcf8b65a20c4dae0&key2=XXXX&platid=5&splatid=511&playid=0&tss=ios&vtype=51&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.40318843396380544&pay=1&uinfo=AAAAAAAAAAAqlolo2JdRxJbrs7nAEj8XajAYhSjFZG6xMlQo8Z-cwA==&iscpn=f9051&uuid=B7040545E71ED9838A92D9933712839DEC29304B_1&token=null&uid=68923082&rateid=720p";
    var channelUrl19 = "http://g3.letv.cn/vod/v2/MTQ5LzI4LzgzL2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMjA4MTY0MzctYXZjLTg3OTkyMi1hYWMtNjQwMDEtNTQ1Mzg4MC02NDk2NzY1MDEtOWE3NTg0YjI0YjY3YmQyNTY4NTk4MTMxNTViYjBkNDUtMTQzNDE1NDQ0MzU2Ny5tcDQ=?b=952&mmsid=31972033&tm=1435213068&key=9d5a10e2bca1ef09a8a2843ff78b22e1&key2=XXXX&platid=5&splatid=511&playid=0&tss=ios&vtype=22&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&ctv=pc&termid=1&format=1&hwtype=un&ostype=Windows7&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.22503641434013844&pay=1&uinfo=AAAAAAAAAAAqlolo2JdRxJbrs7nAEj8XajAYhSjFZG6xMlQo8Z-cwA==&iscpn=f9051&uuid=B7040545E71ED9838A92D9933712839DEC29304B_2&token=null&uid=68923082&rateid=1300";

    var channelUrl20 = "http://g3.letv.cn/vod/v2/MTAzLzUxLzEwNC9sZXR2LXV0cy8xNC92ZXJfMDBfMjAtMzAxNDEyNjczLWF2Yy00ODAxOTQtYWFjLTMyMDAxLTI3MDM5NjAtMTc2MTQxMzY3LTNmNTQ1YTU5OThlM2I3ZWRiODM5MTAzMDQ4ZTE1MTk3LTE0MjAyMTk1NzMwMzQubXA0?b=521&mmsid=1782541&tm=1436922643&key=f68561d6ea45abe4b8a2805244c7ddb6&playid=0&tss=no&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&format=1&expect=3&p1=0&p2=06&termid=2&ostype=un&hwtype=un&uuid=1922563760849609&key2=XXXX&platid=5&splatid=511";
    var channelUrl21 = "http://g3.letv.cn/vod/v2/MTIxLzEzLzE3L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMDcxNTY1NTctYXZjLTQ4MDI0My1hYWMtMzIwMDEtMjcwODY4MC0xNzY0NzEwNzctYTQ4NWI5NzZkMzZiMzVhOWY5MjgwMzFiMmJkNDM4N2YtMTQyMzg1NDMzODk4OS5tcDQ=?b=521&mmsid=1757752&tm=1436922685&key=1a85ce51f12db9d6a736214955195d72&playid=0&tss=no&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&format=1&expect=3&p1=0&p2=06&termid=2&ostype=un&hwtype=un&uuid=1922605440212954&key2=XXXX&platid=5&splatid=511";
    var channelUrl22 = "http://g3.letv.cn/vod/v2/MTA4LzE2Lzk0L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMDcxNTY2MTQtYXZjLTQ4MDE1Ny1hYWMtMzIwMDEtMjcwOTA4MC0xNzY0NzY2NzMtN2EyNDdmOTljNTUzNWFhMWNkMDI4MzQ0M2JkZGQ4OTUtMTQyMzg1OTE2Mzc1Ny5tcDQ=?b=521&mmsid=1758032&tm=1436922721&key=a71683a6c574facacca978a66ad18776&playid=0&tss=no&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&format=1&expect=3&p1=0&p2=06&termid=2&ostype=un&hwtype=un&uuid=1922642201830123&key2=XXXX&platid=5&splatid=511";
    var channelUrl23 = "http://g3.letv.cn/vod/v2/MTIzLzkvMzEvbGV0di11dHMvMTQvdmVyXzAwXzIyLTMwNzE1NjcwNi1hdmMtNDgwMjcyLWFhYy0zMjAwMS0yNzA5MDgwLTE3NjUxMDU4MS1lYzEyNzU3MzdiYzdjMTUwYzc4MzU1YTg0YzdmNDc2ZS0xNDIzODU5OTI4MjYxLm1wNA==?b=521&mmsid=1758885&tm=1436922736&key=225c41477faab9a57e24fcac5060f438&playid=0&tss=no&vtype=13&cvid=588716404262&payff=0&pip=df5f2109c483e82473e4d3580041398e&format=1&expect=3&p1=0&p2=06&termid=2&ostype=un&hwtype=un&uuid=1922656404435803&key2=XXXX&platid=5&splatid=511";
    var channelUrl24 = "http://g3.letv.cn/vod/v2/MjQ2LzQ5LzY3L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0xMDg0NzU5Nzg5LWF2Yy00MTgyNTAtYWFjLTQ4MDAwLTUxODYzMjAtMzEwNDA4MTY5LWJiNWJmNGEyYmFiODIwYmNlYjBjMDA2YjJkNjlmMjRjLTE0ODcwNzgyMzQ4NzAubXA0?b=478&mmsid=62788472&tm=1492480104&key=70a15083e93607252487bce8d1aeb279&platid=5&splatid=511&playid=0&tss=ios&vtype=13&cvid=751966263640&payff=0&pip=63ba90c5c5ec050228d84f8bc814177f&format=1&expect=3&p1=0&p2=04&termid=2&ostype=Windows&hwtype=un&uuid=1480103694008057&vid=27653428&";
    channelUrls.push(channelUrl);
    channelUrls.push(channelUrl1);
    channelUrls.push(channelUrl2);
    channelUrls.push(channelUrl3);
    channelUrls.push(channelUrl4);
    channelUrls.push(channelUrl5);
    channelUrls.push(channelUrl6);
    channelUrls.push(channelUrl7);
    channelUrls.push(channelUrl8);
    channelUrls.push(channelUrl9);
    channelUrls.push(channelUrl10);
    channelUrls.push(channelUrl11);
    channelUrls.push(channelUrl12);
    channelUrls.push(channelUrl13);
    channelUrls.push(channelUrl14);
    channelUrls.push(channelUrl15);
    channelUrls.push(channelUrl16);
    channelUrls.push(channelUrl17);
    channelUrls.push(channelUrl18);
    channelUrls.push(channelUrl19);
    channelUrls.push(channelUrl20);
    channelUrls.push(channelUrl21);
    channelUrls.push(channelUrl22);
    channelUrls.push(channelUrl23);
    channelUrls.push(channelUrl24);
    
    var location = document.location.href;
    var arr_=location.split("?")[1].split("&");
    var urlParams={};
    for(var i=0;i<arr_.length;i++)
    {
    	urlParams[arr_[i].split("=")[0]]=arr_[i].split("=")[1];
    }
	var playUrl = channelUrl;
	if (urlParams.hasOwnProperty('streamId')) {
		playUrl = "http://live.gslb.letv.com/gslb?stream_id=" + urlParams['streamId'] + "&tag=live_web&ext=m3u8&sign=live_web&format=2&expect=2&termid=1&pay=0&uid=-&ostype=Windows%207&hwtype=un&platid=10&splatid=1009&playid=1";
	}
	if (urlParams.hasOwnProperty('videoId')) {
		var videoId = parseInt(urlParams['videoId']);
		if (isNaN(videoId)) {
			videoId = 0;
		}
		playUrl = channelUrls[videoId];
	}
    document.getElementById('m3u8-url').value = playUrl;
    video_ = document.getElementById("player");
	var logLevel = urlParams.hasOwnProperty("logLevel") ? parseInt(urlParams["logLevel"]) : 14;
	var logType = urlParams.hasOwnProperty("logType") ? parseInt(urlParams["logType"]) : 3;
	//替换参数
	var url = new p2p$.com.common.Url();
	url.fromString_(playUrl);
	url.getParams().set("appId",800);
    url.getParams().set("logLevel",logLevel);
    url.getParams().set("logType",logType);
    url.getParams().set("uploadLog",(urlParams.hasOwnProperty("uploadLog") ? urlParams["uploadLog"] : 0));
    url.getParams().set("logServer",urlParams["logServer"]);
    url.getParams().set("showConsole",(urlParams.hasOwnProperty("showConsole")  ? urlParams["showConsole"] : 1));
    url.getParams().set("closeWebrtc",(urlParams.hasOwnProperty("closeWebrtc")  ? urlParams["closeWebrtc"] : 1));
    url.getParams().set("closeWebsocket",(urlParams.hasOwnProperty("closeWebsocket")  ? urlParams["closeWebsocket"] : 1));
    url.getParams().set("autoplay",urlParams.hasOwnProperty("autoplay")  ? urlParams["autoplay"] : 1);
    url.getParams().set("startTime",urlParams.hasOwnProperty("startTime")  ? urlParams["startTime"] : -1);
    url.getParams().set("encode",urlParams.hasOwnProperty("encode")  ? urlParams["encode"] : 0);
    url.getParams().set("useType",urlParams.hasOwnProperty("useType")  ? urlParams["useType"] : -1);
    url.getParams().set("jsonp",1);
    url.getParams().set("config","js/H5SelectorConfig.inc");
    url.getParams().set("domains","/");
	// var tm=Math.round(new Date().getTime()/1000);
    // playUrl = playUrl.replace(/splatid=\d{1,}/,"splatid=301");
    // playUrl = playUrl.replace(/platid=\d{1,}/,"platid=3");
    // playUrl = playUrl.replace(/tm=\d{1,}/,"tm="+tm);
	playUrl = url.toString();
	playParams = {
		video:video_,
		playUrl:playUrl
	};
	if (urlParams.showConsole==1) {
		document.getElementById("cde-console-layer").style.display="";
	}
    player = new p2p$.com.enter.H5P2P(playParams);
    setInterval(function() {
		progressBar();
	}, 300);
}
function progressBar() {
	if (!player||!video_) {
		return;
	}
	var time = video_.currentTime;
	var maxduration = video_.duration;
	var percentage = 100 * time / maxduration;
	var buffered=getBufferLength(video_.buffered,time);
	document.getElementsByClassName('current')[0].innerText=(typeof (time) == 'number' ? time.toFixed(0) : '-');
	document.getElementsByClassName('buffered')[0].innerText=(typeof (buffered) == 'number' ? buffered : '-');
	document.getElementsByClassName('duration')[0].innerText=(typeof (maxduration) == 'number' ? maxduration.toFixed(0) : '-');
	if(document.getElementsByClassName('timeBar').length>0){
		document.getElementsByClassName('timeBar')[0].style.width=percentage + '%';
	}
}
function vjs(data)
{
	console.log(data);
}
function getBufferLength(buffer,time)
{
	if(!buffer)
	{
		return;
	}
	var st_=0;
	var et_=0;
	var bufferTime=0;
	for(var i=0;i<buffer.length;i++)
	{
		st_=buffer.start(i);
		et_=buffer.end(i);
		if(st_<=time && et_>=time)
		{
			bufferTime = et_;
			break;
		}
	}
	return bufferTime;
}
function doPlay() {
	if (!player) {
		return;
	}
	try {
		player.openUrl_(document.getElementById('m3u8-url').value); 
	} catch (e) {
		alert("Create media player failed, error: " + e);
	}
}
function callback(params)
{
	var type = params["type"];
	switch(type){
		case "VIDEO.PLAY.FIRST":
            var init = params["init"];
            var add = params["add"];
            var playing = params["playing"];
            var meta = params["meta"];
            var load = add - meta;
            var play = playing - add;
            document.getElementsByClassName('usetime')[0].innerText=(typeof (load) == 'number' ? load.toFixed(0) : '-')+"/"+(typeof (play) == 'number' ? play.toFixed(0) : '-');
			break;
		case "VIDEO.PLAY.SEEKED":
            var useTime = params["params"]["utime"];
            document.getElementsByClassName('usetime')[0].innerText=(typeof (useTime) == 'number' ? useTime.toFixed(0) : '-');
			break;
		case "VIDEO.BUFFER.RANGE":
            var rang_ = params["range"];
            var duration = params["dur"];
            if(this.range == null)
            {
                this.range = document.getElementsByClassName("range")[0];
            }
            while(this.range.childNodes.length>0)
            {
                this.range.removeChild(this.range.childNodes[0]);
            }
            var maxWidth = document.getElementById("progressBar").clientWidth;
            var time_=0;
            var span_;
            var lastpos_ = 0;
            var total_=0;
            var tempw=0;
            for(var i=0;i<rang_.length;i++)
            {
                span_=document.createElement("span");
                span_.className="blank";
                this.range.appendChild(span_);
                time_=rang_[i][0];
                pos_ = time_*maxWidth/duration;
                tempw=pos_-lastpos_;
                span_.style.width=tempw+"px";
                lastpos_=pos_;
                time_ = rang_[i][1];
                pos_ = time_*maxWidth/duration;
                span_ = document.createElement("span");
                span_.className="buffer";
                span_.setAttribute("title",rang_[i][0]+"-"+rang_[i][1])
                this.range.appendChild(span_);
                tempw=pos_-lastpos_;
                lastpos_=pos_;
                span_.style.width = tempw+"px";
            }
            for(var i=0;i<this.range.childNodes.length;i++)
            {
                total_+=this.range.childNodes[i].clientWidth;
            }
            break;
    }
}
