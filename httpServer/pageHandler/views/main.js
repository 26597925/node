<script language="javascript" type="text/javascript" src="/public/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.jqplot.min.js"></script>
<script type="text/javascript" src="/public/js/jquery-ui-1.8.21.custom.min.js"></script>
<script type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.pieRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.donutRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.canvasTextRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.highlighter.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.canvasAxisLabelRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.barRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.categoryAxisRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.pointLabels.min.js"></script>

<style type="text/css" media="screen">
@import "/public/js/plugins/DataTables-1.9.2/media/css/demo_page.css";
@import "/public/js/plugins/DataTables-1.9.2/media/css/demo_table_jui.css";
</style>
<script type="text/javascript" src="/public/js/plugins/DataTables-1.9.2/media/js/jquery.dataTables.min.js"></script>
<link rel="stylesheet" type="text/css" href="/public/js/css/smoothness/jquery-ui-1.8.21.custom.css" />
<link rel="stylesheet" type="text/css" href="/public/js/jquery.jqplot.min.css" />

<script type="text/javascript">

<%- jsState %>

$(document).ready(function(){

$("#accordion").accordion();
$("#tabs_for_ptopratio").tabs();

<%- jsRegist %>

});


</script>