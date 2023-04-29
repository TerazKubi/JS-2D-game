class BattleKeyboardMenu{
    constructor(config={}) {
        // super(config)
        this.options = []
        this.up = null
        this.down = null
        this.prevFocus = null
        this.descriptionContainer = config.descriptionContainer || null
    }

    setOptions(options) {
        this.options = options
        this.element.innerHTML = this.options.map((option, index) => {
            const disabledAttr = option.disabled === true ? "disabled" : ""

            return (`
                <div class="option">
                    <button ${disabledAttr} data-button="${index}" data-description="${option.description}"> 
                        ${option.label}
                    </button>
                    <span class="right"> ${option.right ? option.right() : ""} </span>
                </div>
            `)
        }).join("")

        this.element.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                const chosenOption = this.options[Number(button.dataset.button)]
                chosenOption.handler()
            })
            button.addEventListener("mouseenter", () => {
                button.focus()
            })
            button.addEventListener("focus", () => {
                this.prevFocus = button
                this.descriptionElementText.innerText = button.dataset.description
            })
        })

        setTimeout(() => {
            this.element.querySelector("button[data-button]:not([disabled])").focus();
        }, 10)

    }

    createElement() {
        this.element = document.createElement("div")
        this.element.classList.add("BattleKeyboardMenu")

        this.descriptionElement = document.createElement("div");
        this.descriptionElement.classList.add("DescriptionBox");
        this.descriptionElement.innerHTML = (`<p>I will provide information!</p>`);
        this.descriptionElementText = this.descriptionElement.querySelector("p");

    }

    end(){
        this.element.remove()
        this.descriptionElement.remove()

        this.left.unbind()
        this.right.unbind()
        // console.log("battle keyboard menu ended")
    }

    init(container) {
        this.createElement()
        this.descriptionContainer ? this.descriptionContainer.appendChild(this.descriptionElement) : container.appendChild(this.descriptionElement)
        // (this.descriptionContainer || container).appendChild(this.descriptionElement)
        container.appendChild(this.element)

        this.left = new KeyPressListener("ArrowLeft", () => {
            // console.log(this.prevFocus)
            const current = Number(this.prevFocus.getAttribute("data-button"))
            const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
                return el.dataset.button < current && !el.disabled
            })
            prevButton?.focus()
        })

        this.right = new KeyPressListener("ArrowRight", () => {
            const current = Number(this.prevFocus.getAttribute("data-button"))
            const nextButton = Array.from(this.element.querySelectorAll("button[data-button")).find(el => {
                return el.dataset.button > current && !el.disabled
            })
            nextButton?.focus()

        })
    }
}