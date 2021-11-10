const fetch = require('node-fetch');
const io = require('cheerio');
const async = require('async')
const fs = require('fs');

async function getAllTitleLink(){
    let page=await fetch('http://www.yhdm.so/all/')
    page=await page.text()
    const $=io.load(page)
    //body > div:nth-child(5) > div:nth-child(27)
    //body > div:nth-child(5) > div:nth-child(1) > ul > li:nth-child(2) > a
    let animes=[]
    let nums=[]
    for(let i=1;i<=27;i++){
        nums.push(i)
    }
    nums.forEach(i=>{
        let l=$('body > div:nth-child(5) > div:nth-child('+i+') > ul > li').length
        for (let j=2;j<=l;j++){
            let aTag=$('body > div:nth-child(5) > div:nth-child('+i+') > ul > li:nth-child('+j+') > a')
            let anime={
                title:aTag.text(),
                href:aTag.attr('href')
            }
            console.log(anime)
            animes.push(anime)
        }
    })
    fs.writeFileSync('animesTitle.json',JSON.stringify(animes))
    return animes
}

async function getRealLink(anime,callback){
    console.log(anime.title)
    try{
        for(let i=0;i<anime.playlist.length;i++){
            let res=await fetch('http://yhdm.so'+anime.playlist[i].href)
            res=await res.text()
            let $=io.load(res)
            let dataVid=$('#playbox').attr('data-vid')
            anime.playlist[i].iframeLink='http://tup.yhdm.so/?vid='+dataVid
            anime.playlist[i].vid=dataVid
            console.log(anime.playlist[i].vid)
        }
        fs.appendFileSync('real.json',JSON.stringify(anime)+',')
        callback()
    }catch(err){
        console.log(err)
        fs.appendFileSync('real.json',JSON.stringify(anime)+',')
        callback()
    }

}

async function getInfo(anime,callback){
    let info={
        title:anime.title,
        info:[],
        playlist:[],
        about:'',
        img:''
    }
    console.log(anime.title)
    try{
        let res=await fetch('http://yhdm.so'+anime.href)
        res=await res.text()
        const $=io.load(res)
        let infos=$('body > div:nth-child(2) > div.fire.l > div.rate.r > div.sinfo > *').toArray()
        infos.forEach(e=>{
            info.info.push($(e).text().replace(/\s*|\n|\t/g,""))
        })
        info.img=$('body > div:nth-child(2) > div.fire.l > div.thumb.l > img').attr('src')
        info.about=$('body > div:nth-child(2) > div.fire.l > div.info').text().replace(/\s*|\n|\t/g,"")
        let plays=$('#main0 > div > ul > li > a').toArray()
        for (let i=0;i<plays.length;i++){
            let a=$(plays[i])
            let play={
                title:a.text(),
                href:a.attr('href')
            }
            info.playlist.push(play)
        }
        fs.appendFileSync('playLink.json',JSON.stringify(info)+',')
        console.log(info)
        console.log(aaa.length)
        callback()
        return info
    }catch(err){
        console.log(err)
        console.log(info)
        fs.appendFileSync('playLink.json',JSON.stringify(info)+',')
        callback()
        return info
    }
}

//getInfo({title:'jjj',href:'/show/4957.html'})

async function getAllPlayLink(list){
    async.mapLimit(list,50,(anime,callback)=>{
        getInfo(anime,callback)
    },(err,res)=>{
        if (err) console.log(err)
        //fs.writeFileSync('playlink.json',JSON.stringify(aaa))
    })
}

async function getAllRealLink(list){
    async.mapLimit(list,50,(anime,callback)=>{
        getRealLink(anime,callback)
    },(err,res)=>{
        if (err) console.log(err)
        //fs.writeFileSync('playlink.json',JSON.stringify(aaa))
    })
}

getAllRealLink(JSON.parse(fs.readFileSync('playlink.json')))
//getAllPlayLink(JSON.parse(fs.readFileSync('animesTitle.json')))
//getAllTitleLink()
/* getRealLink({
    "title": "瓦尼塔斯的笔记",
    "info": [
        "上映:2021-07",
        "地区:日本",
        "类型:奇幻吸血鬼",
        "索引:W动漫",
        "标签:日语tv",
        "评论:",
        "更新至3集"
    ],
    "playlist": [
        {
            "title": "第03集",
            "href": "/v/5229-3.html"
        },
        {
            "title": "第02集",
            "href": "/v/5229-2.html"
        },
        {
            "title": "第01集",
            "href": "/v/5229-1.html"
        }
    ],
    "about": "《瓦尼塔斯的笔记》19世纪巴黎×吸血鬼×蒸汽朋克——您不曾听说过吗？关于将诅咒散播于吸血鬼的那本、机械驱动的魔导书的故事。现在被“瓦尼塔斯之书”所引导、演员们集结于巴黎。蓝色的皮革封面下是漆黑的纸张，用银之锁捆绑住的机械传动的魔法书，那就是瓦尼塔斯之书！从吸血鬼瓦尼塔斯手上继承了瓦尼塔斯之书和他的名号的普通人类瓦尼塔斯，与在“吸血鬼的不祥之月”蓝色月光的庇护下出生的吸血鬼诺相遇、同行、最终相杀的故事。「PandoraHearts」的望月淳所带来的吸血鬼谭——开幕。",
    "img": "http://css.njhzmxx.com/acg/2021/03/30/20210330083355930.jpg"
},()=>{}) */


