window.Actions = {
    baseAttack: {
        name: "normal atack",
        cpCost: 0,
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            {type: "animation", animation: "atack"},
            {type: "stateChange", damage: 10}
        ]
    },

    // ========================= damage skills ===========================
    fireball: {
        name: "Fireball",
        description: "Fire ball 20dmg",
        cpCost: 30,
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            // {type: "animation", animation: "projectile", color: "#FF0000"},
            {type: "animation", animation: "fire", },
            {type: "stateChange", damage: 20 }
        ]
    },
    aoeDmg: {
        name: "aoe dmg",
        description: "dmg all enemies dmg: 10",
        cpCost: 50,
        targetType: "enemyTeam",
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            {type: "animation", animation: "fire"},
            {type: "stateChange", damage: 10 }
        ]
    },

    // ========================= heal skills ===========================
    heal: {
        name: "heal",
        description: "heal one from team",
        targetType: "friend",
        cpCost: 30,
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            {type: "stateChange", heal: 30, },
        ]
    },
    healAll: {
        name: "t_heal",
        description: "heal whole team",
        targetType: "team",
        cpCost: 50,
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            {type: "stateChange", heal: 10}
        ]
    },

    // ========================= status skills ===========================
    recoverStatus: {
        name: "recover",
        description: "get recover status on self",
        targetType: "self",
        cpCost: 20,
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            {type: "stateChange", onCaster:true, status: {type: "recover", expiresIn: 3}}
        ]
    },
    bleed: {
        name: "bleed",
        description: "make your opponent bleed",
        cpCost: 20,
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            {type: "animation", animation: "atack"},
            {type: "stateChange", status: {type: "bleed", expiresIn: 3}}
        ]
    },
    aoeBleed: {
        name: "aoe bleed",
        description: "enemy team bleed",
        targetType: "enemyTeam",
        cpCost: 40,
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            {type: "stateChange", status: {type: "bleed", expiresIn: 3}},
        ]
    },
    stunStatus: {
        name: "Stun",
        description: "stun one enemie",
        cpCost: 30,
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}"},
            {type: "animation", animation: "projectile", color: "#FF0000"},
            {type: "stateChange", status: {type: "stun", expiresIn: 3}},
            {type: "textMessage", text: "{TARGET} is stuned"},
        ]
    },



    
    //================================= items =============================================
    item_recoverStatus: {
        name: "heal bandage",
        description: "heal 30hp",
        targetType: "friendly",
        success: [
            {type: "textMessage", text: "{CASTER} uses a {ACTION}"},
            {type: "stateChange", healSelf: 30, onCaster:true}
        ]
    }
}