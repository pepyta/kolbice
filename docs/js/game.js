var client = new Colyseus.Client("ws://localhost:3000");

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    client.joinOrCreate(document.getElementById('roomCode').value, { username: document.getElementById('username').value }).then(room => {
        console.log("joined");
        room.onStateChange.once(function (state) {
            console.log("initial room state:", state);
            document.getElementById('joinGame').setAttribute('disabled', 'yes');
            document.getElementById('startGame').removeAttribute('disabled');
        });

        var lastUsed = {};

        room.onStateChange(function(state){
            if(state.lastUsed != lastUsed){
                lastUsed = state.lastUsed
                console.log(lastUsed)

                M.toast({html: `<b>${lastUsed['player']['username']}</b> nevű játékos a <b>${card['name']}</b> kártyát használta.${lastUsed['targets'].length > 0 ? `<br><br>Célpontok: ${lastUsed['targets'].map(function(value, index, array){return(`<b>${value['username']}</b>`)})}`:""}`}, {
                    displayLength: 10000
                })
            }
            state.players.forEach(function(player){
                if(player.syncedWonGame){
                    document.getElementById('game').insertAdjacentHTML('beforeend', `
                    <div id="wonGameModal" class="modal">
                        <div class="modal-content">
                            <h4>Vége a játéknak!</h4>
                            <p>A játékot <b>${player.username}</b> nyerte!</p>
                        </div>
                    </div>`)

                    var elems = document.querySelectorAll('#wonGameModal');
                    var instances = M.Modal.init(elems, {
                        dismissable: false
                    });
                    instances[0].open();
                }
            })
        })

        room.onStateChange(function (state) {
            // this signal is triggered on each patch
            console.log(state)

            var thisUser = state.players[0];
            var thisUserId = 0;
            state.players.forEach(function(player, index){
                if(player.cards){
                    thisUser = player;
                    thisUserId = index;
                }
            })

            if(state.showLocations){
                document.getElementById('ingame').innerHTML = ""
                for(let i = 1; i <= 4; i++){
                    console.log(thisUser.location);
                    document.getElementById('ingame').insertAdjacentHTML("beforeend", `<div id="location-${i}" class="col s12 m6 center-align ${thisUser.location.id == i || (i == 1 && !thisUser.character.canEnterVillageHouse) ? "selected" : ""}"><img src="img/locations/${i}.png" class="responsive-img z-depth-1" style="margin: 10px 0; border-radius: 7px;"></div>`);
                    document.getElementById('location-'+i).addEventListener('click', function(){
                        if(thisUser.location.id == i || (i == 1 && !thisUser.character.canEnterVillageHouse)) return;
                        room.send({ action: 4, input: i });
                    })
                }
            } else if(state.showCards){
                document.getElementById('ingame').innerHTML = `<div class="col s12">
                    <div class="card">
                        <div class="card-content">
                            <div class="card-title">
                                Válassz egy lapot alulról!
                            </div>
                            Ahhoz, hogy kijátsz egy lapot kattints alul valamelyikre!
                        </div>
                    </div>
                </div>`
            } else if(state.showPlayers){
                document.getElementById('ingame').innerHTML = `<div class="col s12"><div class="card"><div class="card-content"><div class="card-title">Válaszd ki a célpontokat!</div>Válaszd ki azt a <b>${state.targetPlayerNumber}</b> játékost, akire elsütöd ezt a kártyát!</div></div></div>`
                var selected = [];
                state.players.forEach(function(player, index){
                    document.getElementById('ingame').insertAdjacentHTML('beforeend', generatePlayer(player, index, state.currentPlayer));
                    document.getElementById(`select-player-${index}`).addEventListener('click', function(){
                        if(selected.includes(index)){
                            for(let i = 0; i < selected.length; i++){
                                selected.splice(i, 1);
                            }

                            document.getElementById(`select-player-${index}`).classList.remove('selected');
                        } else {
                            selected.push(index);
                            document.getElementById(`select-player-${index}`).classList.add('selected');
                            
                            console.log(selected.length);
                            console.log(state.targetPlayerNumber);
                            if(selected.length >= state.targetPlayerNumber){
                                room.send({
                                    action: 2,
                                    input: {
                                        players: selected
                                    }
                                });
                            }
                        }
                    })
                })
            }
            if(state.players.length > 0){
                document.getElementById('game').style.display = "block";
                document.getElementById('login').style.display = "none";
                // Elkezdődött a játék
                document.getElementById('players-place').innerHTML = ""
                document.getElementById('cards').innerHTML = ""
                state.players.forEach(function(player, index2){
                    document.getElementById('players-place').insertAdjacentHTML("beforeend", generatePlayer(player, index2, state.currentPlayer))
                    if(!player['cards']) return;
                    player.cards.forEach(function(card, index){
                        document.getElementById('cards').insertAdjacentHTML("beforeend", generateCard(card, index))
                        document.getElementById('card-'+index).addEventListener('click', function(){
                            room.send({ action: 1, input: {
                                cardId: index
                            }})
                        })
                    })
                })
            } else {
                // Not yet started
                document.getElementById('game').style.display = "none";
                document.getElementById('login').style.display = "block";
            }

            
            if(thisUserId != state.currentPlayer){
                document.getElementById('ingame').insertAdjacentHTML("afterbegin", `
                <div class="col s12">
                    <div class="card red white-text">
                        <div class="card-content">
                            <div class="card-title">
                                Ez nem a te köröd!
                            </div>
                            Várd meg amíg a te köröd következik!
                        </div>
                    </div>
                </div>`)
            }

        });

        // listen to patches coming from the server
        room.onMessage(function (message) {
            console.log(message)
        });
        
        document.getElementById('startGame').addEventListener('click', function () {
            room.send({ action: 3 });
        });
    });
})

function generatePlayer(input, index, currentPlayer){

    return `
    <div class="col s12" id="select-player-${index}">
        <div class="card">
            <div class="row valign-wrapper">
                <div class="col s4">
                    <img src="img/characters/${input['character']['characterId']}.png" class="responsive-img" style="border-radius: 7px 0 0 7px;">
                </div>
                <div class="col s8">
                    <div class="card-title truncate">${input['username']}</div>
                    <div class="truncate">${input['health']} HP, ${input['money']}$</div>
                    ${input['roomOwner'] ? `<div class="game-badge">Szobafőnök</div>` : ""}
                    ${input['character']['cartell'] ? `<div class="game-badge">Kartell</div>` : ""}
                    ${input['leftout'] ? `<div class="game-badge">Kimarad ${input['leftout']} körből</div>` : ""}
                    ${index == currentPlayer ? `<div class="game-badge">Az ő köre</div>` : ""}
                </div>
            </div>

        </div>
    </div>`
}

function generateCard(input, id){
    return `<img id="card-${id}" src="img/cards/${input['cardId']}.png" class="responsive-img game-card z-depth-1 waves-effect waves-dark ${input['useable'] ? "" : "disabled"}" style="width: 200px;">`;
}