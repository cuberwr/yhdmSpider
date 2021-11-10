const fs=require('fs')
list=JSON.parse(fs.readFileSync('real.json'))
type={
    "qzz":0,
    "mp4":0,
    "qz":0,
    "youku":0,
    "bilibili":0,
    "yun":0,
    "tudou":0,
    "pan":0,
    "letv":0,
    "pptv":0,
    "sina":0,
    "qq":0,
    "sohu":0,
    "url":0,
    "qiyi":0,
    "mmsid":0,
    "lyun":0,
    "189":0,
    "ykyun":0
}
list.map(anime=>{
    anime.playlist.map(link=>{
        if (link.vid&&link.vid.split('$')[1]){
            let a=link.vid.split('$')[1]
            type[a]+=1   
        }
        
    })
})
fs.writeFileSync('type.json',JSON.stringify(type))