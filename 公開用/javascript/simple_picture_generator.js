window.addEventListener("load",()=>
{
    addTable();
    generate();
})

window.addEventListener("change",()=>
{
    generate();
})

function generate()
{
    const canvas = document.getElementById("canvas");
    const size_x = document.getElementById("canvas_size_x").value;
    const size_y = document.getElementById("canvas_size_y").value;
    const size = [size_x, size_y];
    const size_min = Math.min(size_x, size_y);

    //キャンバスサイズが0でないなら表示
    if(size_min == 0){canvas.hidden = true; }
    else
    {
        canvas.width = size_x;
        canvas.height = size_y;
        canvas.hidden = false;

        //Jsonデータを代入用
        let grad_dt;
        let draw_dt;
        //
        let ctx = canvas.getContext("2d");
        let grad;

        for(let i = 0; i < picture_data.length; i++)
        {
            //Json読み取り
            grad_dt = picture_data[i].grad;
            draw_dt = picture_data[i].draw;
            //描画するか？
            if(draw_dt.enable == false){ continue; }
            //Gradの範囲を選択
            grad = ctx.createLinearGradient(0,0,size_x,size_y);
            //モード毎に選択
            switch(grad_dt.mode)
            {
                case "mono":
                    grad = gradMono(grad_dt, ctx, size);
                    break;
                case "linear":
                    grad = gradLinear(grad_dt, ctx, size);
                    break;
                case "radial":
                    grad = gradRadial(grad_dt, ctx, size);
                    break;
            }
            switch(draw_dt.mode)
            {
                case "fill":
                    drawFill(ctx,grad,size_x, size_y);
                    break;
                case "polka_dots":
                    drawPolkaDots(draw_dt, ctx, grad, [size_x, size_y]);
                    break;
                case "striped":
                    drawStriped(draw_dt, ctx, grad, [size_x, size_y]);
                    break;
            }
        }    
    }
}


//グラデーション

function gradMono(data, ctx, size)
{
    grad = ctx.createLinearGradient(0,0,size[0],size[1]);
    grad.addColorStop(0,data.color[0]);
    return grad;
}

function gradLinear(data, ctx, size)
{
    //回転の計算
    const [dir_x, dir_y] = calc_dir(size[0],size[1],data.direction);
    const grad = ctx.createLinearGradient(size[0]/2-dir_x/2,size[1]/2-dir_y/2,size[0]/2+dir_x/2,size[1]/2+dir_y/2);
    switch(data.color.length)
    {
        case 0:
            grad.addColorStop(0,"#fff");
            return grad;
        case 1:
            grad.addColorStop(0,data.color[0]);
            return grad;
        default:
            for(let i = 0; i < data.color.length; i++)
            {
                grad.addColorStop(i/(data.color.length - 1),data.color[i]);
            }
            return grad;
    }
}

function gradRadial(data, ctx, size)
{
    const radius = calc_radius(data.center, size[0], size[1]);
    const x = (1 + data.center[0]) * size[0] / 2;
    const y = (1 - data.center[1]) * size[1] / 2;
    const grad = ctx.createRadialGradient(x, y,0,x,y,radius);
    switch(data.color.length)
    {
        case 0:
            grad.addColorStop(0,"#fff");
            return grad;
        case 1:
            grad.addColorStop(0,data.color[0]);
            return grad;
        default:
            for(let i = 0; i < data.color.length; i++)
            {
                grad.addColorStop(i/(data.color.length - 1),data.color[i]);
            }
            return grad;
    }
}



//描画

function drawFill(ctx, grad, x, y)
{
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,x,y);
}

function drawPolkaDots(data, ctx, grad, [x,y])
{
    //塗りつぶし方法
    ctx.fillStyle = grad;
    //セルのサイズ
    if(data.division_number[0] <= 0 || data.division_number[1] <= 0){ division_number = [1, 1];}
    const cell_size = [x / data.division_number[0], y / data.division_number[1]];
    //円のサイズ
    const radius = Math.min(cell_size[0], cell_size[1]) * data.radius / 2;
    //ズレ計算
    const offset = (data.offset_axis == "x") ? cell_size[1] * data.offset : cell_size[0] * data.offset;
    let offset_p;
    for(let i = 0; i <= data.division_number[0]; i++)
    {
        for(let j = 0; j <= data.division_number[1]; j++)
        {
            //円の塗りつぶし
            ctx.beginPath();
            if(data.offset_axis == "x")
            {
                ctx.arc(cell_size[0] * (i + 0.5), cell_size[1] * (j - 0.5 ) + (offset * i) % cell_size[1], radius, 0 , 2 * Math.PI, false);
            }
            else
            {
                ctx.arc(cell_size[0] * (i - 0.5) + (offset * j) % cell_size[0], cell_size[1] * (j + 0.5 ), radius, 0 , 2 * Math.PI, false);
            }
            ctx.fill();
        }
    }
}

