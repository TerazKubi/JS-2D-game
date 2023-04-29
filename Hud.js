class Hud {
    constructor(params) {
        this.scoreBoards = []
    }

    update(){
        this.scoreBoards.forEach(s => {
            s.update(window.playerState.pizzas[s.id])
        })
    }

    createElement(){

        if (this.element){
            this.element.remove()
            this.scoreBoards = []
        }


        this.element = document.createElement("div")
        this.element.classList.add("Hud")

        const {playerState} = window
        playerState.lineup.forEach(key => {
            const pizza = playerState.pizzas[key]
            const scoreBoard = new Combatant({
                id: key,
                ...Pizzas[pizza.pizzaId],
                ...pizza,
                position: null
            }, null)
            scoreBoard.createElement()
            this.scoreBoards.push(scoreBoard)
            this.element.appendChild(scoreBoard.hudElement)
        })

        this.update()
    }

    init(container){
        this.createElement();
        container.appendChild(this.element)

        document.addEventListener("playerStateUpdated", () => {
            this.update()
        })
    }
}