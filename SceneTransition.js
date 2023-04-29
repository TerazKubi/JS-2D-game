class SceneTransition {
    constructor(){
        this.element = null
    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("SceneTransition")
    }

    fadeOut(){
        this.element.classList.add("fade-out")
        this.element.addEventListener("animationend", () => {
            this.element.remove()
        }, {once: true})
    }

    init(constainer, callback){
        this.createElement()
        constainer.appendChild(this.element)

        this.element.addEventListener("animationend", () => {
            callback()
        }, {once: true})
    }
}