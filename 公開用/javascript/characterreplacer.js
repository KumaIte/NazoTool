window.addEventListener('load',()=>
{
    setSelectList();
})



function makeSelectTxt(table_num)
{
    let dummy_txt = '<div class="desplay_block"><input type="checkbox" onclick="addCheck('
    + table_num + ')"';
    if(select_txt[table_num].check==true){ dummy_txt += ' checked';}
    dummy_txt += '><input type="text" id="input'
     + table_num + '" + value="' +select_txt[table_num].input + '" onchange="loadInput()"> → <input type="text" id="output'
     + table_num + '" + value="' +select_txt[table_num].output + '" onchange="loadInput()"> <input type="button" value="削除" onclick="removeList('
     + table_num + ')"></div>';

    return dummy_txt;
}

function setSelectList()
{
    const element = document.getElementById('select_table');
    let dummy_txt = "";
    for(let i = 0; i < select_txt.length; i++)
    {
        dummy_txt += makeSelectTxt(i);
    }
    element.innerHTML = dummy_txt;
}

function addCheck(table_num)
{
    if(select_txt[table_num].check == true)
    {select_txt[table_num].check = false}
    else{select_txt[table_num].check = true}
    setSelectList();
}
function removeList(table_num)
{
    select_txt.splice(table_num,1);
    setSelectList();
}

function addList()
{
    select_txt.push({});
    select_txt[select_txt.length-1].check = true;
    select_txt[select_txt.length-1].input = "";
    select_txt[select_txt.length-1].output = "";
    setSelectList();
}

function replaceTxt()
{
    const before_element = document.getElementById('before');
    const after_element = document.getElementById('after');
    let input_element;
    let output_element;
    for(let i = 0; i < select_txt.length; i++)
    {
        input_element = document.getElementById('input' + i).value;
        output_element = document.getElementById('output' + i).value;

        select_txt[i].input = input_element;
        select_txt[i].output = output_element;
    }
    let dummy_txt = before_element.value;
    for(let i = 0; i < select_txt.length; i++)
    {
        if(select_txt[i].check == true)
        {
            switch(select_txt[i].input)
            {
                case "":
                    break;
                default:
                    dummy_txt = dummy_txt.split(inputTxtFetch(select_txt[i].input));
                    dummy_txt = dummy_txt.join(inputTxtFetch(select_txt[i].output));
                    break;
            }
        }
    }

    after_element.innerHTML = dummy_txt;
}

function inputTxtFetch(input_txt)
{
    input_txt = input_txt.split("\\n");
    input_txt = input_txt.join("\n");
    input_txt = input_txt.split("\\t");
    input_txt = input_txt.join("\t");

    return input_txt;
}

function loadInput()
{
    let input_element;
    let output_element;
    for(let i = 0; i < select_txt.length; i++)
    {
        input_element = document.getElementById('input' + i).value;
        output_element = document.getElementById('output' + i).value;

        select_txt[i].input = input_element;
        select_txt[i].output = output_element;
    }
}

function setOption(option_num)
{
    switch(option_num)
    {
        case 0:
            for(let i = 0; i < select_txt.length; i++)
            {
                select_txt[i].check = true;
            }
            loadInput();
            break;
        case 1:
            for(let i = 0; i < select_txt.length; i++)
            {
                select_txt[i].check = false;
            }
            loadInput();
            break;
        case 2:
            select_txt = [];
            for(let i = 0; i < 4; i++)
            {
                select_txt.push({});
                select_txt[i].check = true;
                select_txt[i].input = "";
                select_txt[i].output = "";
            }
            break;
        case 3:
            select_txt = [];
            for(let i = 0; i < 4; i++)
            {
                select_txt.push({});
                select_txt[i].check = true;
                select_txt[i].input = "";
                select_txt[i].output = "";
            }
            select_txt[0].input = " ";
            select_txt[1].input = "　";
            select_txt[2].input = "\\t";
            select_txt[3].input = "\\n";
            break;
    }
    setSelectList();
}

let select_txt = 
[
    {
        "input":"入力\\n",
        "output":"出力。",
        "check":true
    },
    {
        "input":"。",
        "output":"！",
        "check":true
    }
]