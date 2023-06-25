window.addEventListener('load',()=>
{
    //setSelectList();
    addInputArea(2,"","");
    setSelectArea();
    setSampleArea();
})

window.addEventListener("change",()=>
{
    replaceText();
})

function addInputArea(n, before, after)
{
    const area_node = document.getElementById("input_area");
    let div_node, check_node, input_node, text_node, output_node, delete_node;
    for(let i = 0; i < n; i++)
    {
        div_node = document.createElement("div");
        num_node = document.createElement("input");
        check_node = document.createElement("input");
        input_node = document.createElement("input");
        output_node = document.createElement("input");
        text_node = document.createTextNode(" → ");
        delete_node = document.createElement("input");

        num_node.type = "number";
        check_node.type = "checkbox";
        input_node.type = "textbox";
        output_node.type = "textbox";
        delete_node.type = "button";

        num_node.value = select_txt.length;
        num_node.hidden = true;
        check_node.checked = true;
        input_node.value = before;
        output_node.value = after;
        delete_node.value = "削除";

        div_node.appendChild(num_node);
        div_node.appendChild(check_node);
        div_node.append(document.createTextNode(" "));
        div_node.appendChild(input_node);
        div_node.append(text_node);
        div_node.appendChild(output_node);
        div_node.append(document.createTextNode(" "));
        div_node.appendChild(delete_node);
        area_node.appendChild(div_node);

        check_node.onclick = (e) =>
        {
            const parent_node = e.target.parentNode;
            const n = parent_node.children[0].value;
            select_txt[n].check = e.target.checked;
            replaceText();
        }
        input_node.onchange = (e) =>
        {
            const parent_node = e.target.parentNode;
            const n = parent_node.children[0].value;
            select_txt[n].input = e.target.value;
            replaceText();
        }
        output_node.onchange = (e) =>
        {
            const parent_node = e.target.parentNode;
            const n = parent_node.children[0].value;
            select_txt[n].output = e.target.value;
            replaceText();
        }
        delete_node.onclick = (e) =>
        {
            const parent_node = e.target.parentNode;
            const area_node = parent_node.parentNode;
            const n = parent_node.children[0].value;
            select_txt.splice(n,1);
            parent_node.remove();

            const all_div = area_node.children;
            for(let i = 0; i < all_div.length; i++)
            {
                all_div[i].children[0].value = i;
            }
            replaceText();
        }

        select_txt.push({"check":true,"input":before,"output":after});
    }
}


let select_txt = []
function replaceText()
{
    const before_node = document.getElementById("before");
    const after_node = document.getElementById("after");
    let txt = before_node.value;
    let input, output;
    for(let i = 0; i < select_txt.length; i++)
    {
        if(select_txt[i].check == false){ continue; }
        input = select_txt[i].input;
        output = select_txt[i].output;

        if(input == ""){ continue; }
        input = input.split("\\\\");
        input = input.join("\b");
        input = input.split("\\n");
        input = input.join("\n");
        input = input.split("\\t");
        input = input.join("\t");
        input = input.split("\b");
        input = input.join("\\");

        output = output.split("\\\\");
        output = output.join("\b");
        output = output.split("\\n");
        output = output.join("\n");
        output = output.split("\\t");
        output = output.join("\t");
        output = output.split("\b");
        output = output.join("\\");

        txt = txt.split(input);
        txt = txt.join(output);
    }
    after_node.value = txt;
}


const select_button = ["全選択", "選択解除", "初期化"];
function setSelectArea()
{
    const select_node = document.getElementById("select_area");
    let dummy_node;

    for(let i = 0; i < select_button.length; i++)
    {
        dummy_node = document.createElement("input");
        dummy_node.value = select_button[i];
        dummy_node.type = "button";
        dummy_node.onclick = (e) =>
        {
            selectData(select_button[i]);
        }
        select_node.appendChild(dummy_node);
    }
}

function selectData(option)
{
    const input_area = document.getElementById("input_area");
    const div_node = input_area.children;
    switch(option)
    {
        case "全選択":
            for(let i = 0; i < select_txt.length; i++)
            {
                select_txt[i].check = true;
                div_node[i].children[1].checked = true;
            }
            break;
        case "選択解除":
            for(let i = 0; i < select_txt.length; i++)
            {
                select_txt[i].check = false;
                div_node[i].children[1].checked = false;
            }
            break;
        case "初期化":
            input_area.innerHTML = null;
            select_txt = [];
            addInputArea(2,"","");
            break;
    }
    replaceText();
}



