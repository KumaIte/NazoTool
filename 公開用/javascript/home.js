window.addEventListener('load',()=>
{
    let elemtnt = document.getElementById('tool_data');
    let dummy_txt = "";
    let tool_data_parse = [];
    let dummy_flag = false;
    //ラベル毎にツールパースに格納
    for(let i = 0; i < tag_dic.length; i++)
    {
        dummy_flag = false;
        for(let j = 0; j < tool_data.length; j++)
        {
            //選択されたツールが指定のタグを持っていたとき
            if(tool_data[j].tag.includes(tag_dic[i].tag))
            {
                if(dummy_flag == false)
                {
                    tool_data_parse.push({});
                    tool_data_parse[tool_data_parse.length-1].tag = tag_dic[i];
                    tool_data_parse[tool_data_parse.length-1].tool = [tool_data[j]];
                    dummy_flag = true;
                }
                else
                {
                    tool_data_parse[tool_data_parse.length-1].tool.push(tool_data[j]);
                }
            }
        }
    }
    //格納されたものをテキストに変換
    for(let i = 0; i < tool_data_parse.length; i++)
    {
        dummy_txt += '<h2>' + tool_data_parse[i].tag.display + '</h2>';
        dummy_txt += '<div class="tool_list"><ul class="tool_list">';
        for(let j = 0; j < tool_data_parse[i].tool.length; j++)
        {
            dummy_txt += '<li class="tool_list"><a href="'
            + tool_data_parse[i].tool[j].link + '">'
            + tool_data_parse[i].tool[j].display + '</a></li>';
        }
        dummy_txt += '</ul></div>';
    }
    elemtnt.innerHTML = dummy_txt; 
})

const tool_data =
[
    {
        "display":"名前生成器",
        "link":"./namegenerator.html",
        "tag":["all","random"]
    },
    {
        "display":"ダイスロール",
        "link":"./dice.html",
        "tag":["all","trpg"]
    },
    {
        "display":"文字置換",
        "link":"./text_replacer.html",
        "tag":["all"]
    },
    {
        "display":"ダサ文字画像生成器",
        "link":"./dasamoji.html",
        "tag":["all","image"]
    },
    {
        "display":"キャラクターシート生成",
        "link":"./character_sheet_generator.html",
        "tag":["all","trpg","random"]
    },
    {
        "display":"シンプル画像生成",
        "link":"./simple_picture_generator.html",
        "tag":["all","image"]
    },
    {
        "display":"蒼頡輸入法タイピング",
        "link":"./souketsu.html",
        "tag":["all","game"]
    }
]

const tag_dic =
[
    {
        "display":"TRPG用",
        "tag":"trpg"
    },
    {
        "display":"ランダム生成",
        "tag":"random"
    },
    {
        "display":"画像生成",
        "tag":"image"
    },
    {
        "display":"ミニゲーム",
        "tag":"game"
    },
    {
        "display":"全ツール一覧",
        "tag":"all"
    },
    {
        "display":"その他",
        "tag":"other"
    }
]