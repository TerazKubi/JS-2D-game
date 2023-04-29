window.Enemies = {
    "mario": {
        name: "mario",
        src: "images/characters/people/erio.png",
        pizzas: {
            "a": {
                pizzaId: "s001",
                maxHp: 50,
                hp:50,
                level: 1,
                speed: 19
            },
            "b": {
                pizzaId: "v001",
                maxHp: 50,
                hp: 50,
                level: 1,
                speed: 19,
            },
            "c": {
                pizzaId: "v002",
                maxHp: 50,
                hp: 50,
                level: 1,
                speed: 21
            },
        }
    },

    "beth": {
        name: "beth",
        src: "images/characters/people/npc1.png",
        pizzas: {
            "a": {
                pizzaId: "v001",
                speed: 19,
                maxHp: 50,
                hp: 1,
                level: 1
            },
            "b": {
                pizzaId: "s001",
                speed: 20,
                maxHp: 50,
                hp: 20,
                level: 1,
                // status: {type: "stun", expiresIn: 3}
                status: null
            },
            // "c": {
            //     pizzaId: "v002",
            //     speed: 21,
            //     maxHp: 50,
            //     level: 1
            // },
            
            
        }
    }
}