const images = document.querySelectorAll('.animated-banner > .layer > img')
// 0. 初始状态
function initState (isReset = false) {
/* 根据窗口宽度设置banner长度
const bannerRect = document.querySelector('.animated-banner').getBoundingClientRect()
console.log(bannerRect)
document.querySelector('.animated-banner').style.width = `${bannerRect.width}`
*/
    let offset = 0
    let percentage = 0.1 // 相当于焦点在图像左侧
    let blur = 20
    for (let [index, image] of images.entries()) {
       
       let blurValue = Math.pow((index / images.length - percentage), 2) * blur
       image.style.setProperty('--time', `${isReset ? '0.2s':'0s'}`)
       image.style.setProperty('--offset', `${offset}px`)
       image.style.setProperty('--blur', `${blurValue}px`)
    }
}
initState()

// 1. 虚焦效果
// 1.1 鼠标移入，焦点移动
document.querySelector('.animated-banner').addEventListener('mousemove', (e) => {
    // 鼠标移到最左端时是0，移到最右端时是1
    let percentage = e.clientX / window.outerWidth
    let offset = 10 * percentage
    let blur = 20

    for (let [index, image] of images.entries()) {
        // 越到后面（上方的图层），偏移越大
        offset *= 1.3
        /* 模糊度： 
            在中间时，第3、4层模糊度最低，2、5层模糊度较高，1、6层模糊度最高
            在右边时：第6层模糊度最低，越向左，模糊度提高
            
            是一个二次函数 y = x^2  
            x: 图片的层数和目前游标位置（percentage）相关
        */
       let blurValue = Math.pow((index / images.length - percentage), 2) * blur
       image.style.setProperty('--time', `0s`)
       image.style.setProperty('--offset', `${offset}px`)
       image.style.setProperty('--blur', `${blurValue}px`)
    }
}, false)

// 1.2 鼠标移出，复原重置
document.querySelector('.animated-banner').addEventListener('mouseout', (e) => {
    initState(true)
}, false)

// 2. 通过setTimeout实现背景眨眼效果
const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}
async function blink () {
    const img = images[1]
    // console.log(img.src)
    /* 上线后无法加载，换成网络资源url
    github 上的资源可以用，但是太慢了。。。换成bilibili的
    换成bilibili的也是很慢 (*￣︶￣)
    const blinkImges = ["./src/bilibili_1_1.png", "./src/bilibili_1_2.png","./src/bilibili_1_0.png"]
    
    const blinkImges = ["https://i0.hdslb.com/bfs/vc/f1892bc119b722c3cda5b26269c292a90a9f5f06.png", 
    "https://i0.hdslb.com/bfs/vc/173eafe211b4671e5aff059a1834f3e4579c7a5d.png",
    "https://i0.hdslb.com/bfs/vc/082e39ef757826401ef82da818310d42e05bc2de.png"]
    */

    const blinkImges = ["./src/bilibili_1_1.png", "./src/bilibili_1_2.png","./src/bilibili_1_0.png"]

    await sleep(50)
    img.src = blinkImges[0]
    await sleep(50)
    img.src = blinkImges[1]
    await sleep(350)
    img.src = blinkImges[2]
    setTimeout(blink, 5000)   
}
setTimeout(blink, 5000)

// 3. window 的resize事件
window.addEventListener("resize", () => { 
    // 通过设置banner的最小宽度，保证resize之后的呈现效果
    initState() 
}, false)
