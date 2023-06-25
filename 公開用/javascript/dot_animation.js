
let canvas;
let ctx;
let screen;
let screen_ctx;
let interval;

window.addEventListener("load",()=>
{
    canvas = document.getElementById("canvas");
    canvas.width = canvas_data.size_x * canvas_data.dot_size;
    canvas.height = canvas_data.size_y * canvas_data.dot_size;
    ctx = canvas.getContext("2d");

    screen = document.getElementById("screen");
    screen.width = canvas_data.size_x * canvas_data.dot_size;
    screen.height = canvas_data.size_y * canvas_data.dot_size;
    screen_ctx = screen.getContext("2d");

    screen.addEventListener("mousemove",(e)=>{getMousePosition(e)});
    screen.addEventListener("mousedown",(e)=>
    {
        switch(e.which)
        {
            case 1:
                mouse.down = true;
                break;
        }
    });
    screen.addEventListener("mouseup",(e)=>
    {
        switch(e.which)
        {
            case 1:
                mouse.down = false;
                switch(tool.type)
                {
                    case "ruler":
                        drawLine(mouse.str_x, mouse.str_y, mouse.pre_x, mouse.pre_y, tool.weight, tool.pen_type);
                        break;
                }
                break;
        }
    });

    interval = setInterval(() => {
        if(mouse.down == true)
        {
            if(mouse.pre_down == false)
            {
                mouse.str_x = mouse.x;
                mouse.str_y = mouse.y;
            }
            switch(tool.type)
            {
                case "pen":
                case "eraser":
                    drawLine(mouse.x, mouse.y, mouse.pre_x, mouse.pre_y, tool.weight, tool.pen_type);
                    break;
            }
            
        }
        mouse.pre_down = mouse.down;
        screen_ctx.clearRect(0,0,screen.width, screen.height);
        drawCursor(mouse.pre_x, mouse.pre_y);
        switch(tool.type)
        {
            case "ruler":
            case "fill":
            case "select":
            case "bucket":
                if(mouse.down == true)
                {
                    drawCursor(mouse.str_x, mouse.str_y);
                }
            break;
        }
    }, 1);
    
    ctx.fillStyle = "#00ffff";
    ctx.beginPath();
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fill();

    setColor(tool.color);
    selectTool(0);
})

document.addEventListener("mouseup",()=>
{
    mouse.down = false;
})

function setColor(color)
{
    ctx.fillStyle = color;
}

function drawCursor(x, y)
{
    screen_ctx.beginPath();
    screen_ctx.rect(
        Math.round(x-tool.weight/2)*canvas_data.dot_size,
        Math.round(y-tool.weight/2)*canvas_data.dot_size,
        tool.weight * canvas_data.dot_size,
        tool.weight * canvas_data.dot_size);
    screen_ctx.lineWidth = 3;
    screen_ctx.strokeStyle = "#ffffff";
    screen_ctx.stroke();
    screen_ctx.lineWidth = 1;
    screen_ctx.strokeStyle = tool.color;
    screen_ctx.stroke();
}

function drawLine(x,y,pre_x,pre_y,weight,pen_type)
{
    const vx = x - pre_x;
    const vy = y - pre_y;
    const lx = Math.abs(vx);
    const ly = Math.abs(vy);
    const number_of_dots = Math.max(lx,ly,1);
    let cx, cy;
    for(let i = 0; i < Math.round(number_of_dots + 1); i++)
    {
        cx = pre_x + vx * i / number_of_dots;
        cy = pre_y + vy * i / number_of_dots;
        drawDot(Math.round(cx), Math.round(cy), weight, pen_type);
    }
}

function drawDot(x, y, weight, dot_type)
{
    switch(dot_type)
    {
        case "":
            break;
        case "rect":
        default:
            ctx.beginPath();
            ctx.rect(
                Math.round(x-weight/2)*canvas_data.dot_size,
                Math.round(y-weight/2)*canvas_data.dot_size,
                weight * canvas_data.dot_size,
                weight * canvas_data.dot_size);
            ctx.fill();
            break;
    }
}

function getMousePosition(e)
{
    mouse.pre_x = mouse.x;
    mouse.pre_y = mouse.y;

    const rect = e.target.getBoundingClientRect();

    const viewX = e.clientX - rect.left;
    const viewY = e.clientY - rect.top;

    const scaleWidth = screen.clientWidth / screen.width;
    const scaleHeight = screen.clientHeight / screen.height;

    const canvasX = Math.round( viewX / scaleWidth / canvas_data.dot_size);
    const canvasY = Math.round( viewY / scaleHeight / canvas_data.dot_size);

    mouse.x = canvasX;
    mouse.y = canvasY;
}

function btColorAdd()
{
    const color = document.getElementById("color");
    const node = document.createElement("div");
    node.innerHTML = "■";
    node.classList.add("color");
    color.appendChild(node);
}
function btColorChange(){}
function btColorDelete(){}

function selectTool(num)
{
    switch(num)
    {
        case 0:
            tool.type = "pen";
            setColor(tool.color);
            break;
        case 1:
            tool.type = "eraser";
            setColor("#ffffffff");
            break;
        case 2:
            tool.type = "ruler";
            break;
        case 3:
            tool.type = "fill";
            break;
        case 4:
            tool.type = "bucket";
            break;
        case 5:
            tool.type = "select";
            break;
    }
    const tool_node = document.getElementById("tool").children;
    for(let i = 0; i < tool_node.length; i++ )
    {
        tool_node[i].src = "../pictures/dot/tool_off ("+pic_tool[i]+").PNG";
    }
    tool_node[num].src = "../pictures/dot/tool ("+pic_tool[num]+").PNG";
}

const pic_tool =
{
    0:4,    //pen
    1:6,    //eraser
    2:2,    //ruler
    3:5,    //fill
    4:1,    //bucket
    5:3     //select
}

let mouse =
{
    "x":0,
    "y":0,
    "pre_x":0,
    "pre_y":0,
    "str_x":0,
    "str_y":0,
    "down":false,
    "pre_down":false
}

let tool =
{
    "color":"#ff0000",
    "type":"pen",
    "weight":1,
    "pen_type":"rect"
}

let canvas_data =
{
    "size_x":32,
    "size_y":32,
    "dot_size":10
}

let picture_data_tmp =[];