function drawStriped(data, ctx, grad, [x,y])
{
    //塗りつぶし方法
    ctx.strokeStyle = grad;
    //定数の計算
    const center = [x/2, y/2];
    const line_length = calc_hypotenuse(x, y);
    const step_width = line_length/data.number_of_line;
    let now_x, now_y, now_p;
    //太さの計算
    ctx.lineWidth = step_width * data.ratio;
    for(let i = 0; i <= data.number_of_line; i++)
    {
        ctx.beginPath();
        now_x = -line_length / 2 + step_width * (i + 0.5);
        now_y = line_length / 2;
        now_p = calc_rot(now_x, -now_y, data.angle);
        ctx.moveTo(now_p[0]+center[0], now_p[1]+center[1]);
        now_p = calc_rot(now_x, now_y, data.angle);
        ctx.lineTo(now_p[0]+center[0], now_p[1]+center[1]);
        ctx.stroke();
    }
}



//計算

//長方形の中央から伸びた線と
//その線と垂直に交わる長方形の角から伸びた線との交点座標
function calc_dir(x,y,w)
{
    const angle = w * Math.PI / 180
    const cos_t = Math.cos(angle);
    const sin_t = Math.sin(angle);
    const sincos = sin_t * cos_t;
    const sin2t = sin_t * sin_t;
    const cos2t = cos_t * cos_t;

    const dir_x = (x * cos2t + Math.abs(y * sincos)) * Math.sign(cos_t);
    const dir_y = (y * sin2t + Math.abs(x * sincos)) * Math.sign(sin_t);
    return [dir_x, dir_y];
}

//長方形内の座標から最も遠い角までの距離
function calc_radius(center, x, y)
{
    //x,y : -1~1
    const len = [(Math.abs(center[0])+1)/2 * x, (Math.abs(center[1])+1)/2 * y];
    const radius = Math.sqrt(len[0] * len[0] + len[1] * len[1]);
    return radius;
}

//座標の回転
function calc_rot(x,y,w)
{
    const angle = w * Math.PI / 180
    const cos_t = Math.cos(angle);
    const sin_t = Math.sin(angle);
    const rot_x = x * cos_t - y * sin_t;
    const rot_y = y * cos_t + x * sin_t;
    return [rot_x, rot_y];
}

//斜辺
function calc_hypotenuse(x, y)
{
    return Math.sqrt(x * x + y * y);
}

//16進数変換
function convertToHex(n)
{
    const a = Math.floor(n/16);
    const b = n - 16 * a;
    let txt = "";
    for(const data of [a,b])
    {
        if(0 <= data && data <=9)
        {
            txt += data;
        }
        else
        {
            switch(data)
            {
                case 10:
                    txt += "a";
                    break;
                case 11:
                    txt += "b";
                    break;
                case 12:
                    txt += "c";
                    break;
                case 13:
                    txt += "d";
                    break;
                case 14:
                    txt += "e";
                    break;
                case 15:
                default:
                    txt += "f";
                    break;
            }
        }
    }
    return txt;
}

function convertColorToArray(code)
{
    let color;
    let alpha = 0;
    switch(code.length)
    {
        case 9:
            color = code.substr(0, 7);
            let i = 16;
            for(const data of [code.substr(7,1),code.substr(8,1)])
            {
                switch(data)
                {
                    case "0": alpha += 0 * i; break;
                    case "1": alpha += 1 * i; break;
                    case "2": alpha += 2 * i; break;
                    case "3": alpha += 3 * i; break;
                    case "4": alpha += 4 * i; break;
                    case "5": alpha += 5 * i; break;
                    case "6": alpha += 6 * i; break;
                    case "7": alpha += 7 * i; break;
                    case "8": alpha += 8 * i; break;
                    case "9": alpha += 9 * i; break;
                    case "a": alpha += 10 * i; break;
                    case "b": alpha += 11 * i; break;
                    case "c": alpha += 12 * i; break;
                    case "d": alpha += 13 * i; break;
                    case "e": alpha += 14 * i; break;
                    case "f": default: alpha += 15 * i; break;
                }
                i = 1;
            }
            break;
        case 7:
            color = code;
            alpha = 255;
            break;
        default:
            color = '#ffffff';
            alpha = 255;
            break;
    }
    return [color, alpha];
}


