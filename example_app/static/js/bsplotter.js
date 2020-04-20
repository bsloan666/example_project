//
//  bsplotter.js
//  given a canvas and some x,y data, plot thr graph. 
//
//
function area_under_curve(ctx,  x1, y1, x2, y2, ht, color="#008800"){

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2, ht);
    ctx.lineTo(x1, ht);
    ctx.fill();
    
}

function draw_edge(ctx, x1, y1, x2, y2, color="#008800", width=1){
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function draw_callout(ctx, x1, y1, x2, y2, x3, y3 ){
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.stroke();
}

function parseDate(s) {
  var b = s.split(/\D/);
  return new Date(b[0], --b[1], b[2]);
}

function parseCoords(text, start, end) {
    var samplestrs = text.split('#');
    var x = [];
    var y = [];
    console.log("start: "+start)
    var dstart = parseDate(start).getTime()/1000;
    var dend = parseDate(end).getTime()/1000;
    console.log("dstart: "+dstart)
    console.log("dend: "+dend)
    for( index = 0; index < samplestrs.length; index++){
        var coords = samplestrs[index].split(':');
        var date_val = Number(coords[0]);
        if(date_val > dstart && date_val < dend)
        {    
            x.push(Number(coords[0]));
            y.push(Number(coords[1]));
        }
    }
    return [x, y];
}

function parseKeyvals(text) {
    var samplestrs = text.split('#');
    var keys = [];
    var vals = [];
    for( index = 0; index < samplestrs.length; index++){
        var pair = samplestrs[index].split(':'); 
        keys.push(pair[0]);
        vals.push(Number(pair[1]));            
    }
    return [keys, vals];
}

function mlowest(inarray)
{
    var mmin = 10000000000.00;
    for( index = 0; index < inarray.length-1; index++)
    {
        if(inarray[index] < mmin)
        {
            if( inarray[index] == 0)
            {
                console.log("zero value at index "+index);
            }
            mmin = inarray[index];
        }
    }
    return mmin;
}

function mhighest(inarray)
{
    var mmax = 0.0;
    for( index = 0; index < inarray.length-1; index++)
    {
        if(inarray[index] > mmax)
        {
            mmax = inarray[index];
        }
    }
    return mmax;
}

function ranges(coords)
{
    var xmin = mlowest(coords[0]);
    var xmax = mhighest(coords[0]);
    var ymin = mlowest(coords[1]);
    var ymax = mhighest(coords[1]);
    return [xmin, xmax, ymin, ymax];
}


function lineGraph() {
    var cnvs = document.getElementById("linegraph");
    var txarea = document.getElementById("lineText");
    var start_date = document.getElementById("start").value;
    var end_date = document.getElementById("end").value;
    var ctx = cnvs.getContext("2d");
    var cnv_width = cnvs.width-24;
    var cnv_height = cnvs.height-24;
    var coords = parseCoords(txarea.value, start_date, end_date);
    var minmax = ranges(coords);
    console.log("sizes: "+coords[0].length+" "+coords[1].length);
    console.log("Dates: "+coords[0]);
    console.log("Values: "+coords[1]);
    console.log("MinMax: "+minmax);
    console.log("Date range in days:", coords[0][coords[0].length-2]-coords[0][0]);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, cnv_width+24, cnv_height+24);

    ctx.font = "10px Arial";
    ctx.fillStyle = "#000000";
    //var tdims = ctx.measureText(topo[0]);
    //ctx.fillText(topo[0], cnv_width/2-tdims.width/2, cnv_height-30);

    var xoffset = minmax[0];
    var yoffset = minmax[2];
    var xmult = (minmax[1] - xoffset);
    var ymult = (minmax[3] - yoffset);
    var toffset = minmax[0]*1000;
    var tmult = (minmax[1]*1000 - toffset);

    console.log(xmult);
    console.log(ymult);
    // plot 
    for( index = 0; index < 10; index++)
    {
        var x1 = 24+cnv_width/10 * index;
        var toyear = new Date(toffset + index/10.0 * tmult).getFullYear();
        var tomonth = new Date(toffset + index/10.0 * tmult).getMonth()+1;
        var todate = new Date(toffset + index/10.0 * tmult).getDate();
        var xval = tomonth+"/"+todate+"/"+toyear;
        draw_edge( ctx, x1, cnv_height+12, x1, cnv_height, "#000000");
        draw_edge( ctx, x1, cnv_height+12, x1, 0, "#BBBBBB");
        ctx.fillStyle = "#000000";
        ctx.fillText(xval, x1-20, cnv_height+24);
    }
    for( index = 0; index < 10; index++)
    {
        var y1 = cnv_height-cnv_height/10 * index;
        var yval = yoffset + index/10.0 * ymult;
        draw_edge( ctx, 12, y1, 24, y1, "#000000");
        draw_edge( ctx, cnv_width+24, y1, 24, y1, "#BBBBBB");
        ctx.fillStyle = "#000000";
        ctx.fillText(Math.floor(yval).toString(10), 0, y1-3);
    }
    for( index = 0; index < coords[0].length-2; index++)
    {
        var x1 = 24+((coords[0][index] - xoffset) / xmult) * cnv_width;
        var y1 = cnv_height - ((coords[1][index] - yoffset) / ymult) * cnv_height;
        var x2 = 24+((coords[0][index+1] - xoffset) / xmult) * cnv_width;
        var y2 = cnv_height - ((coords[1][index+1] - yoffset) / ymult) * cnv_height;
        area_under_curve( ctx, x1, y1, x2, y2, cnv_height, "#44EE44");
        draw_edge( ctx, x1, y1, x2, y2, "#008800", 3);
    }
}

