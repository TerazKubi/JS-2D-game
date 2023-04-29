class Combatant {
    constructor(config, battle) {
        Object.keys(config).forEach(key => {
            this[key] = config[key]
        })
        this.hp = typeof(this.hp) === "undefined" ? this.maxHp : this.hp
        this.battle = battle

        // console.log(this.position)
        this.isDeadFlag = false
    }

    get hpPercent() {
        const percent = this.hp / this.maxHp * 100
        return percent > 0 ? percent : 0
    }

    get xpPercent() { return this.xp / this.maxXp * 100 }

    get cpPercent() { return this.cp / this.maxCp * 100 }


    get givesXp(){
        return this.level * 20
    }

    get isDead(){ return this.isDeadFlag}

    createElement() {
        this.hudElement = document.createElement("div")
        this.hudElement.classList.add("Combatant_battle_hud")
        this.hudElement.setAttribute("data-combatant", this.id)
        this.hudElement.setAttribute("data-team", this.team)
        this.hudElement.innerHTML = (`
            <svg viewBox="0 0 22 5" class="Combatant_life-container">     
                <rect x=0 y=1 width="100%" height=2 fill="#ff1100" />
                <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
            </svg>`)
        if(this.team === "player") {
            this.hudElement.innerHTML += 
            (`<svg viewBox="0 0 22 5" class="Combatant_cp-container">     
                <rect x=0 y=1 width="100%" height=1 fill="#264CB9" />
                <rect x=0 y=1 width="0%" height=1 fill="#33FFFE" />
            </svg>`)
        }

        this.hudElement.innerHTML +=
            (`<div class="Combatant_status"></div>
            <div class="Combatant_name">${this.name}</div>`)
        
        
        
        this.combatantElement = document.createElement("div")
        this.combatantElement.classList.add("Combatant")
        this.combatantElement.classList.add("Combatant_pos_" + this.position)
        this.combatantElement.setAttribute("data-team", this.team)
        
        
        const imgDiv = document.createElement("div")
        imgDiv.classList.add("Combatant_image_div")
        const combatantImage = document.createElement("img")
        combatantImage.setAttribute("src", this.src)
        combatantImage.setAttribute("alt", this.name)
        imgDiv.appendChild(combatantImage)
        
        this.combatantElement.appendChild(imgDiv)
        this.combatantElement.appendChild(this.hudElement)
        




        this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect")[1]
        this.cpFills = this.hudElement.querySelectorAll(".Combatant_cp-container > rect")[1]
        

    }

    die(){
        this.isDeadFlag = true
        this.combatantElement.classList.add("Combatant_die")
    }

    update(changes={}) {
        Object.keys(changes).forEach(key => {
            this[key] = changes[key]
        })

        this.hpFills.style.width = this.hpPercent + "%"
        this.cpFills && (this.cpFills.style.width = this.cpPercent + "%")

        // this.xpFills.forEach(rect => rect.style.width = this.xpPercent + "%")

        //status
        const statusElement = this.hudElement.querySelector(".Combatant_status")
        if (this.status) {
            statusElement.innerText = this.status.type
            statusElement.style.display = "block"
        } else {
            statusElement.innerText = ""
            statusElement.style.display = "none"
        }
    }

    getPostEvents(){
        if (this.status?.type === "recover"){
            return [
                {type:"textMessage", text: "Recover some hp"},
                {type:"stateChange", heal: 5, onCaster: true},
            ]
        }
        if (this.status?.type === "bleed"){
            return [
                {type:"textMessage", text: "Bleeding"},
                {type:"stateChange", damage: 10, onCaster: true},
            ]
        }

        return []
    }

    getReplacedEvents(originalEvents){
        if(this.status?.type === "stun" && utils.randomFromArray([true ])) {
            return [
                {type: "textMessage", text: `${this.name} cant move.`}
            ]
        }


        return originalEvents
    }

    decrementStatus() {
        if (this.status?.expiresIn > 0){
            this.status.expiresIn -= 1

            if(this.status.expiresIn === 0) {
                const text = "Status " + this.status.type + " expired."
                this.update({ status: null })
                return {type: "textMessage", text: text}
            }
        }
        return null
    }

    init(container) {
        this.createElement()
        container.appendChild(this.combatantElement)
        this.update()
    }
}