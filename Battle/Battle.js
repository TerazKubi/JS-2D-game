class Battle{
    constructor({ enemy, onComplete }) {
        this.enemy = enemy
        this.onComplete = onComplete

        this.combatants = {
            
        }

        //add player team
        window.playerState.lineup.forEach((id,index) => {
            this.addCombatant(id, "player", window.playerState.pizzas[id], index+1)
        })
        //add enemies
        Object.keys(this.enemy.pizzas).forEach((key, index) => {
            this.addCombatant("e_"+key, "enemy", this.enemy.pizzas[key], index+1)
        })
        
        

        this.items = []

        window.playerState.items.forEach(item => {
            this.items.push({
                ...item,
                team: "player"
            })
        })

        this.usedInstanceIds = {}

        this.turnOrder = []
        this.turnOrderIndex = 0
    }

    
    shiftTurnOrder(){
        // this.turnOrderIndex += 1
        // if (this.turnOrderIndex >= this.turnOrder.length) this.turnOrderIndex = 0
        // const combatant = this.combatants[this.turnOrder[this.turnOrderIndex].id]
        const swap = this.turnOrder.shift()
        this.turnOrder.push(swap)
        if(swap.getIsDead) this.shiftTurnOrder()
        // this.activeCombatants[swap.team] = swap.id

        this.updateTurnOrderHud()

    }

    addCombatant(id, team, config, position){
        this.combatants[id] = new Combatant({
            ...Pizzas[config.pizzaId],
            ...config,
            team: team,
            isPlayerControlled: team === "player",
            position: position
        }, this)

        // this.activeCombatants[team] = this.activeCombatants[team] || id
    }

    get currentTurnCombatant(){
        return this.turnOrder[this.turnOrderIndex]
    }

    removeCombatant(target){ // target is Combatant class
        
        
        target.die()

        
        this.turnOrder = this.turnOrder.filter(c => !c.isDead)
        this.updateTurnOrderHud()

    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("Battle")

        this.turnHudElement = document.createElement("div")
        this.turnHudElement.classList.add("Battle_turn_hud")
        this.element.appendChild(this.turnHudElement)
        
    }
    updateTurnOrderHud(){
        this.turnHudElement.innerHTML =""
        this.turnOrder.forEach(combatant => {
            this.turnHudElement.innerHTML += `<div class="${combatant.team === "player"?"turn_hud_player":"turn_hud_enemy"}">${combatant.id}</div>`
        })
    }

    initTurnOrder(){     
        this.turnOrder = Object.values(this.combatants).sort((a,b) => {return a.speed - b.speed}).reverse()
    }

    init(containter) {
        
        this.createElement()
        containter.appendChild(this.element)
        
        //add ids to all combatants
        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key]
            combatant.id = key
            combatant.init(this.element)
        })
        
        this.initTurnOrder()
        this.updateTurnOrderHud()


        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: (event) => {
                return new Promise(res => {
                    const battleEvent = new BattleEvent(event, this)
                    battleEvent.init(res)
                })
            },
            onWinner: (winner) => {

                //updata player state
                if (winner === "player"){
                    const playerState = window.playerState
                    Object.keys(playerState.pizzas).forEach(id => {
                        const playerStatePizza = playerState.pizzas[id]
                        const combatant = this.combatants[id]
                        if (combatant) {
                            playerStatePizza.hp = combatant.hp
                            playerStatePizza.xp = combatant.xp
                            playerStatePizza.maxXhp = combatant.maxXp
                            playerStatePizza.level = combatant.level
                        }
                    })

                    playerState.items = playerState.items.filter(item => {
                        return !this.usedInstanceIds[item.instanceId]
                    })

                    //update hud
                    utils.emitEvent("playerStateUpdated")

                }

                this.element.remove()
                this.onComplete(winner === "player")
            }
        })

        this.turnCycle.init()
    }
}