let number_of_option = 0;
let number_dic = {}

//HTMLの作成
function addTable()
{
    let now_num = number_of_option;
    const table_element = document.getElementById("setting");
    //番号のリンク
    const dic_length = Object.keys(number_dic).length;
    number_dic[now_num] = dic_length;
    //列の追加
    const tr_element = document.createElement("tr");
    tr_element.id = "tr_" + now_num;
    table_element.appendChild(tr_element);
    //列の中身の追加
    const td_display = document.createElement("td"); 
    const td_grad = document.createElement("td"); 
    const td_draw = document.createElement("td"); 
    const td_delete = document.createElement("td"); 
    tr_element.appendChild(td_display);
    tr_element.appendChild(td_grad);
    tr_element.appendChild(td_draw);
    tr_element.appendChild(td_delete);
    //データに追加
    picture_data.push(
        {
            "grad":
            {
                "mode":"mono",
                "color":["#00ffffff"]
            },
            "draw":
            {
                "mode":"fill",
                "enable":true
            }
        }
    )

    //enable
    const display_element = document.createElement("input");
    display_element.type = "checkbox";
    display_element.checked = true;
    display_element.onchange = (e) => {
        changeEnable(e.target.checked, now_num);
    }
    td_display.appendChild(display_element);

    //grad
    const grad_element = document.createElement("select");
    for(let i = 0; i < select_data.grad.length; i++)
    {
        let option_element = document.createElement("option");
        option_element.value = select_data.grad[i].id;
        option_element.innerHTML = select_data.grad[i].name;
        grad_element.appendChild(option_element);
    }
    grad_element.onchange = (e) =>{
        changeGrad(e.target.value, now_num);
    }
    td_grad.appendChild(grad_element);
    const div_grad = document.createElement("div");
    div_grad.id = "div_grad_" + now_num;
    td_grad.appendChild(div_grad);
    changeGrad(select_data.grad[0].id, now_num);

    //draw
    const draw_element = document.createElement("select");
    for(let i = 0; i < select_data.draw.length; i++)
    {
        let option_element = document.createElement("option");
        option_element.value = select_data.draw[i].id;
        option_element.innerHTML = select_data.draw[i].name;
        draw_element.appendChild(option_element);
    }
    draw_element.onchange = (e) =>{
        changeDraw(e.target.value, now_num);
    }
    td_draw.appendChild(draw_element);
    const div_draw = document.createElement("div");
    div_draw.id = "div_draw_" + now_num;
    td_draw.appendChild(div_draw);
    changeDraw(select_data.draw[0].id, now_num);

    //削除
    const delete_element = document.createElement("input");
    delete_element.type="button";
    delete_element.value = "削除";
    delete_element.onclick = () =>
    {
        changeDelete(now_num);
    }
    td_delete.appendChild(delete_element);
    //番号の変更
    number_of_option++;
}

function changeEnable(checked, num)
{
    const n = number_dic[num];
    picture_data[n].draw.enable = checked;
}

