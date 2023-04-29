class PlayerState {
    constructor() {
        this.pizzas = {
            "p1": {
                pizzaId: "hero1",
                hp: 50,
                maxHp: 50,
                
                cp: 10,
                maxCp: 120,

                xp: 0,
                maxXp: 100,
                
                level: 1,
                speed: 25,
                status: null,
            },
            "p2": {
                pizzaId: "hero2",
                hp: 50,
                maxHp: 50,

                cp: 30,
                maxCp: 120,
                
                xp: 0,
                maxXp: 100,
                
                level: 1,
                speed: 21,
                status: null,
            },
            "p3": {
                pizzaId: "hero3",
                
                cp: 40,
                maxCp: 120,
                
                hp: 50,
                maxHp: 50,

                xp: 0,
                maxXp: 100,
                
                level: 1,
                speed: 22,
                status: null,
            },
        }
        
        this.lineup = ["p1","p2","p3"],
        this.items = [
            {actionId: "item_recoverStatus", instanceId: "item1"},
            {actionId: "item_recoverStatus", instanceId: "item2"},
        ]


        this.storyFlags = {
            // TALKED_TO_ERIO: true
        }
    }
}
window.playerState = new PlayerState()