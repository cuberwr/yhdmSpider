const fetch = require('node-fetch');
const io = require('cheerio');
const async = require('async')
const fs = require('fs');


//注意原链接不能存在|i|
async function linkPoolByNum(link,arg,reqData=[{}]){
    return new Promise((resolve,reject)=>{
        pool=[]
        for(i=arg[0]*1;i<=arg[2]*1;i+=arg[1]*1){
            console.log(i)
            url=link.split('|i|')[0]+i+link.split('|i|')[1]
            console.log(url)
            pool.push(fetch(url,reqData[Math.floor(Math.random()*reqData.length)]))
        }
        resolve(pool)
    })
}

async function getDatas(pool,type,th=10){
    return new Promise((resolve,reject)=>{
    datas=[]
    async.mapLimit(pool,th,async(req,callback)=>{
        let res=await req
        if(type=='text') res=await res.text()
        if(type=='json') res=await res.json()
        datas.push(res)
    },(err,result)=>{
        if(err) console.log(err)
        resolve(datas)
    })})
}

async function linkPoolByAry(link,ary,reqData){
    return new Promise((resolve,reject)=>{
        pool=[]
        for(i=0;i<ary.length;i++){
            url=link.split('|i|')[0]+ary[i]+link.split('|i|')[1]
            //console.log(url)
            pool.push(fetch(url,reqData[Math.floor(Math.random()*reqData.length)]))
        }
        resolve(pool)
    })
}

function http2fetch(httpFile){
    const data = fs.readFileSync(httpFile, 'UTF-8');
    const lines = data.split(/\r?\n/);
    fetchs={}
    fetchDatas={}
    reqData={
        headers:{}
    }
    for(i=0;i<lines.length;i++){
        if(lines[i].slice(0,3)=='###'){
            tag=lines[i].slice(3)
            method=lines[i+1].split(' ')[0]
            url=lines[i+1].split(' ')[1]
            i+=1
            continue
        }
        if(!lines[i+1]||lines[i+1].slice(0,3)=='###'){
            baseUrl=reqData.headers.host
            if (url.slice(0,4)!='http'){
                url='http://'+baseUrl+url
            }
            fetchDatas[tag]={
                url:url,
                reqData:reqData
            }
            fetchs[tag]=fetch(url,reqData)
            //console.log(reqData)
            reqData={
                headers:{}
            }
            continue
        }
        reqData.headers[lines[i].split(': ')[0].toLowerCase()]=lines[i].split(': ')[1]  
    }
    return {
        fetchs:fetchs,
        fetchDatas:fetchDatas
    }
}

