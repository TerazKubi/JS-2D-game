class RevealingText{
    constructor(config){
        this.element = config.element
        this.text = config.text
        this.speed = config.speed || 70

        this.timeout = null
        this.isDone = false
    }

    revealOneCharacter(characters){
        const next = characters.splice(0,1)[0]
        next.span.classList.add("revealed")

        if(characters.length > 0){
            this.timeout = setTimeout(()=>{
                this.revealOneCharacter(characters)
            }, next.delayAfter)
        } else {
            this.isDone = true
        }
    }

    warpToDone(){
        clearTimeout(this.timeout)
        this.isDone = true
        this.element.querySelectorAll("span").forEach(span => {
            span.classList.add("revealed")
        })
    }


    init(){
        let characters = []

        this.text.split("").forEach(char => {
            let span = document.createElement("span")
            span.textContent = char
            this.element.appendChild(span)

            characters.push({
                span,
                delayAfter: char === " " ? 0 : this.speed
            })
        })

        this.revealOneCharacter(characters)


    }


}