class KeyPressListener{
    constructor(keyCode, callback){
        let keySafe = true
        this.keydownFunction = (event) => {
            if (event.code === keyCode) {
                if (keySafe) {
                    keySafe = false
                    callback()
                }
            }
        }
        this.keyupFunction = (event) => {
            if (event.code === keyCode) {
                keySafe = true
            }
        }

        document.addEventListener("keydown", this.keydownFunction)
        document.addEventListener("keyup", this.keyupFunction)
        // console.log("bind key press listener")
    }

    unbind() {
        document.removeEventListener("keydown", this.keydownFunction)
        document.removeEventListener("keyup", this.keyupFunction)
        // console.log("unbiind")
    }


}