window.onload = function () {

    const ws = window.location.protocol.includes('https') ? new WebSocket(`wss://${window.location.hostname}`) : new WebSocket(`ws://${window.location.hostname}:8012`)

    // ws.onopen = () => {
    //     console.log('Connected to WebSocket server')
    // }

    let waiting = true
    let waitingMessage = false

    ws.onmessage = (event) => {
        const message = event.data
        // console.log(`Received message: ${message}`)

        document.getElementById('chat').innerHTML += `<p>${message}</p>`
    }

    // ws.onclose = () => {
    //     console.log('WebSocket connection closed')
    // }

    document.getElementById('message-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const input = document.getElementById('message')
        // console.log(`Sending message: ${message}`)
        ws.send(input.value)
        input.value = ''
    })

}