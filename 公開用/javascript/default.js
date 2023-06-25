window.addEventListener('load', () => 
{
    let elemtnt = document.getElementById("menu");
    let menu_txt = '<nav class="menu"><ul class="menu">';
    for(let i = 0; i < menu_data.length; i++)
    {
        menu_txt += '<li class="menu"><a href="'
         + menu_data[i].link
         + '" class="menu">'
         + menu_data[i].display
         + '</a></li>';
    }
    menu_txt += '</ul></nav>';
    elemtnt.innerHTML = menu_txt;
})

const menu_data =
[
    {
        "display":"ホーム",
        "link":"./home.html"
    },
    {
        "display":"SNS",
        "link":"./sns.html"
    },
    {
        "display":"ログ",
        "link":"./log.html"
    }
]