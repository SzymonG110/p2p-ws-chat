window.onload = () => {
    const ws = window.location.protocol.includes('https') ? new WebSocket(`wss://${window.location.hostname}`) : new WebSocket(`ws://${window.location.hostname}:8012`)
    const input = document.getElementById('message')
    let roomId = undefined

    ws.onopen = () => {
        console.log('Connected to WebSocket server')
        ws.send(JSON.stringify({a: 'room:join'}))
    }

    ws.onmessage = (event) => {
        const response = JSON.parse(event.data)
        console.log(`Received message: ${response.m}`)
        if (response.a === 'room:joined') {
            roomId = response.roomId
        }

        document.getElementById('chat').innerHTML += `<p>${response.m}</p>`
    }

    ws.onclose = () => {
        console.log('WebSocket connection closed')
    }

    document.getElementById('message-form').addEventListener('submit', (e) => {
        e.preventDefault()
        console.log(`Sending message: ${input.value}`)
        ws.send(JSON.stringify({a: 'room:send', m: input.value, roomId}))
        input.value = ''
        console.log(roomId)
    })
}