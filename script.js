txtFull = " "; //the text goes here
txtArr = txtFull.split("");

function getRandomTime() {
    return Math.random() * 0.5;
}
function getEle(id) {
    return document.getElementById("text");
}
function ModifyTxt(el, txt) {
    return (el.innerHTML = txt);
}
function writeOut(txtArr, curChar = 0) {
    const randomTime = getRandomTime();
    setTimeout(
        () => {
            const el = getEle("text");
            let elTxt = el.innerHTML;
            elTxt += txtArr[curChar];
            ModifyTxt(el, elTxt);
            //check if next iteration is out of range
            if (curChar + 1 == txtArr.length) {
                return deleteOut(txtArr, txtArr.length);
            }
            return writeOut(txtArr, curChar + 1);
        },

        randomTime * 1000
    );
}
function deleteOut(txtArr, curChar = 0) {
    const randomTime = getRandomTime();
    setTimeout(
        () => {
            const el = getEle("text");
            let elTxt = el.innerHTML;
            //remove
            const elTxtArr = elTxt.split("");
            const elTxtArrLen = elTxtArr.length;
            console.log(elTxtArr.length - 1);
            const newElTxt = elTxtArr.splice(0, curChar - 1).join("");
            ModifyTxt(el, newElTxt);
            if (elTxtArrLen == 1) {
                if(txtFull == "Game Developer "){
                    txtFull = "Newbie Blender guy ";
                }
                else if(txtFull=="Newbie Blender guy "){
                    txtFull = "Student ";
                }
                else{
                    txtFull = "Game Developer ";
                }
                txtArr = txtFull.split("");
                return writeOut(txtArr, 0);
            }
            return deleteOut(txtArr, elTxtArrLen - 1);
        },

        randomTime * 1000
    );
    return;
}
writeOut(txtArr);