function pieChart() {
    var cnvs = document.getElementById("piechart");
    var txarea = document.getElementById("pieText");
    var ctx = cnvs.getContext("2d");
    var cnv_width = cnvs.width;
    var cnv_height = cnvs.height;
    var keyvals = parseKeyvals(txarea.value);
    var colors = ["#558822", "#EEEE22", "#AA9944", "#9955BB", "#2255AA", "#997755"];
    var angle_count = 0.0;
    var full_circle = Math.PI * 2;
    var sum_total = 0;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, cnv_width, cnv_height);
    for( index = 0; index < keyvals[1].length; index++)
    {   
        sum_total  = sum_total + keyvals[1][index];
    }
    for( index = 0; index < keyvals[1].length; index++)
    {
        ctx.fillStyle = colors[index % keyvals[1].length];
        ctx.beginPath();
        ctx.moveTo(cnv_width/2, cnv_height/2);
        var frac = keyvals[1][index]/sum_total;
        console.log(angle_count);
        ctx.arc(cnv_width/2, cnv_height/2, cnv_height/3, angle_count+frac*full_circle, angle_count, true);
        ctx.lineTo(cnv_width/2, cnv_height/2);
        ctx.fill();
        var x1 = cnv_width/2 + Math.cos(angle_count+frac/2*full_circle) * (cnv_height/3 - 12)
        var y1 = cnv_height/2 + Math.sin(angle_count+frac/2*full_circle) * (cnv_height/3 - 12)
        var x2 = cnv_width/2 + Math.cos(angle_count+frac/2*full_circle) * (cnv_height/3 + 12)
        var y2 = cnv_height/2 + Math.sin(angle_count+frac/2*full_circle) * (cnv_height/3 + 12)
        var x3 = cnv_width/2 + cnv_height/2;
        var t3 = x3 + 4;
        var txt = Math.floor(frac*100).toString(10)+"% "+keyvals[0][index];
        if (x2 < cnv_width/2)
        {
            var tdims = ctx.measureText(txt);
            x3 = cnv_width/2 - cnv_height/2;
            t3 = x3 - (tdims.width + 4);
        }
        draw_callout( ctx, x1, y1, x2, y2, x3, y2);
        ctx.fillStyle = "#000000";
        ctx.fillText(txt, t3, y2+2);
        angle_count = angle_count + frac*full_circle;
    }
}
