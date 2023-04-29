class TurnCycle {
    constructor({battle, onNewEvent, onWinner}) {
        this.battle = battle
        this.onNewEvent = onNewEvent // creates new battle event
        this.onWinner = onWinner
    }

    async turn(){
        const caster = this.battle.currentTurnCombatant
        const casterId = caster.id
        // console.log("new turn")

        const enemyTeam = caster.team === "player" ? "enemy" : "player"
        
        const targets = Object.values(this.battle.combatants).filter(c => !c.isDead && c.team === enemyTeam)
        const friendlyTargets = Object.values(this.battle.combatants).filter(c => !c.isDead && c.team === caster.team)

        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            targets,
            friendlyTargets
        })

        console.log("SUBMISSION: ", submission)

        //is submission a USE ITEM
        if(submission.instanceId) {
            this.battle.usedInstanceIds[submission.instanceId] = true
            this.battle.items = this.battle.items.filter(item => item.instanceId !== submission.instanceId)
        }

        const resultingEvents = caster.getReplacedEvents(submission.action.success)

        for(let j=0; j<resultingEvents.length;j++){
            const event = {
                ...resultingEvents[j],
                submission,
                action: submission.action,
                caster: submission.caster,
                targets: submission.targets
            }
            await this.onNewEvent(event)

        }     
        //check for dead
        let isEnd = await this.checkForDead()
        if(isEnd) return


        //check for post events
        // do thing after your turn submission
        const postEvents = caster.getPostEvents()
        for(let i=0; i<postEvents.length; i++){
            const event = {
                ...postEvents[i],
                submission,
                action: submission.action,
                caster,
                targets: submission.targets

            }
            await this.onNewEvent(event)
        }

        //check for dead
        isEnd = await this.checkForDead()
        if(isEnd) return


        //check for status expire
        const expiredEvent = caster.decrementStatus()
        if (expiredEvent) {
            await this.onNewEvent(expiredEvent)
        }


        this.battle.shiftTurnOrder()

        // console.log("b4 next turn")

        this.turn()
    }

    getWinningTeam(){
        let aliveTeams = {}
        Object.values(this.battle.combatants).forEach(combatant => {
            if(combatant.hp > 0) {
                aliveTeams[combatant.team] = true
            }
        })
        if(!aliveTeams["player"]) { return "enemy"}
        if(!aliveTeams["enemy"]) { return "player"}
        return null
    }

    async checkForDead(callback){
        const arr = Object.values(this.battle.combatants)
            
        for (let i=0; i<arr.length; i++){
            const target = arr[i]
            if(target.isDead) continue
            const targetDead = target.hp <=0

            if(targetDead){
                await this.onNewEvent({
                    type: "textMessage", text: `${target.name} died`
                })
                //target died so remove him from turnCombatants
                this.battle.removeCombatant(target) 
            }
        }

        //do we have a winner team
        let winner = this.getWinningTeam()
        if(winner){
            await this.onNewEvent({
                type:"textMessage",
                text: "Winner!"
            })

            //end batle
            this.onWinner(winner)
            return true
        }
        return false
    }

    async init(){
        await this.onNewEvent({
            type: "textMessage",
            text: `${this.battle.enemy.name} started fight with you`
        })

        this.turn()
    }
}