function changeGrad(value, num)
{
    const div_element = document.getElementById('div_grad_' + num);
    div_element.innerHTML = "";
    const n = number_dic[num];
    picture_data[n].grad.mode = value;
    let dummy_node, dummy_child;

    switch(value)
    {
        case "mono":
            if(picture_data[n].grad.color.length == 0)
            {
                picture_data[n].grad.color = ['#00ffff'];
            }
            const color_data = convertColorToArray(picture_data[n].grad.color[0]);
            div_element.append(document.createTextNode("色 "));
            //input color
            dummy_node = document.createElement("input");
            dummy_node.type = "color";
            dummy_node.value = color_data[0];
            dummy_node.onchange = (e) =>
            {
                changeColor(e.target.value, num);
            }
            div_element.appendChild(dummy_node);
            //input range
            div_element.append(document.createTextNode(" 透明度 "));
            dummy_node = document.createElement("input");
            dummy_node.type = "range";
            dummy_node.min = 0;
            dummy_node.max = 255;
            dummy_node.value = color_data[1];
            dummy_node.onchange = (e) =>
            {
                changeAlpha(e.target.value, num);
            }
            div_element.appendChild(dummy_node);
            break;
        case "linear":
        case "radial":
            switch(value)
            {
                case "linear":
                    //方向 direction
                    div_element.append(document.createTextNode("角度"));
                    dummy_node = document.createElement("input");
                    dummy_node.type = "range";
                    if(picture_data[n].grad.direction == undefined)
                    {
                        picture_data[n].grad.direction = 90;
                    }
                    dummy_node.min = 0;
                    dummy_node.max = 360;
                    dummy_node.value = picture_data[n].grad.direction;
                    dummy_node.onchange = (e) =>
                    {
                        const n = number_dic[num];
                        picture_data[n].grad.direction = e.target.value;
                    }
                    div_element.appendChild(dummy_node);
                    break;
                case "radial":
                    div_element.append(document.createTextNode("X "));
                    dummy_node = document.createElement("input");
                    dummy_node.type = "range";
                    if(picture_data[n].grad.direction == undefined)
                    {
                        picture_data[n].grad.center = [0,0];
                    }
                    dummy_node.min = -100;
                    dummy_node.max = 100;
                    dummy_node.value = picture_data[n].grad.direction;
                    dummy_node.onchange = (e) =>
                    {
                        const n = number_dic[num];
                        picture_data[n].grad.center[0] = e.target.value / 100;
                    }
                    div_element.appendChild(dummy_node);
                    div_element.append(document.createTextNode("Y "));
                    dummy_node = document.createElement("input");
                    dummy_node.type = "range";
                    if(picture_data[n].grad.direction == undefined)
                    {
                        picture_data[n].grad.center = [0,0];
                    }
                    dummy_node.min = -100;
                    dummy_node.max = 100;
                    dummy_node.value = picture_data[n].grad.direction;
                    dummy_node.onchange = (e) =>
                    {
                        const n = number_dic[num];
                        picture_data[n].grad.center[1] = e.target.value / 100;
                    }
                    div_element.appendChild(dummy_node);
                    break;
            }
            
            //table
            dummy_node = document.createElement("table");
            div_element.appendChild(dummy_node);
            const thead_node = document.createElement("thead");
            dummy_node.appendChild(thead_node);
            const tbody_node = document.createElement("tbody");
            tbody_node.id = "grad_tbody_"+ num;
            dummy_node.appendChild(tbody_node);
            //header
            let tr_node = document.createElement("tr");
            thead_node.appendChild(tr_node);
            dummy_child = document.createElement("th");
            dummy_child.innerHTML = "色";
            thead_node.appendChild(dummy_child);
            dummy_child = document.createElement("th");
            dummy_child.innerHTML = "透明度";
            thead_node.appendChild(dummy_child);
            dummy_child = document.createElement("input");
            dummy_child.type = "button";
            dummy_child.value = "追加";
            dummy_child.onclick = () =>
            {
                addGradColor(num, true);
            }
            addGradColor(num, false);
            thead_node.appendChild(dummy_child);
            break;
    }
}

