p2p$.ns('com.tools.collector');
p2p$.com.tools.collector.ClientBase = JClass.extend_({
    scope_:null,
    strings_:null,
    global_:null,
    module_:null,
    tag_:"com::tools::collector::ClientBase",
    init:function()
    {
        this.strings_ = p2p$.com.common.String;
        this.global_ = p2p$.com.common.Global;
        this.module_ = p2p$.com.selector.Module;
    },
    tidy:function(){
    },
});
