const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`
<iframe src="https://www.cuan.la/m3u8.php?url=1098_63698fd15d54979b8db854476b3f2f23" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" allowfullscreen="true" allowtransparency="true" width="100%" height="100%"></iframe>
`, { 
    runScripts: "dangerously",
    pretendToBeVisual: true ,
    resources: "usable",
    url:'http://tup.yhdm.so/?vid=1098_63698fd15d54979b8db854476b3f2f23$qzz'
});
/* JSDOM.fromURL("http://tup.yhdm.so/?vid=1098_63698fd15d54979b8db854476b3f2f23$qzz").then(dom => {
  console.log(dom.serialize());
}); */
const document = dom.serialize();
setTimeout(()=>{
    const firstPost = document;
    console.log(firstPost)
},5000)