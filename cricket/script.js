const teams=[
{id:"CSK",name:"Chennai Super Kings",short:"CSK",icon:"🦁",purse:120},
{id:"MI",name:"Mumbai Indians",short:"MI",icon:"🔵",purse:120},
{id:"RCB",name:"Royal Challengers Bengaluru",short:"RCB",icon:"🔴",purse:120},
{id:"KKR",name:"Kolkata Knight Riders",short:"KKR",icon:"🟣",purse:120},
{id:"SRH",name:"Sunrisers Hyderabad",short:"SRH",icon:"🟠",purse:120},
{id:"RR",name:"Rajasthan Royals",short:"RR",icon:"🌸",purse:120},
{id:"DC",name:"Delhi Capitals",short:"DC",icon:"🔷",purse:120},
{id:"PBKS",name:"Punjab Kings",short:"PBKS",icon:"🦁",purse:120},
{id:"GT",name:"Gujarat Titans",short:"GT",icon:"⚔️",purse:120},
{id:"LSG",name:"Lucknow Super Giants",short:"LSG",icon:"💙",purse:120}
];

const players=[
["Virat Kohli","BATTER","🇮🇳 INDIA",2],
["Rohit Sharma","BATTER","🇮🇳 INDIA",2],
["MS Dhoni","WICKET KEEPER","🇮🇳 INDIA",2],
["Jasprit Bumrah","BOWLER","🇮🇳 INDIA",2],
["Ravindra Jadeja","ALL ROUNDER","🇮🇳 INDIA",2],
["Suryakumar Yadav","BATTER","🇮🇳 INDIA",2],
["Shubman Gill","BATTER","🇮🇳 INDIA",2],
["Hardik Pandya","ALL ROUNDER","🇮🇳 INDIA",2],
["Rishabh Pant","WICKET KEEPER","🇮🇳 INDIA",2],
["KL Rahul","WICKET KEEPER","🇮🇳 INDIA",2],
["Yashasvi Jaiswal","BATTER","🇮🇳 INDIA",2],
["Sanju Samson","WICKET KEEPER","🇮🇳 INDIA",1.5],
["Ruturaj Gaikwad","BATTER","🇮🇳 INDIA",1.5],
["Shreyas Iyer","BATTER","🇮🇳 INDIA",1.5],
["Kuldeep Yadav","BOWLER","🇮🇳 INDIA",1],
["Mohammed Siraj","BOWLER","🇮🇳 INDIA",1.5],
["Arshdeep Singh","BOWLER","🇮🇳 INDIA",1.5],
["Rashid Khan","BOWLER","🇦🇫 AFGHANISTAN",2],
["Jos Buttler","WICKET KEEPER","🏴 ENGLAND",2],
["Pat Cummins","BOWLER","🇦🇺 AUSTRALIA",2],
["Travis Head","BATTER","🇦🇺 AUSTRALIA",2],
["Glenn Maxwell","ALL ROUNDER","🇦🇺 AUSTRALIA",2],
["Andre Russell","ALL ROUNDER","🇯🇲 WEST INDIES",2],
["Sunil Narine","ALL ROUNDER","🇯🇲 WEST INDIES",2],
["Nicholas Pooran","WICKET KEEPER","🇻🇨 WEST INDIES",2],
["Heinrich Klaasen","WICKET KEEPER","🇿🇦 SOUTH AFRICA",2],
["Mitchell Starc","BOWLER","🇦🇺 AUSTRALIA",2],
["Kagiso Rabada","BOWLER","🇿🇦 SOUTH AFRICA",2],
["Rinku Singh","BATTER","🇮🇳 INDIA",1],
["Abhishek Sharma","ALL ROUNDER","🇮🇳 INDIA",1]
].map(x=>({name:x[0],role:x[1],country:x[2],base:x[3]}));

let userTeam=null;
let currentIndex=0;
let currentPlayer=null;
let highestBid=0;
let highestBidder=null;
let timer=20;
let timerInterval=null;
let auctionRunning=false;
let auctionFinished=false;

function money(v){return "₹"+v.toFixed(2)+" Cr"}

function renderTeams(){
 const grid=document.getElementById("teamGrid");
 grid.innerHTML=teams.map((t,i)=>`
 <div class="team-option" onclick="selectTeam(${i})">
   <div class="team-icon">${t.icon}</div>
   <h3>${t.name}</h3>
   <p>${t.short} • Purse ₹120 Cr</p>
 </div>`).join("");
}

function selectTeam(index){
 userTeam=teams[index];
 document.getElementById("teamSelection").classList.add("hidden");
 document.getElementById("auctionPage").classList.remove("hidden");
 document.getElementById("myTeamName").textContent=userTeam.name;
 document.getElementById("selectedTeamName").textContent=userTeam.short;
 document.getElementById("teamLogo").textContent=userTeam.icon;
 renderOtherTeams();
 loadPlayer();
}