function changeDraw(value, num)
{
    const div_element = document.getElementById('div_draw_' + num);
    div_element.innerHTML = "";
    const n = number_dic[num];
    picture_data[n].draw.mode = value;
    let dummy_node;
    let dummy_child;
    switch(value)
    {
        case "fill":
            break;
        case "polka_dots":
            if(picture_data[n].draw.radius == undefined){picture_data[n].draw.radius = 0.8;}
            if(picture_data[n].draw.division_number == undefined){picture_data[n].draw.division_number = [14,8];}
            if(picture_data[n].draw.offset == undefined){picture_data[n].draw.offset = 0.5;}
            if(picture_data[n].draw.offset_axis == undefined){picture_data[n].draw.offset_axis = "x";}
            //radius
            div_element.append(document.createTextNode("半径"));
            dummy_node = document.createElement("input");
            dummy_node.type = "range";
            dummy_node.min = 0;
            dummy_node.max = 150;
            dummy_node.value = picture_data[n].draw.radius * 100;
            dummy_node.onchange = (e) =>
            {
                changeRadius(e.target.value / 100, num);
            }
            div_element.appendChild(dummy_node);
            //offset
            div_element.appendChild(document.createElement("br"));
            div_element.append(document.createTextNode("ズレ"));
            dummy_node = document.createElement("input");
            dummy_node.type = "range";
            dummy_node.min = 0;
            dummy_node.max = 100;
            dummy_node.value = picture_data[n].draw.offset * 100;
            dummy_node.onchange = (e) =>
            {
                changeOffset(e.target.value / 100, num);
            }
            div_element.appendChild(dummy_node);
            //offset axis
            div_element.appendChild(document.createElement("br"));
            div_element.append(document.createTextNode("ズレ方向"));
            dummy_node = document.createElement("select");
            dummy_child = document.createElement("option");
            dummy_child.value = "x";
            dummy_child.innerHTML = "x";
            dummy_node.appendChild(dummy_child);
            dummy_child = document.createElement("option");
            dummy_child.value = "y";
            dummy_child.innerHTML = "y";
            if(picture_data[n].draw.offset_axis =='y')
            {dummy_child.selected = true;}
            dummy_node.appendChild(dummy_child);
            dummy_node.onchange = (e) =>
            {
                changeAxis(e.target.value, num);
            }
            div_element.appendChild(dummy_node);
            //division number
            div_element.appendChild(document.createElement("br"));
            div_element.append(document.createTextNode("分割数 "));
            div_element.appendChild(document.createElement("br"));
            div_element.append(document.createTextNode("X "));
            dummy_node = document.createElement("input");
            dummy_node.type = "number";
            dummy_node.min = 1;
            dummy_node.max = 255;
            dummy_node.value = picture_data[n].draw.division_number[0];
            dummy_node.onchange = (e) =>
            {
                changeDivision(e.target.value, num, "x");
            }
            div_element.appendChild(dummy_node);
            div_element.appendChild(document.createElement("br"));
            div_element.append(document.createTextNode("Y "));
            dummy_node = document.createElement("input");
            dummy_node.type = "number";
            dummy_node.min = 0;
            dummy_node.max = 255;
            dummy_node.value = picture_data[n].draw.division_number[1];
            dummy_node.onchange = (e) =>
            {
                changeDivision(e.target.value, num, "y");
            }
            div_element.appendChild(dummy_node);
            break;
        case "striped":
            if(picture_data[n].draw.number_of_line == undefined){picture_data[n].draw.number_of_line = 40;}
            if(picture_data[n].draw.angle == undefined){picture_data[n].draw.angle = 90;}
            if(picture_data[n].draw.ratio == undefined){picture_data[n].draw.ratio = 0.5}
            //本数
            div_element.append(document.createTextNode("本数 "));
            dummy_node = document.createElement("input");
            dummy_node.type = "number";
            dummy_node.min = 1;
            dummy_node.max = 255;
            dummy_node.value = picture_data[n].draw.number_of_line;
            dummy_node.onchange = (e) =>
            {
                changeNumberOfLine(e.target.value, num);
            }
            div_element.appendChild(dummy_node);
            //角度
            div_element.appendChild(document.createElement("br"));
            div_element.append(document.createTextNode("角度 "));
            dummy_node = document.createElement("input");
            dummy_node.type = "range";
            dummy_node.min = 0;
            dummy_node.max = 180;
            dummy_node.value = picture_data[n].angle;
            dummy_node.onchange = (e) =>
            {
                changeAngle(e.target.value, num);
            }
            div_element.appendChild(dummy_node);
            //割合
            div_element.appendChild(document.createElement("br"));
            div_element.append(document.createTextNode("密度 "));
            dummy_node = document.createElement("input");
            dummy_node.type = "range";
            dummy_node.min = 0;
            dummy_node.max = 100;
            dummy_node.value = picture_data[n].draw.ratio * 100;
            dummy_node.onchange = (e) =>
            {
                changeRatio(e.target.value / 100, num);
            }
            div_element.appendChild(dummy_node);
            break;
    }
}

//■削除
function changeDelete(num)
{
    const element = document.getElementById("tr_" + num);
    element.remove();
    const n = number_dic[num];
    picture_data.splice(n, 1);
    delete number_dic[num];
    const pair = Object.entries(number_dic);
    let i = 0;
    for(const [key, value] of pair)
    {
        number_dic[key] = i;
        i++
    }
}


//■描画
function changeColor(value, num)
{
    const n = number_dic[num]
    picture_data[n].grad.color[0] = value 
    + picture_data[n].grad.color[0][7]
    + picture_data[n].grad.color[0][8];
}

function changeAlpha(value, num)
{
    const n = number_dic[num]
    picture_data[n].grad.color[0] 
    = picture_data[n].grad.color[0].substr(0,7)
    + convertToHex(value);
}

function changeRadius(value, num)
{
    const n = number_dic[num]
    picture_data[n].draw.radius = value;
}

