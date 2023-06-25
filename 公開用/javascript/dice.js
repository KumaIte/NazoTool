window.addEventListener('load',()=>
{
    let element = document.getElementById("dice_select");
    let dummy_txt = makeTable();
    element.innerHTML = dummy_txt;
})

function makeTable()
{
    let dummy_txt = '';
    for(let i = 0; i < table_data.length; i++)
    {
        dummy_txt += '<div class="description" id="table'+i+'">';
        dummy_txt += makeDiceSelectTable(i);
        dummy_txt += '</div>';
    }
    return dummy_txt;
}

function makeDiceSelectTable(table_number)
{
    //ダイスのテーブル作成
    let dummy_txt = '<table border="1" width="100%"><tr><td width="50%"><table class="dice_select">';
    dummy_txt += '<tr><th></th><th>ダイスの数</th><th></th><th>最大の目</th><th></th></tr>';
    for(let i = 0; i < table_data[table_number].dice_data.length; i++)
    {
        dummy_txt += '<tr><td><input type="checkbox" + onclick="checkEnable('
        + table_number + ',' + i + ')"';
        if(table_data[table_number].dice_data[i].check==true){dummy_txt += ' checked'}
        dummy_txt +='></td><td>'+table_data[table_number].dice_data[i].roll
        + '</td><td>D</td><td>' + table_data[table_number].dice_data[i].dice
        + '</td><td><input type="button" value="削除" onclick="removeDicelist('
        + table_number + ',' + i + ')"></td></tr>';
    }
    //入力部分の作成
    dummy_txt += '<tr height="20px"></tr><tr><th></th><th><input type="number" class="number" value=1 id="input_roll'
    + table_number + '"></th><th>D</th><th><input type="number" class="number" value=6 id="input_dice'
    + table_number +'"></th><th><input type="button" value="追加" onclick="addDiceList('
    + table_number +')"></th></tr>';
    dummy_txt += '</table></td>';
    //ログ部分の設定
    dummy_txt += '<td class="log"><h3>ログ<h3><div style="width: 100%; height: 150px; overflow-y: scroll; border: 1px #999999 solid; font-size:10px;" id="log'
    + table_number +'">';
    for(let i = 0; i < table_data[table_number].log.length; i++)
    {
        dummy_txt += '<div class="log_txt" title="' + table_data[table_number].log[i].title + '">' + table_data[table_number].log[i].time + ' - ' + table_data[table_number].log[i].value + '(' + table_data[table_number].log[i].dice + ')</div><br>';
    }
    //ダイスロールのボタン設定
    dummy_txt += '</div></td></tr><tr><td><p><input type="button" value="ダイスを全て選択" onclick="diceSelectOption('
    + table_number + ',0)"><input type="button" value="全選択解除" onclick="diceSelectOption('
    + table_number + ',1)">複数選択<input type="checkbox" onclick="diceSelectOption('
    + table_number + ',2)"';
    if(table_data[table_number].multiple_selection == true)
    { dummy_txt += ' checked'; }
    dummy_txt += '></p><input type="button" value="ダイスロール" class="roll_button" onclick="diceRoll('
    + table_number+')"><div id="result'
    + table_number+'">';
    if(table_data[table_number].log.length!=0)
    {
        dummy_txt += '<h2 title="' + table_data[table_number].log[table_data[table_number].log.length-1].title + '">'
        + table_data[table_number].result + '</h2>';
    }
    //削除ボタンの設定
    dummy_txt += '</div></td><td><input type="button" value="ログの削除" onclick="removeLog('
    + table_number +')"><input type="button" value="テーブルの削除" onclick="removeTable('
    + table_number +')"></td></tr>';
    dummy_txt += '</table>';
    return dummy_txt;
}

function removeDicelist(table_number, list_number)
{
    table_data[table_number].dice_data.splice(list_number,1);
    let element = document.getElementById("table"+table_number);
    element.innerHTML = makeDiceSelectTable(table_number);
}

function addDiceList(table_number)
{
    table_data[table_number].dice_data.push({});
    if(table_data[table_number].multiple_selection == true){
        table_data[table_number].dice_data[table_data[table_number].dice_data.length-1].check = true;
    }
    else{
        table_data[table_number].dice_data[table_data[table_number].dice_data.length-1].check = false;
    }
    table_data[table_number].dice_data[table_data[table_number].dice_data.length-1].roll = Math.max(Math.min(Math.floor(document.getElementById("input_roll"+table_number).value),100), 0);
    table_data[table_number].dice_data[table_data[table_number].dice_data.length-1].dice = Math.max(Math.floor(document.getElementById("input_dice"+table_number).value),0);
    let element = document.getElementById("table"+table_number);
    element.innerHTML = makeDiceSelectTable(table_number);
}

