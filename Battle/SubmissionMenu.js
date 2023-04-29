class SubmissionMenu {
    constructor({ caster, targets, friendlyTargets, onComplete, items}) {
        this.onComplete = onComplete
        
        this.caster = caster,
        this.targets = targets
        this.friendlyTargets = friendlyTargets


        let quantityMap = {}
        items.forEach(item => {
            if(item.team === caster.team) {

                let existing = quantityMap[item.actionId]
                if (existing) {
                    existing.quantity += 1
                } else {
                    quantityMap[item.actionId] = {
                        actionId: item.actionId,
                        quantity: 1,
                        instanceId: item.instanceId,
                    }
                }               
            }
        });

        this.items = Object.values(quantityMap)
    }

    getPages() {
        const backOption = {
            label: "Back",
            description: "Return to previous page",
            handler: () => {
                // this.keyboardMenu.setOptions(this.getPages().root)
                this.back()
            }
        }
        return {
            root: [
                {
                    label: "Attack",
                    description: "Attack with your weapon",
                    handler: () => {                        
                        this.chosenAction = Actions["baseAttack"]
                        this.keyboardMenu.setOptions( this.getPages().targets)
                    }
                },
                {
                    label: "Skills",
                    description: "Choose an attack",
                    handler: () => {
                        this.keyboardMenu.setOptions( this.getPages().attacks)
                    }
                },
                {
                    label: "FocusChakra",
                    description: "disabled",
                    handler: () => {
                        console.log("items page")
                    },
                    disabled: true
                },
                {
                    label: "Dodge",
                    description: "disabled",
                    handler: () => {
                        console.log("items page")
                    },
                    disabled: true
                },
                {
                    label: "Items",
                    description: "Choose an item",
                    handler: () => {
                        this.keyboardMenu.setOptions( this.getPages().items)
                    }
                },
                {
                    label: "Run",
                    description: "disabled",
                    handler: () => {
                        console.log("items page")
                    },
                    disabled: true
                },

            ],
            attacks: [
                ...this.caster.actions.filter(a => a !== "baseAttack").map(key => {
                    const action = Actions[key]
                    let isDisabled = this.caster.cp < Actions[key].cpCost

                    return {
                        label: action.name,
                        description: action.description || "",
                        disabled: isDisabled,
                        handler: () => {
                            if(action.targetType === "self"){
                                this.menuSubmit({action, target: [this.caster]})
                            } else if (action.targetType === "friend"){
                                this.chosenAction = action
                                this.keyboardMenu.setOptions( this.getPages().friendlyTargets)
                            } else if (action.targetType === "team"){
                                // console.log(this.friendlyTargets)
                                this.menuSubmit({action, target: this.friendlyTargets})
                            } else if(action.targetType === "enemyTeam"){
                                this.menuSubmit({action, target: this.targets})
                            }
                            else {
                                //default option; chose one target from enemy team
                                this.chosenAction = action
                                this.keyboardMenu.setOptions( this.getPages().targets)
                            
                            }
                            
                        },
                        right: () => {
                            return "CP:" + action.cpCost
                        },
                    }
                }),
                backOption
            ],
            targets: this.getTargetOptions("enemy"),
                
            friendlyTargets: this.getTargetOptions("friendly"),

            items: [
                ...this.items.map(item => {
                    const action = Actions[item.actionId]
                    return {
                        label: action.name,
                        description: action.description,
                        right: () => {
                            return "x"+item.quantity
                        },
                        handler: () => {
                            this.menuSubmit(action, null, item.instanceId)
                        }
                    }
                }),
                backOption
            ]
        }
    }

    getTargetOptions(targetsType){
        const targets = targetsType === "friendly" ? this.friendlyTargets : this.targets
        const options = []
        Object.values(targets).forEach(target =>{
            options.push({
                label: target.name,
                handler: () => {
                    // console.log(`do atack: ${this.chosenAction.name} on target: ${target.name}`)
                    this.menuSubmit({action: this.chosenAction, target: [target]})
                }
            })
        })
        options.push({
            label: "Back",
            description: "Return to previous page",
            handler: () => {
                // this.keyboardMenu.setOptions(this.getPages().attacks)
                this.back()
            }
        })
        return options
    }
    back(){
        this.keyboardMenu.setOptions(this.getPages().root)
    }

    menuSubmit({action, target, instanceId}) { // returns submission in turn cycle
        // console.log("menu submit target", target)
        // console.log("submit menu // Submission Menu")
        this.keyboardMenu?.end()
        this.esc?.unbind()
        this.onComplete({
            action: action,
            caster: this.caster,
            targets: target,
            instanceId
        })
    }

    // enemy ai chose move and target
    decide(){
        //chose action for enemy
        const action = Actions[ this.caster.actions[1]]

        //chose target for enemy
        let target
        if (action.targetType === "enemyTeam"){
            target = this.targets
        } else {
            target = [this.targets[0]] 
        }

        this.menuSubmit({action: action, target: target})
    }

    showMenu(container) {
        this.keyboardMenu = new BattleKeyboardMenu()
        this.keyboardMenu.init(container)
        this.keyboardMenu.setOptions( this.getPages().root)
    }

    init(container) {
        if (this.caster.isPlayerControlled) {
            //show ui
            this.esc = this.esc = new KeyPressListener("Escape", () => {
                this.back();
            })
            this.showMenu(container)
        } else {
            this.decide()

        }
    }
}