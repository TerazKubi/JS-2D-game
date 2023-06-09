class PauseMenu {
    constructor({onComplete}) {
        this.onComplete = onComplete
    }

    getOptions(pageKey){
        if (pageKey === "root") {
            return [
                {
                  label: "Save",
                  description: "Save your progress",
                  handler: () => {
                    //We'll come back to this...
                  }
                },
                {
                  label: "Close",
                  description: "Close the pause menu",
                  handler: () => {
                    this.close();
                  }
                }
            ]
        }
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("PauseMenu")
        this.element.innerHTML = (`
          <h2>Pause Menu</h2>
        `)
      }
    
    close() {
        this.esc?.unbind();
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }
    
    async init(container) {
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions("root"));
    
        container.appendChild(this.element);
    
        utils.wait(200);
        this.esc = new KeyPressListener("Escape", () => {
            this.close();
        })
    }
}