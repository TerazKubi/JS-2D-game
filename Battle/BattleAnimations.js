window.BattleAnimations = {
    async atack(event, onComplete) {
        const {caster, targets} = event
        const target = targets[0]

        const element = caster.combatantElement
        const animationClassName = caster.team === "player" ? "battle-atack-right" : "battle-atack-left"
        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName)
        }, {once: true})


        utils.goToAtackingSpot(caster, target)
        await utils.wait(100)

        element.classList.add(animationClassName)
        await utils.wait(300)
        
        
        onComplete()
        await utils.wait(600)
        utils.goToBaseSpot(caster, target)
    },

    async projectile(event, onComplete){
        const {caster, targets} = event
        const target = targets[0]

        let div = document.createElement("div")
        const animationClassName = caster.team === "player" ? "battle-projectile-right" : "battle-projectile-left"
        const animationPositionClassName = caster.team === "player" ? "Battle_pos_right_"+target.position : "Battle_pos_left_"+target.position

        div.addEventListener("onanimationend", () => {
            console.log("animation end")
            div.remove()
        }, {once: true})


        div.classList.add("projectile")
        div.classList.add(animationPositionClassName)
        div.classList.add(animationClassName)

        div.innerHTML = (`
        <svg viewBox="0 0 32 32" width="32" height="32">
            <circle cx="16" cy="16" r="16" fill="${event.color}"/>
        </svg>
        `)
        

        // place attacker on right battle spot
        utils.goToAtackingSpot(caster, target)
        
        await utils.wait(200)
        document.querySelector(".Battle").appendChild(div)

        await utils.wait(820)

        //place attacker on base spot
        utils.goToBaseSpot(caster, target)
        div.remove()

        onComplete()
    },

    async fire(event, onComplete){
        const {caster, targets} = event
        const target = targets[0]
        // console.log("animaion targets: ",targets)

        utils.goToAtackingSpot(caster, target)

        await utils.wait(100)

        targets.forEach(async target => {
            const animationPositionClassName = caster.team === "player" ? "Combatant_pos_"+target.position : "Combatant_pos_"+target.position
            const div = document.createElement("div")
            div.classList.add("fire_container")
            div.classList.add(animationPositionClassName)
            div.style.transform = target.team === "enemy" ? "translateX(-14%)" : "translateX(14%)"
            div.setAttribute("data-team", target.team)
            div.innerHTML = (`
                <img src="images/fire/png/orange/start/burning_start_1.png" alt="fire" class="fire_frame">
                <img src="images/fire/png/orange/loops/burning_loop_1.png" alt="fire" class="fire_frame">
                <img src="images/fire/png/orange/end/burning_end_1.png" alt="fire" class="fire_frame">
            `)    


            const image = div.querySelectorAll(".fire_frame")
            let frameWidth = 192 / 8
            const skipFrames = [-72, -168, -96]
            const frameTime = 50

            
            document.querySelector(".Battle").appendChild(div)

            for(let i=0; i < image.length; i++){
                let x = 0
                image[i].style.display = "block"
                while(x>= skipFrames[i]){
                    image[i].style.objectPosition = `${x}px 0px`
                    await utils.wait(frameTime)
                    x -= frameWidth
                    // console.log(x)
    
                    // if (x <= -72) x = 0
                }
                image[i].style.display = "none"
                
            }
    
    
            
            
            div.remove()
        });

        

        

        

        
        
        onComplete()
        await utils.wait(700)
        utils.goToBaseSpot(caster, target)
        // await utils.wait(1000)
    }

}