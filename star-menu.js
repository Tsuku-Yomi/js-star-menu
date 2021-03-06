var starsetting=[
    {
        starRadius:2000,
        railRadius:6400,
        railHeight:0,
        starRadian:1,
        backgroundImg:"url('')",
        starLabel:"testA",
        starURL:"www.github.com"
    }
];
var camerasetting = {
    cameraX:500,
    cameraRadian:Math.PI/5,
    sceneX:10000,
    sceneXsize:1920,
    sceneYsize:1080,
    sensive:400
};

//setting at here

let scrennRoll=0;
let beforeX=0;
let beforeY=0;
let scrennUp=0;
let onDown=false;
let starBackground=document.getElementById("starBackground");
let starList=new Array();
function whenmousemove(){
    let pos=WorldPos2ScreenPos(turnStarPos(starPosInWorld(scrennRoll/camerasetting.sensive)));
    for(let i=0;i<starList.length;++i){
        let sz = pos[i][2];
        let sRadius=starsetting[i].starRadius*(camerasetting.cameraX/sz);
        let sy = pos[i][1]+camerasetting.sceneYsize/2-sRadius;
        let sx = pos[i][0]+camerasetting.sceneXsize/2-sRadius;
        if(sz<=camerasetting.cameraX||sy<0||sy>camerasetting.sceneYsize||sx<0||sx>camerasetting.sceneXsize){
            starList[i].style.visibility="hidden";
        }else{
            sx*=starBackground.clientWidth/camerasetting.sceneXsize;
            sy*=starBackground.clientHeight/camerasetting.sceneYsize;
            starList[i].style.visibility="visible";
            starList[i].style.height=sRadius.toFixed(0)+'px';
            starList[i].style.width=sRadius.toFixed(0)+'px';
            starList[i].style.top=sy.toFixed(0)+'px';
            starList[i].style.left=sx.toFixed(0)+'px';
            starList[i].style.zIndex=(2147483647-sz).toFixed(0);
        }
    }
}

window.onmousedown=function(ev){
    onDown=true;
    beforeX=ev.clientX;
    beforeY=ev.clientY;
}
window.onmouseup=function(ev){
    onDown=false;
}
window.onmousemove=function(ev){
    if(onDown){
        scrennRoll+=beforeX-ev.clientX;
        scrennUp+=-(beforeY-ev.clientY);
        beforeX=ev.clientX;
        beforeY=ev.clientY;
        whenmousemove();
    }
}
function MatAddVec3(MatA,MatB) {
    let MatT=MatA;
    for(let i=0;i<4;++i){
        MatT[i]+=Number(MatB[i]);
    }
    return MatT;
}

function MatMulVec3(MatA,MatEx) {
    let MatC=[0,0,0,0];
    for(let i=0;i<4;++i){
        for(let r=0;r<4;++r){
            MatC[i]+=MatA[r]*MatEx[r][i];
        }
    }
    return MatC;
}

function MatAddVec2(MatA,MatB) {
    let MatT=MatA;
    for(let i=0;i<3;++i){
        MatT[i]+=Number(MatB[i]);
    }
    return MatT;
}

function MatMulVec2(MatA,MatEx) {
    let MatC=[0,0,0];
    for(let i=0;i<3;++i){
        for(let r=0;r<3;++r){
            MatC[i]+=MatA[r]*MatEx[r][i];
        }
    }
    return MatC;
}

let midX=camerasetting.cameraX+camerasetting.sceneX;
let movXFirst=[-midX,0,0,0];
let movXFinally=[midX,0,0,0];
//??????????????????
function starPosInWorld(turnRadian) {
    let pos=new Array();
    let i=0;
    for(;i<starsetting.length;++i){
        let x=starsetting[i].railRadius;
        let y=0;
        let z=starsetting[i].railHeight;
        let matrix=[
            x,y,0
        ];
        let spinMatrix=makeSpinMatrix(
            turnRadian+starsetting[i].starRadian
        );
        matrix=MatMulVec2(matrix,spinMatrix);
        x=matrix[0]+midX;
        y=matrix[1];
        let t=[x,y,z,0];
        pos.push(t);
    }
    return pos;
}

function turnStarPos(posList) {
    let exMat=makeSpinMatrix(camerasetting.cameraRadian+scrennUp/camerasetting.sensive);
    for(let i of posList){
        i=MatAddVec3(i,movXFirst);
        let matT=[i[0],i[2],0];
        matT=MatMulVec2(matT,exMat);
        i[0]=matT[0];
        i[2]=matT[1];
        i=MatAddVec3(i,movXFinally);
    }
    return posList;
}

function WorldPos2ScreenPos(posList){
    let pos=new Array();
    for(let i of posList){
        let z=i[0];
        let x=i[1]*camerasetting.cameraX/z;
        let y=i[2]*camerasetting.cameraX/z;
        let t=[x,y,z];
        pos.push(t);
    }
    return pos;
}

function makeSpinMatrix(turnRadian) {
    let t=[
        [Math.cos(turnRadian),-Math.sin(turnRadian),0],
        [Math.sin(turnRadian), Math.cos(turnRadian),0],
        [0,0,1]
    ]
    return t;
}

for(let i=0;i<starsetting.length;++i){

    let starNormal=document.createElement("a");
    starBackground.appendChild(starNormal);
    starList.push(starNormal);
    starNormal.className="star";
    starNormal.style.visibility="hidden";
    starNormal.style.backgroundImage=starsetting[i].backgroundImg;
    let labelInStar=document.createElement("div");
    labelInStar.style.fontSize='20px';
    labelInStar.style.webkitTextStroke="0.5px #66CCFF";
    labelInStar.style.webkitTextFillColor="#808080";
    labelInStar.style.fontWeight="bold";
    labelInStar.href=starsetting[i].starURL;
    labelInStar.style.userSelect='none';
    starNormal.href=starsetting[i].starURL;
    labelInStar.innerHTML=starsetting[i].starLabel;
    labelInStar.style.top="30%";
    labelInStar.style.position="absolute";
    labelInStar.style.left="30%";
    starNormal.appendChild(labelInStar);

}
starBackground.style.width="100%";
starBackground.style.height="100%";
starBackground.style.zIndex='0';
whenmousemove();
window.onresize=whenmousemove();