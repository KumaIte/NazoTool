window.addEventListener('load',()=>
{
    let elemtnt = document.getElementById('log');
    let dummy_txt = "<table class='log'>";
    for(let i = 0; i < log_list.length; i++)
    {
        dummy_txt += '<tr><td class="log_day">' + log_list[i].day
        + '</td><td class="log_content" title="'+ log_list[i].detail
        + '">' + log_list[i].content + '</td></tr>';
    }
    dummy_txt += '</table>';
    elemtnt.innerHTML = dummy_txt;
})

const log_list =
[
    {
        "day":"2023/04/29",
        "content":"「ダサ文字画像生成器」の追加",
        "detail":"「ダサ文字画像生成器」のページの作成と追加"
    },
    {
        "day":"2023/04/28",
        "content":"「文字置換」の追加",
        "detail":"「文字置換」のページの作成と追加"
    },
    {
        "day":"2023/04/27",
        "content":"「ダイスロール」の追加",
        "detail":"「ダイスロール」のページの作成と追加"
    },
    {
        "day":"2023/04/26",
        "content":"サイト全体の基盤の作成",
        "detail":"「ホーム」、「SNS」、「ログ」のページの作成と、サイト全体の見た目の調整"
    },
    {
        "day":"2023/04/25",
        "content":"「名前生成器」の作成",
        "detail":"「名前生成器」のページ部分のみ作成"
    },
    {
        "day":"2023/??/??",
        "content":"なんやかんや",
        "detail":"色々と更新しましたが、ログを残し忘れましたm(_ _;)m"
    },
    {
        "day":"2023/06/25",
        "content":"サイトの公開",
        "detail":"githubにてサイトの公開"
    }
]