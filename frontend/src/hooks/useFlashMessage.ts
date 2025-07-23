import bus from "../utils/bus"

export default function useFlashMessage() {

    function setFlashMessage(msg:string, type:string) {
        bus.emit('flash', {
            message: msg,
            type: type,
        })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return { setFlashMessage }
}



