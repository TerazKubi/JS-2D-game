class Overworld {
    constructor(config){
        this.element = config.element
        this.canvas = this.element.querySelector(".game-canvas")
        this.ctx = this.canvas.getContext("2d")

        this.map = null
    }

    startGameLoop(){
        const step= ()=>{

            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)


            //camera
            const cameraPerson = this.map.gameObjects.hero

            //update all objects
            Object.values(this.map.gameObjects).forEach( object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                })
            })

            this.map.drawLowerImage(this.ctx, cameraPerson)

            //drawing all objects from map
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y - b.y
            }).forEach( object => {
                object.sprite.draw(this.ctx, cameraPerson)
            })

            this.map.drawUpperImage(this.ctx, cameraPerson)

            if(!this.map.isPaused) {
                requestAnimationFrame(() => {
                    step()
                })
            }
            
        }
        step()
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            this.map.checkForActionCutscene()
        })

        new KeyPressListener("Escape", () => {
            if (!this.map.isCutscenePlaying) {
                this.map.startCutscene([
                    { type: "pause" }
                ])
            }
        })
    }

    bindHeroPositonCheck(){
        document.addEventListener("PersonWalkingComplete", (e) => {
            if (e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene()
            }
        })

    }


    startMap(mapConfig){
        this.map = new OverworldMap(mapConfig)
        this.map.overworld = this
        this.map.mountObjects()
    }

    init(){
        this.hud = new Hud()
        this.hud.init(document.querySelector(".game-container"))

        this.startMap(window.OverworldMaps.DemoRoom)

        this.bindActionInput()
        this.bindHeroPositonCheck()

        this.directionInput = new DirectionInput()
        this.directionInput.init()

        this.startGameLoop()

        // this.map.startCutscene([
        //     // {type: "changeMap", map: "Kitchen"}
        //     // { who: "hero", type: "walk", direction: "down"},
        //     // // { who: "hero", type: "walk", direction: "down"},
        //     // { who: "npc1", type: "walk", direction: "left"},
        //     // { who: "npc1", type: "walk", direction: "up"},
        //     // // { who: "npc1", type: "stand", direction: "up", time: 1000},
        //     // { type: "textMessage", text: "siema"}
        //     // { type: "battle", enemyId: "beth"}
        // ])

        this.map.startCutscene([
            { type: "battle", enemyId: "mario"},
            // { type: "textMessage", text: "round2"},
            // { type: "battle", enemyId: "beth"},
        ])


    }
}