function changeOffset(value, num)
{
    const n = number_dic[num]
    picture_data[n].draw.offset = value;
}

function changeAxis(value, num)
{
    const n = number_dic[num]
    picture_data[n].draw.offset_axis = value;
}

function changeDivision(value, num, axis)
{
    const n = number_dic[num]
    if(value <= 0){ value = 1;}
    if(value >= 256){ value = 255;}
    if(axis == "x")
    {
        picture_data[n].draw.division_number[0] = value;
    }
    else
    {
        picture_data[n].draw.division_number[1] = value;
    }
}

function changeNumberOfLine(value, num)
{
    const n = number_dic[num]
    picture_data[n].draw.number_of_line = value;
}

function changeAngle(value, num)
{
    const n = number_dic[num]
    picture_data[n].draw.angle = value;
}

function changeRatio(value, num)
{
    const n = number_dic[num]
    picture_data[n].draw.ratio = value;
}

//■grad
function addGradColor(num, add)
{
    const n = number_dic[num];
    if(add == true){picture_data[n].grad.color.push("#00ffffff");}
    const number_of_color = picture_data[n].grad.color.length;
    
    const tbody_node = document.getElementById("grad_tbody_" + num);
    const tbody_length = tbody_node.children.length;

    for(let i = tbody_length; i<number_of_color; i++)
    {
        //枠の追加
        const tr_node = document.createElement("tr");
        const td_color = document.createElement("td");
        const td_alpha = document.createElement("td");
        const td_delete = document.createElement("td");
        let dummy_node = document.createElement("input");
        tr_node.appendChild(dummy_node);
        tr_node.appendChild(td_color);
        tr_node.appendChild(td_alpha);
        tr_node.appendChild(td_delete);
        tbody_node.appendChild(tr_node);
        //変数番号
        dummy_node.type = "number";
        dummy_node.value = i;
        dummy_node.hidden = true;
        //色
        const color_data = convertColorToArray(picture_data[n].grad.color[i]);
        dummy_node = document.createElement("input");
        dummy_node.type = "color";
        dummy_node.value = color_data[0];
        dummy_node.onchange = (e) =>
        {
            const this_tr = e.target.parentNode.parentNode;
            const color = e.target.value;
            const alpha = convertToHex(this_tr.children[2].firstChild.value);
            const n = this_tr.firstChild.value;
            picture_data[num].grad.color[n] = color + alpha;
        }
        td_color.appendChild(dummy_node);
        //透明度
        dummy_node = document.createElement("input");
        dummy_node.type = "range";
        dummy_node.min = 0;
        dummy_node.max = 255;
        dummy_node.value = color_data[1];
        dummy_node.onchange = (e) =>
        {
            const this_tr = e.target.parentNode.parentNode;
            const color = this_tr.children[1].firstChild.value;
            const alpha = convertToHex(e.target.value);
            const n = this_tr.firstChild.value;
            picture_data[num].grad.color[n] = color + alpha;
        }
        td_alpha.appendChild(dummy_node);
        //削除
        dummy_node = document.createElement("input");
        dummy_node.type = "button";
        dummy_node.value = "削除";
        dummy_node.onclick = (e) =>
        {
            const this_tr = e.target.parentNode.parentNode;
            const tr_num = this_tr.firstChild.value;
            const color_node_arr = this_tr.parentNode.children;
            const n = number_dic[num];
            //色要素の削除
            picture_data[n].grad.color.splice(tr_num,1);
            //列の削除
            this_tr.remove();
            for(let j = 0; j < color_node_arr.length; j++)
            {
                color_node_arr[j].firstChild.value = j;
            }
        }
        td_delete.appendChild(dummy_node);
    }
    //
    //grad_tbody_
    //grad_tr_
}

//
function save()
{
    const canvas = document.getElementById('canvas');
    const txt = "simple_image";
    var a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = txt + '.png';
    a.click();
}

let picture_data =[]
//データ

const select_data = 
{
    "grad":
    [
        {"id":"mono", "name":"単色"},
        {"id":"linear", "name":"グラデーション"},
        {"id":"radial", "name":"円形グラデーション"}
    ],
    "draw":
    [
        {"id":"fill", "name":"塗り潰し"},
        {"id":"polka_dots", "name":"水玉模様"},
        {"id":"striped", "name":"ストライプ"}
    ]
}

/*
    tr_
    div_grad_
    div_draw_
*/

/*
https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D
*/