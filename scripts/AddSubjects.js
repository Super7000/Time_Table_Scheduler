import { getSubjectList } from "./ServerDataFetcher.js";
import { terrorbox, clickListenerForCardActivator, addCardClickListener } from "./Util.js";
//Printing HTML code of Card of each Subject
// function showcards(){
//     let s = "";
//     let i = 8;
//     for(i; i >= 1; i--){
//         s += `<div class="d_card card">SUB${i}</div>`;
//     }
//     document.querySelector(".container .cards").innerHTML = document.querySelector(".container .cards").innerHTML + s;
// }
// showcards();


let url = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "io/subjects";
console.log(url)

function saveBtnClickListener() {
    document.querySelector(".dsb").addEventListener("click", () => {
        let val = document.querySelectorAll(".con input")[0].value.trim().toUpperCase();
        
        //form validating
        if (val.length > 9) {
            terrorbox("Length of the name must be less than 10");
            return;
        }
        if (val == "") {
            terrorbox("Please Enter a vaild name");
            return;
        }
        let semValue=document.querySelectorAll(".con input")[1].value.trim();
        if(semValue == ""){
            terrorbox("Please Enter a Number in semester");
            return;
        }
        try{
            semValue=parseInt(semValue);
        } catch (e){
            terrorbox("Please Enter a number in semester");
            return;
        }
        if(semValue<1 || semValue>8){            
            terrorbox("Value must be in 1 to 8 range in semester");
            return;
        }
        let lecCount=document.querySelectorAll(".con input")[2].value.trim();
        if(lecCount==""){
            lecCount = 4;
        }
        try{
            lecCount=parseInt(lecCount);
        } catch (e){
            terrorbox("Please Enter a number in lecture count per week");
            return;
        }
        if(lecCount<0 || lecCount>40){
            terrorbox("Value must be in range 0 to 40 in lecture count per week");
            return;
        }
        let rCode=document.querySelectorAll(".con input")[3].value.trim().toUpperCase();
        if(rCode==""){
            terrorbox("Please Enter a Classroom name");
            return;
        }

        //Sending data to server
        let subjectData = {
            sem: semValue,
            lectureCount: lecCount,
            isPractical: document.querySelectorAll(".con input")[4].checked,
            roomCode: rCode
        }
        let m = new Map();
        m[val] = subjectData;
        console.log(JSON.stringify(m));

        let statusValue;
        fetch(url, {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(m)
        })
            .then(Response => {
                statusValue = Response.status;
                return Response.text();
            })
            .then(data => {
                if (statusValue != 200) {
                    terrorbox("Something went wrong");
                    return;
                }

                //if data is updated in server then refresh cards in UI
                loadCards();
                document.querySelector(".add.card").click();
            })



    })
}
saveBtnClickListener();

function loadCards() {
    getSubjectList((data)=>{
            let s = `<div class="add card active">
                        <svg height="32px" id="Layer_1" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <path d="M28,14H18V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v10H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h10v10c0,1.104,0.896,2,2,2  s2-0.896,2-2V18h10c1.104,0,2-0.896,2-2S29.104,14,28,14z"/>
                        </svg>
                    </div>`;
            for (let key in data) {
                s += `<div class="d_card card">${key}</div>`;
            }
            document.querySelector(".container .cards").innerHTML = s;
            clickListenerForCardActivator();
            clickListenerForCards();
            addCardClickListener();
        })
}
window.onload = loadCards();

function deleteBtnFunc() {
    document.querySelector(".cBtns .cBtn").addEventListener("click", () => {
        console.log(url + "/" + document.querySelector(".d_card.active").innerHTML);
        
        let statusValue;
        fetch(url + "/" + document.querySelector(".d_card.active").innerHTML, {
            method: "DELETE"
        })
            .then(Response => {
                statusValue = Response.status;
                return Response.text()
            })
            .then(data => {
                if (statusValue != 200) {
                    terrorbox("Something went wrong");
                    return;
                }

                //if data is deleted in server then refresh cards in UI
                loadCards();
                document.querySelector(".add.card").click();
            })
    })
}
deleteBtnFunc();


function clickListenerForCards() {
    document.querySelectorAll(".cards .d_card").forEach((e) => {
        e.addEventListener("click", () => {
            document.querySelectorAll(".t_d .con input")[0].value = e.innerHTML;
            document.querySelector(".btn_con .ddb").style.display = "block";
            if (document.querySelector(".dsb.new") != null) {
                document.querySelector(".dsb.new").classList.remove("new");
                document.querySelector(".dsb").classList.add("edit");
            }

            let statusValue;
            fetch(url + "/" + e.innerHTML)
                .then(Response => {
                    statusValue = Response.status;
                    return Response.text();
                })
                .then(data => {
                    if (statusValue != 200) {
                        terrorbox("Something went wrong");
                        return;
                    }

                    //if data is found in server then show it in details box
                    let details = JSON.parse(data);
                    document.querySelectorAll(".t_d .con input")[1].value = details["sem"];
                    document.querySelectorAll(".t_d .con input")[2].value = details["lectureCount"];
                    document.querySelectorAll(".t_d .con input")[3].value = details["roomCode"];
                    document.querySelectorAll(".t_d .con input")[4].checked = details["isPractical"];
                })
        })
    })
}
clickListenerForCards();