function diceRoll(table_number)
{
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    let num = 0;
    let calc = 0;
    let time_data = new Date();
    let time = time_data.getHours() + ':' + time_data.getMinutes() + ':' + time_data.getSeconds() + '(' + ((time_data.getMonth()) % 12 + 1) + '/' + time_data.getDate() + ')';
    let dice = "";
    let result = "";
    for(let i = 0; i < table_data[table_number].dice_data.length; i++)
    {
        if(table_data[table_number].dice_data[i].check == true)
        {
            calc = 0;
            if(dice==""){dice += table_data[table_number].dice_data[i].roll + "d" + table_data[table_number].dice_data[i].dice;}
            else{dice += "+" + table_data[table_number].dice_data[i].roll + "d" + table_data[table_number].dice_data[i].dice;}
            
            for(let j = 0; j < Math.abs(table_data[table_number].dice_data[i].roll); j++)
            {
                calc = Math.floor(Math.random() * table_data[table_number].dice_data[i].dice) + 1;
                num += calc;
                result += ' ' + calc + '(' + 'd' + table_data[table_number].dice_data[i].dice + ')'
            }
        }
    }
    result = '【 ' + num + ' 】' + result;
    table_data[table_number].log.push({});
    table_data[table_number].log[table_data[table_number].log.length-1].time = time;
    table_data[table_number].log[table_data[table_number].log.length-1].dice = dice;
    table_data[table_number].log[table_data[table_number].log.length-1].value = num;
    table_data[table_number].log[table_data[table_number].log.length-1].title = result;
    table_data[table_number].result = num;
    let element = document.getElementById("table"+table_number);
    element.innerHTML = makeDiceSelectTable(table_number);

    element = document.getElementById("result"+table_number);
    element.innerHTML = '<h2 title="' + result +'">'+ num +'</h2>';
}

function removeLog(table_number)
{
    table_data[table_number].log = [];
    let element = document.getElementById("table"+table_number);
    element.innerHTML = makeDiceSelectTable(table_number);
}
function removeTable(table_number)
{
    table_data.splice(table_number,1);
    let element = document.getElementById("dice_select");
    let dummy_txt = makeTable();
    element.innerHTML = dummy_txt;
}

function addTable()
{
    table_data.push({});
    table_data[table_data.length-1].dice_data = [];
    table_data[table_data.length-1].offset = 0;
    table_data[table_data.length-1].log = [];
    let element = document.getElementById("dice_select");
    let dummy_txt = makeTable();
    element.innerHTML = dummy_txt;
}

function checkEnable(table_number, list_number)
{
    if(table_data[table_number].multiple_selection == false)
    {
        for(let i = 0; i < table_data[table_number].dice_data.length; i++)
        {
            table_data[table_number].dice_data[i].check = false;
        }
    }
    if(table_data[table_number].dice_data[list_number].check == true)
    {
        table_data[table_number].dice_data[list_number].check = false;
    }
    else
    {
        table_data[table_number].dice_data[list_number].check = true;
    }
    let element = document.getElementById("table"+table_number);
    element.innerHTML = makeDiceSelectTable(table_number);
}

function diceSelectOption(table_number, type)
{
    switch(type)
    {
        case 0:
            for(let i = 0; i < table_data[table_number].dice_data.length; i++)
            {
                table_data[table_number].dice_data[i].check = true;
            }
            break;
        case 1:
            for(let i = 0; i < table_data[table_number].dice_data.length; i++)
            {
                table_data[table_number].dice_data[i].check = false;
            }
            break;
        case 2:
            if(table_data[table_number].multiple_selection == true)
            { table_data[table_number].multiple_selection = false; }
            else
            { table_data[table_number].multiple_selection = true;}
            break;
    }
    let element = document.getElementById("table"+table_number);
    element.innerHTML = makeDiceSelectTable(table_number);
}

let table_data =
[
    {
        "dice_data":
        [
            {"roll":1, "dice":100,"check":true},
            {"roll":1, "dice":2,"check":false},
            {"roll":1, "dice":3,"check":false},
            {"roll":1, "dice":6,"check":false},
            {"roll":2, "dice":6,"check":false},
            {"roll":3, "dice":6,"check":false}
        ],
        "offset":0,
        "log":[],
        "multiple_selection":false,
        "result":0
    }
]

const audio = new Audio("../sounds/diceroll.wav");