function setSampleArea()
{
    const select_node = document.getElementById("sample_area");
    let dummy_node;

    for(let i = 0; i < sample_data.length; i++)
    {
        dummy_node = document.createElement("input");
        dummy_node.value = sample_data[i].title;
        dummy_node.type = "button";
        dummy_node.onclick = (e) =>
        {
            addSample(sample_data[i].title);
        }
        select_node.appendChild(dummy_node);
    }
}
function addSample(title)
{
    for(let i = 0; i < sample_data.length; i++)
    {
        if(title == sample_data[i].title)
        {
            for(let j = 0; j < sample_data[i].before.length; j++)
            {
                addInputArea(1,sample_data[i].before[j],sample_data[i].after[j]);
            }
        }
    }
}
const sample_data=
[
    {
        "title":"空白削除",
        "before":[" ","　","\\n","\\t"],
        "after":["","","",""]
    },
    {
        "title":"半角→全角",
        "before":[" ",",",".","､","｡",":",";","!","?"
                    ,"a","b","c","d","e","f","g"
                    ,"h","i","j","k","l","m","n"
                    ,"o","p","q","r","s","t","u"
                    ,"v","w","x","y","z"
                    ,"A","B","C","D","E","F","G"
                    ,"H","I","J","K","L","M","N"
                    ,"O","P","Q","R","S","T","U"
                    ,"V","W","X","Y","Z"
                    ,"ｱ","ｲ","ｳ","ｴ","ｵ","ｧ","ｨ","ｩ","ｪ","ｫ"
                    ,"ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｶ","ｷ","ｸ","ｹ","ｺ"
                    ,"ｻﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ｻ","ｼ","ｽ","ｾ","ｿ"
                    ,"ﾀﾞ","ﾁﾞ","ﾂﾞ","ﾃﾞ","ﾄﾞ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ｯ"
                    ,"ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ"
                    ,"ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ","ﾊ","ﾋ","ﾌ","ﾍ","ﾎ"
                    ,"ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ｬ","ｭ","ｮ"
                    ,"ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ"
                    ,"\"","#","$","%","&","'","(",")","=","~","|"
                    ,"`","{","+","*","}","<",">","_"
                    ,"0","1","2","3","4","5","6","7","8","9","-","^","\\","@"
                    ,"[","]","｢","｣"
                ],
        "after":["　","，","．","、","。","：","；","！","？"
                    ,"ａ","ｂ","ｃ","ｄ","ｅ","ｆ","ｇ"
                    ,"ｈ","ｉ","ｊ","ｋ","ｌ","ｍ","ｎ"
                    ,"ｏ","ｐ","ｑ","ｒ","ｓ","ｔ","ｕ"
                    ,"ｖ","ｗ","ｘ","ｙ","ｚ"
                    ,"Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ"
                    ,"Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ"
                    ,"Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ"
                    ,"Ｖ","Ｗ","Ｘ","Ｙ","Ｚ"
                    ,"ア","イ","ウ","エ","オ","ァ","ィ","ゥ","ェ","ォ"
                    ,"ガ","ギ","グ","ゲ","ゴ","カ","キ","ク","ケ","コ"
                    ,"ザ","ジ","ズ","ゼ","ゾ","サ","シ","ス","セ","ソ"
                    ,"ダ","ヂ","ヅ","デ","ド","タ","チ","ツ","テ","ト","ッ"
                    ,"ナ","ニ","ヌ","ネ","ノ","バ","ビ","ブ","ベ","ボ"
                    ,"パ","ピ","プ","ペ","ポ","ハ","ヒ","フ","ヘ","ホ"
                    ,"マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ャ","ュ","ョ"
                    ,"ラ","リ","ル","レ","ロ","ワ","ヲ","ン"
                    ,"”","＃","＄","％","＆","’","（","）","＝","～","｜"
                    ,"｀","｛","＋","＊","｝","＜","＞","＿"
                    ,"０","１","２","３","４","５","６","７","８","９","ー","＾","￥","＠"
                    ,"［","］","「","」"
                ]
    },
    {
        "title":"全角→半角",
        "after":[" ",",",".","､","｡",":",";","!","?"
                    ,"a","b","c","d","e","f","g"
                    ,"h","i","j","k","l","m","n"
                    ,"o","p","q","r","s","t","u"
                    ,"v","w","x","y","z"
                    ,"A","B","C","D","E","F","G"
                    ,"H","I","J","K","L","M","N"
                    ,"O","P","Q","R","S","T","U"
                    ,"V","W","X","Y","Z"
                    ,"ｱ","ｲ","ｳ","ｴ","ｵ","ｧ","ｨ","ｩ","ｪ","ｫ"
                    ,"ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｶ","ｷ","ｸ","ｹ","ｺ"
                    ,"ｻﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ｻ","ｼ","ｽ","ｾ","ｿ"
                    ,"ﾀﾞ","ﾁﾞ","ﾂﾞ","ﾃﾞ","ﾄﾞ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ｯ"
                    ,"ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ"
                    ,"ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ","ﾊ","ﾋ","ﾌ","ﾍ","ﾎ"
                    ,"ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ｬ","ｭ","ｮ"
                    ,"ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ"
                    ,"\"","#","$","%","&","'","(",")","=","~","|"
                    ,"`","{","+","*","}","<",">","_"
                    ,"0","1","2","3","4","5","6","7","8","9","-","^","\\","@"
                    ,"[","]","｢","｣"
                ],
        "before":["　","，","．","、","。","：","；","！","？"
                    ,"ａ","ｂ","ｃ","ｄ","ｅ","ｆ","ｇ"
                    ,"ｈ","ｉ","ｊ","ｋ","ｌ","ｍ","ｎ"
                    ,"ｏ","ｐ","ｑ","ｒ","ｓ","ｔ","ｕ"
                    ,"ｖ","ｗ","ｘ","ｙ","ｚ"
                    ,"Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ"
                    ,"Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ"
                    ,"Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ"
                    ,"Ｖ","Ｗ","Ｘ","Ｙ","Ｚ"
                    ,"ア","イ","ウ","エ","オ","ァ","ィ","ゥ","ェ","ォ"
                    ,"ガ","ギ","グ","ゲ","ゴ","カ","キ","ク","ケ","コ"
                    ,"ザ","ジ","ズ","ゼ","ゾ","サ","シ","ス","セ","ソ"
                    ,"ダ","ヂ","ヅ","デ","ド","タ","チ","ツ","テ","ト","ッ"
                    ,"ナ","ニ","ヌ","ネ","ノ","バ","ビ","ブ","ベ","ボ"
                    ,"パ","ピ","プ","ペ","ポ","ハ","ヒ","フ","ヘ","ホ"
                    ,"マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ャ","ュ","ョ"
                    ,"ラ","リ","ル","レ","ロ","ワ","ヲ","ン"
                    ,"”","＃","＄","％","＆","’","（","）","＝","～","｜"
                    ,"｀","｛","＋","＊","｝","＜","＞","＿"
                    ,"０","１","２","３","４","５","６","７","８","９","ー","＾","￥","＠"
                    ,"［","］","「","」"
                ]
    },
    {
        "title":"数式",
        "before":["^0","^1","^2","^3","^4","^5","^6","^7","^8","^9"
                    ,"_0","_1","_2","_3","_4","_5","_6","_7","_8","_9"
                    ,"pm","mp","ne","propt","times","div","<<",">>","<=",">="
                    ,"~=","~~","approx","equiv","forall","partial","sqrt"
                    ,"cbrt","qdrt","emptyset","o/","degree","degf","degc"
                    ,"inc","nabla","notexists","exists"
                    ,"<->","therefore","neg","vdots","cdots","rddots","ddots","cdot"
                    ,"aleph","beth","circ","sqcap","sqcup","wedge","vee"
                    ,"parallel","bot","perp","vdash","dashv"
                    ,"aoint","coint","oiiint","oiint","oint"
                    ,"iiint","iint","int","sum","coprod","prod"
                    ,"alpha","beta","gamma","delta","epsilon","zeta","eta"
                    ,"theta","iota","kappa","lambda","mu","nu"
                    ,"xi","omicron","pai","rho","sigma","tau","upsilon"
                    ,"phi","chi","psi","omega","varepsilon"
                    ,"Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta"
                    ,"Theta","Iota","Kappa","Lambda","Mu","Nu"
                    ,"Xi","Omicron","Pai","Rho","Sigma","Tau","Upsilon"
                    ,"Phi","Chi","Psi","Omega","pi"
                    ,"cup","cap","in","ni"
                ],
        "after":["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"
                    ,"₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"
                    ,"±","∓","≠","∝","×","÷","≪","≫","≤","≥"
                    ,"≅","≈","≈","≡","∀","∂","√"
                    ,"∛","∜","∅","∅","°","℉","℃"
                    ,"∆","∇","∄","∃"
                    ,"↔","∴","¬","⋮","⋯","⋰","⋱","∙"
                    ,"ℵ","ℶ","∘","⊓","⊔","∧","∨"
                    ,"∥","⊥","⊥","⊢","⊣"
                    ,"∳","∲","∰","∯","∮"
                    ,"∭","∬","∫","∑","∐","∏"
                    ,"α","β","γ","δ","ϵ","ζ","η"
                    ,"θ","ι","κ","λ","μ","ν"
                    ,"ξ","ο","π","ρ","σ","τ","υ"
                    ,"φ","χ","ψ","ω","ε"
                    ,"Α","Β","Γ","Δ","Ε","Ζ","Η"
                    ,"Θ","Ι","Κ","Λ","Μ","Ν"
                    ,"Ξ","Ο","Π","Ρ","Σ","Τ","Υ"
                    ,"Φ","χ","Ψ","Ω","π"
                    ,"∪","∩","∈","∋"
                ]
    },
    {
        "title":"かな→カナ",
        "before":
        [
            "あ","い","う","え","お","ぁ","ぃ","ぅ","ぇ","ぉ"
            ,"が","ぎ","ぐ","げ","ご","か","き","く","け","こ"
            ,"ざ","じ","ず","ぜ","ぞ","さ","し","す","せ","そ"
            ,"だ","ぢ","づ","で","ど","た","ち","つ","て","と","っ"
            ,"な","に","ぬ","ね","の","ば","び","ぶ","べ","ぼ"
            ,"ぱ","ぴ","ぷ","ぺ","ぽ","は","ひ","ふ","へ","ほ"
            ,"ま","み","む","め","も","や","ゆ","よ","ゃ","ゅ","ょ"
            ,"ら","り","る","れ","ろ","わ","を","ん"
            ,"ゐ","ゑ","ゎ"
        ],
        "after":
        [
            "ア","イ","ウ","エ","オ","ァ","ィ","ゥ","ェ","ォ"
            ,"ガ","ギ","グ","ゲ","ゴ","カ","キ","ク","ケ","コ"
            ,"ザ","ジ","ズ","ゼ","ゾ","サ","シ","ス","セ","ソ"
            ,"ダ","ヂ","ヅ","デ","ド","タ","チ","ツ","テ","ト","ッ"
            ,"ナ","ニ","ヌ","ネ","ノ","バ","ビ","ブ","ベ","ボ"
            ,"パ","ピ","プ","ペ","ポ","ハ","ヒ","フ","ヘ","ホ"
            ,"マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ャ","ュ","ョ"
            ,"ラ","リ","ル","レ","ロ","ワ","ヲ","ン"
            ,"ヰ","ヱ","ヮ"
        ]
    },
    {
        "title":"カナ→かな",
        "after":
        [
            "あ","い","う","え","お","ぁ","ぃ","ぅ","ぇ","ぉ"
            ,"が","ぎ","ぐ","げ","ご","か","き","く","け","こ"
            ,"ざ","じ","ず","ぜ","ぞ","さ","し","す","せ","そ"
            ,"だ","ぢ","づ","で","ど","た","ち","つ","て","と","っ"
            ,"な","に","ぬ","ね","の","ば","び","ぶ","べ","ぼ"
            ,"ぱ","ぴ","ぷ","ぺ","ぽ","は","ひ","ふ","へ","ほ"
            ,"ま","み","む","め","も","や","ゆ","よ","ゃ","ゅ","ょ"
            ,"ら","り","る","れ","ろ","わ","を","ん"
            ,"ゐ","ゑ","ゎ"
        ],
        "before":
        [
            "ア","イ","ウ","エ","オ","ァ","ィ","ゥ","ェ","ォ"
            ,"ガ","ギ","グ","ゲ","ゴ","カ","キ","ク","ケ","コ"
            ,"ザ","ジ","ズ","ゼ","ゾ","サ","シ","ス","セ","ソ"
            ,"ダ","ヂ","ヅ","デ","ド","タ","チ","ツ","テ","ト","ッ"
            ,"ナ","ニ","ヌ","ネ","ノ","バ","ビ","ブ","ベ","ボ"
            ,"パ","ピ","プ","ペ","ポ","ハ","ヒ","フ","ヘ","ホ"
            ,"マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ャ","ュ","ョ"
            ,"ラ","リ","ル","レ","ロ","ワ","ヲ","ン"
            ,"ヰ","ヱ","ヮ"
        ]
    },
    {
        "title":"和文モールス",
        "before":
        [
            "あ","い","う","え","お"
            ,"か","き","く","け","こ"
            ,"さ","し","す","せ","そ"
            ,"た","ち","つ","て","と"
            ,"な","に","ぬ","ね","の"
            ,"は","ひ","ふ","へ","ほ"
            ,"ま","み","む","め","も"
            ,"や","ゆ","よ"
            ,"ら","り","る","れ","ろ"
            ,"わ","を","ん"
            ,"゛","゜","ー"
            ,"が","ぎ","ぐ","げ","ご"
            ,"ざ","じ","ず","ぜ","ぞ"
            ,"だ","ぢ","づ","で","ど"
            ,"ば","び","ぶ","べ","ぼ"
            ,"ぱ","ぴ","ぷ","ぺ","ぽ"
            ,"ゐ","ゑ","。","、"
            ,"「","」","（","）"
            ,"0","1","2","3","4"
            ,"5","6","7","8","9"
        ],
        "after":
        [
            "－－・－－　","・－　","・・－　","－・－－－　","・－・・・　"
            ,"・－・・　","－・－・・　","・・・－　","－・－－　","－－－－　"
            ,"－・－・－　","－－・－・　","－－－・－　","・－－－・　","－－－・　"
            ,"－・　","・・－・　","・－－・　","・－・－－　","・・－・・　"
            ,"・－・　","－・－・　","・・・・　","－－・－　","・・－－　"
            ,"－・・・　","－－・・－　","－－・・　","・　","－・・　"
            ,"－・・－　","・・－・－　","－　","－・・・－　","－・・－・　"
            ,"・－－　","－・・－－　","－－　"
            ,"・・・　","－－・　","－・－－・　","－－－　","・－・－　"
            ,"－・－　","・－－－　","・－・－・　"
            ,"・・　","・・－－・　","・－－・－"
            ,"・－・・　・・　","－・－・・　・・　","・・・－　・・　","－・－－　・・　","－－－－　・・　"
            ,"－・－・－　・・　","－－・－・　・・　","－－－・－　・・　","・－－－・　・・　","－－－・　・・　"
            ,"－・　・・　","・・－・　・・　","・－－・　・・　","・－・－－　・・　","・・－・・　・・　"
            ,"－・・・　・・　","－－・・－　・・　","－－・・　・・　","・　・・　","－・・　・・　"
            ,"－・・・　・・－－・　","－－・・－　・・－－・　","－－・・　・・－－・　","・　・・－－・　","－・・　・・－－・"
            ,"・－・・－　","・－－・・　","・－・－・・　","・－・－・－　"
            ,"－・－－・－　","・－・・－・","－・－－・－　","・－・・－・"
            ,"－－－－－　","・－－－－　","・・－－－　","・・・－－　","・・・・－　"
            ,"・・・・・　","－・・・・　","－－・・・　","－－－・・　","－－－－・　"
        ]
    },
    {
        "title":"英文モールス",
        "before":
        [
            "a","b","c","d","e","f","g"
            ,"h","i","j","k","l","m","n"
            ,"o","p","q","r","s","t","u"
            ,"v","w","x","y","z"
            ,"A","B","C","D","E","F","G"
            ,"H","I","J","K","L","M","N"
            ,"O","P","Q","R","S","T","U"
            ,"V","W","X","Y","Z"
            ,"0","1","2","3","4"
            ,"5","6","7","8","9"
            ,".",",","?","-","/","@"
        ],
        "after":
        [
            "・－　","－・・・　","－・－・　","－・・　","・　","・・－・　","－－・　"
            ,"・・・・　","・・　","・－－－　","－・－　","・－・・　","－－　","－・　"
            ,"－－－　","・－－・　","－－・－　","・－・　","・・・　","－　","・・－　"
            ,"・・・－　","・－－　","－・・－　","－・－－　","－－・・"
            ,"・－　","－・・・　","－・－・　","－・・　","・　","・・－・　","－－・　"
            ,"・・・・　","・・　","・－－－　","－・－　","・－・・　","－－　","－・　"
            ,"－－－　","・－－・　","－－・－　","・－・　","・・・　","－　","・・－　"
            ,"・・・－　","・－－　","－・・－　","－・－－　","－－・・"
            ,"－－－－－　","・－－－－　","・・－－－　","・・・－－　","・・・・－　"
            ,"・・・・・　","－・・・・　","－－・・・　","－－－・・　","－－－－・　"
            ,"・－・－・－　","－－・・－－　","・・－－・・　","－・・・・－　","－・・－・　","・－－・－・"
        ]
    }
]