function loadPlayer(){
 if(currentIndex>=players.length){finishAuction();return}
 currentPlayer=players[currentIndex];
 highestBid=currentPlayer.base;
 highestBidder=null;
 auctionFinished=false;
 document.getElementById("playerNumber").textContent=`PLAYER #${currentIndex+1} / ${players.length}`;
 document.getElementById("playerName").textContent=currentPlayer.name;
 document.getElementById("playerRole").textContent=currentPlayer.role;
 document.getElementById("playerCountry").textContent=currentPlayer.country;
 document.getElementById("basePrice").textContent=money(currentPlayer.base);
 document.getElementById("highestBid").textContent=money(currentPlayer.base);
 document.getElementById("highestBidder").textContent="NO BID";
 document.getElementById("soldStamp").classList.add("hidden");
 document.getElementById("sellBtn").disabled=false;
 document.getElementById("unsoldBtn").disabled=false;
 startTimer();
 addLog(`<b>${currentPlayer.name}</b> is now open for auction at <b>${money(currentPlayer.base)}</b>.`);
}

function startTimer(){
 clearInterval(timerInterval);
 timer=20;
 document.getElementById("timer").textContent=timer;
 auctionRunning=true;
 timerInterval=setInterval(()=>{
   timer--;
   document.getElementById("timer").textContent=timer;
   if(timer<=0){
     clearInterval(timerInterval);
     auctionRunning=false;
     if(highestBidder) sellPlayer();
     else unsoldPlayer();
   }
 },1000);
}

function placeBid(increment){
 if(!userTeam || !currentPlayer || auctionFinished || !auctionRunning)return;

 const newBid=(highestBidder?highestBid:currentPlayer.base)+increment;

 if(newBid>userTeam.purse){
   addLog(`<span style="color:#ff7777">Insufficient purse for ${userTeam.short}.</span>`);
   return;
 }

 highestBid=newBid;
 highestBidder=userTeam;
 timer=20;

 document.getElementById("highestBid").textContent=money(highestBid);
 document.getElementById("highestBidder").textContent=userTeam.short;
 document.getElementById("timer").textContent=timer;

 addLog(`<b>${userTeam.short}</b> bid <b>${money(highestBid)}</b> for ${currentPlayer.name}.`);
 renderTeamInfo();
}

function sellPlayer(){
 if(auctionFinished)return;
 if(!highestBidder){addLog("No valid bid. Player is unsold.");unsoldPlayer();return}

 auctionFinished=true;
 auctionRunning=false;
 clearInterval(timerInterval);

 const winner=highestBidder;
 winner.purse-=highestBid;
 if(!winner.squad)winner.squad=[];
 winner.squad.push({player:currentPlayer,price:highestBid});

 document.getElementById("soldStamp").classList.remove("hidden");
 addLog(`<b>${currentPlayer.name}</b> SOLD to <b>${winner.short}</b> for <b>${money(highestBid)}</b>.`);

 renderTeamInfo();
 renderOtherTeams();

 showResult("🏆","PLAYER SOLD",`${currentPlayer.name} has been sold to ${winner.name} for ${money(highestBid)}.`);
}

function unsoldPlayer(){
 if(auctionFinished)return;

 auctionFinished=true;
 auctionRunning=false;
 clearInterval(timerInterval);

 addLog(`<b>${currentPlayer.name}</b> goes UNSOLD.`);
 showResult("❌","PLAYER UNSOLD",`${currentPlayer.name} was not purchased by any team.`);
}

function showResult(icon,title,message){
 document.getElementById("resultIcon").textContent=icon;
 document.getElementById("resultTitle").textContent=title;
 document.getElementById("resultMessage").textContent=message;
 document.getElementById("resultOverlay").classList.remove("hidden");
}

function nextPlayer(){
 document.getElementById("resultOverlay").classList.add("hidden");
 currentIndex++;
 loadPlayer();
}

function renderTeamInfo(){
 if(!userTeam)return;

 const spent=120-userTeam.purse;
 const count=userTeam.squad?userTeam.squad.length:0;

 document.getElementById("myPurse").textContent=money(userTeam.purse);
 document.getElementById("playerCount").textContent=count;
 document.getElementById("totalSpent").textContent=money(spent);

 const list=document.getElementById("squadList");

 if(!userTeam.squad || userTeam.squad.length===0){
   list.innerHTML=`<div class="empty-squad">No players purchased yet</div>`;
   return;
 }

 list.innerHTML=userTeam.squad.map(x=>`
 <div class="squad-player">
   <div>
     <div class="squad-player-name">${x.player.name}</div>
     <div class="squad-player-role">${x.player.role}</div>
   </div>
   <div class="squad-player-price">${money(x.price)}</div>
 </div>`).join("");
}

function renderOtherTeams(){
 const box=document.getElementById("otherTeamsList");

 box.innerHTML=teams.map(t=>`
 <div class="other-team">
   <div class="other-team-icon">${t.icon}</div>
   <div class="other-team-name">${t.short}</div>
   <div class="other-team-purse">${money(t.purse)}</div>
 </div>`).join("");

 renderTeamInfo();
}

function addLog(text){
 const log=document.getElementById("auctionLog");
 const empty=log.querySelector(".empty-log");
 if(empty)empty.remove();

 const item=document.createElement("div");
 item.className="log-item";
 item.innerHTML=text;
 log.prepend(item);
}

function finishAuction(){
 clearInterval(timerInterval);
 document.getElementById("resultIcon").textContent="🏆";
 document.getElementById("resultTitle").textContent="AUCTION COMPLETE";
 document.getElementById("resultMessage").textContent="All players in this auction have been processed.";
 document.getElementById("resultOverlay").classList.remove("hidden");
}

function resetAuction(){
 if(!confirm("Reset the complete auction?"))return;
 location.reload();
}

renderTeams();
