const utils = {
    withGrid(n){
        return n * 16
    },
    asGridCoord(x,y){
        return `${x*16},${y*16}`
    },
    nextPosition(initX, initY, dir){
        let x = initX
        let y = initY
        let size = 16
        if(dir === "left") x -= size
        else if (dir === "right") x += size
        else if (dir === "up") y -= size
        else if (dir === "down") y += size

        return {x,y}
    },
    oppositeDirection(direction){
        if(direction === "left") return "right"
        if(direction === "right") return "left"
        if(direction === "up") return "down"
        return "up"
    },

    emitEvent(name, detail){
        const event = new CustomEvent(name, {detail})
        document.dispatchEvent(event)
    },

    wait(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
               resolve() 
            }, ms)
        })
    },

    randomFromArray(array){
        return array[ Math.floor(Math.random() * array.length)]
    },

    goToAtackingSpot(caster, target){
        caster.combatantElement.classList.remove("Combatant_pos_"+caster.position)
        caster.combatantElement.classList.add(`Battle_pos_${caster.team === "player"?"right_":"left_"}`+target.position)
        caster.hudElement.style.opacity = 0
    },
    goToBaseSpot(caster, target){
        caster.combatantElement.classList.remove(`Battle_pos_${caster.team === "player"?"right_":"left_"}`+target.position)
        caster.combatantElement.classList.add("Combatant_pos_"+caster.position)
        caster.hudElement.style.opacity = 1
    },
}