class OverworldMap {
    constructor(config) {
        this.overworld = null
        this.gameObjects = {}
        this.configObjects = config.configObjects
        this.cutsceneSpaces = config.cutsceneSpaces || {}
        this.walls = config.walls || {}

        this.lowerImage = new Image()
        this.lowerImage.src = config.lowerSrc
        
        this.upperImage = new Image()
        this.upperImage.src = config.upperSrc

        this.isCutscenePlaying = false
        this.isPaused = false
    }

    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
    }

    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x, y} = utils.nextPosition(currentX, currentY, direction)
        if(this.walls[`${x},${y}`]){
            return true
        }

        return Object.values(this.gameObjects).find(obj => {
            if (obj.x === x && obj.y === y) return true
            if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y) return true
            return false
        })
    }

    mountObjects(){
        // console.log(this.configObjects)
        Object.keys(this.configObjects).forEach(key => {
            let object = this.configObjects[key]
            object.id = key

            let instance
            if(object.type === "Person") {
                instance = new Person(object)
            }
            this.gameObjects[key] = instance
            this.gameObjects[key].id = key

            instance.mount(this)
        })
    }

    async startCutscene(events){
        this.isCutscenePlaying = true

        // start a cutscene loop
        for(let i=0; i < events.length; i++){
            const eventHandler = new OverworldEvent({
                map: this,
                event: events[i],
            })
            const result = await eventHandler.init()
            if(result === "LOST_BATTLE") {
                break
            }
        }

        
        // console.log("cutrscene ended")
        this.isCutscenePlaying = false

        //reset npc ide behavior
        // Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"]
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction)

        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        })

        if (!this.isCutscenePlaying && match && match.talking.length) {

            const relevantScenario = match.talking.find(scenario => {
                return (scenario.required || []).every(sf => {
                    return playerState.storyFlags[sf]
                })
            })

            relevantScenario && this.startCutscene(relevantScenario.events)

            // this.startCutscene(match.talking[0].events)
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"]
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]

        if(!this.isCutscenePlaying && match) {
            this.startCutscene( match[0].events)
        }
    }



    
}


window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "images/maps/DemoLower.png",
        upperSrc: "images/maps/DemoUpper.png",
        configObjects: {
            hero: {
                type: "Person",
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                isPlayer: true
            },
            npc1: {
                type: "Person",
                x: utils.withGrid(6),
                y: utils.withGrid(9),
                src: "images/characters/people/npc1.png",
                behaviorLoop: [
                    {type: "stand", direction: "left", time: 800},
                    {type: "stand", direction: "up", time: 1200},
                    {type: "stand", direction: "right", time: 800},
                    {type: "stand", direction: "up", time: 500},
                ],
                talking: [
                    {
                        required: ["DEFEATED_ERIO"],
                        events: [
                            { type: "textMessage", text: "u beat that guy over there nice", faceHero: "npc1"},
                        ]
                    },
                    {
                        events: [
                            { type: "textMessage", text: "siema go fight that guy over there", faceHero: "npc1"},
                            // { type: "battle", enemyId: "beth" }
                            // { type: "textMessage", text: "siehehehema"},
                            // { who: "hero", type: "walk", direction: "left"},
                        ]
                    },
                ]
            },
            npc2: {
                type: "Person",
                x: utils.withGrid(4),
                y: utils.withGrid(7),
                src: "images/characters/people/erio.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "walkajd", faceHero: "npc1"},
                            { type: "battle", enemyId: "mario" },
                            { type: "addStoryFlag", flag: "DEFEATED_ERIO"  },
                            { type: "textMessage", text: "aaaaaaa i lost", faceHero: "npc1"},
                            // { type: "textMessage", text: "siehehehema"},
                            // { who: "hero", type: "walk", direction: "left"},
                        ]
                    },
                ],
                behaviorLoop: [
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},
                    {type: "stand", direction: "up", time: 800},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "right"},
                    {type: "stand", direction: "down", time: 1000},
                    {type: "walk", direction: "down"},
                ]
            }
        },
        walls: {
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7,4)] : [
                {
                    events: [
                        {who: "npc2", type: "walk", direction: "left"},
                        {who: "npc2", type: "stand", direction: "up", time: 500},
                        {type: "textMessage", text: "Wynocha gnoju"},
                        {who: "npc2", type: "walk", direction: "right"},

                        {who: "hero", type: "walk", direction: "down"},
                        {who: "hero", type: "walk", direction: "left"},
                    ]
                }
            ],
            [utils.asGridCoord(5,10)] : [
                {
                    events: [
                        // {type: "textMessage", text: "kuchnia"},
                        {type: "changeMap", map: "Kitchen"}
                    ]
                }
            ]
        }
    },
    Kitchen: {
        lowerSrc: "images/maps/KitchenLower.png",
        upperSrc: "images/maps/KitchenUpper.png",
        configObjects: {
            hero: {
                type: "Person",
                isPlayer: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5),
            },
            npc1: {
                type: "Person",
                x: utils.withGrid(10),
                y: utils.withGrid(6),
                src: "images/characters/people/npc1.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "siema w kuchniaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", faceHero: "npc1"},
                        ]
                    },
                ]
            },
            
        }
    }
}