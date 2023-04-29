class BattleEvent {
    constructor(event, battle) {
        this.event = event
        this.battle = battle

        // console.log(this.event)
    }

    textMessage(resolve){

        // console.log(this.event)
        const text = this.event.text
        .replace("{CASTER}", this.event.caster?.name)
        .replace("{TARGET}", this.event.targets?.name)
        .replace("{ACTION}", this.event.action?.name)

        // console.log(text)

        const message = new TextMessage({
            text: text,
            onComplete: () => {
                resolve()
            }
        })
        message.init( this.battle.element)
    }

    async stateChange(resolve){
        // console.log("BATTLE EVENT:", this.event)
        const {damage, heal, status} = this.event

        this.event.targets = this.event.onCaster? [this.event.caster] : this.event.targets 

        this.event.targets.forEach( (target) => {

            if(damage) {
                target.update({
                    hp: target.hp - damage
                })
    
                //blink animation
                target.combatantElement.classList.add("battle-damage-blink")
            }
    
    
            if(heal) {
                let newHp = target.hp + heal
    
                if(newHp > target.maxHp) newHp = target.maxHp
    
                target.update({
                    hp: newHp
                })
            }


            if(status){
                target.update({
                    status: status
                })
            }
       
    
            if(status === null) {
                who.update({
                    status: null
                })
            }


        })
        
        

        

        

        

        await utils.wait(600)

        this.event.targets.forEach(target => {
            target.combatantElement.classList.remove("battle-damage-blink")
        })
        resolve()
    }

    submissionMenu(resolve){
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            targets: this.event.targets,
            friendlyTargets: this.event.friendlyTargets,
            items: this.battle.items,
            onComplete: (submission) => {
                resolve(submission)
            }
        })
        menu.init(this.battle.element)
    }

    giveXp(resolve){
        let amount = this.event.xp
        const {combatant} = this.event
        const step = () => {
            if(amount > 0) {
                amount -= 1
                combatant.xp += 1

                //if more then maxxp
                if(combatant.xp === combatant.maxXp){
                    combatant.xp = 0
                    combatant.maxXp = 100
                    combatant.level += 1
                }

                combatant.update()
                requestAnimationFrame(step)
                return
            }
            resolve()
        }
        requestAnimationFrame(step)
    }

    animation(resolve){
        const fn = BattleAnimations[this.event.animation]
        fn(this.event, resolve)
    }


    init(resolve){
        this[this.event.type](resolve)
    }
}