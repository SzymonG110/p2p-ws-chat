window.onload = () => {
    const input = document.getElementById('message')
    const chat = document.getElementById('chat')
    let ws = undefined
    let roomId = undefined

    document.getElementById('connect').addEventListener('click', () => {
        document.getElementById('chat').innerHTML = '<p>Łączenie...</p>'

        document.getElementById('connect').style.setProperty('display', 'none')
        document.getElementById('disconnect').style.setProperty('display', 'block')

        ws = window.location.protocol.includes('https') ? new WebSocket(`wss://${window.location.hostname}`) : new WebSocket(`ws://${window.location.hostname}:8003`)

        ws.onopen = () => {
            // console.log('Connected to WebSocket server')
            ws.send(JSON.stringify({a: 'room:join'}))
        }

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data)
            // console.log(`Received message: ${response.m}`)

            if (response.a === 'room:joined') {
                roomId = response.roomId
                chat.innerHTML = ''
                chat.innerHTML += `<p>Połączono!</p>`

            } else if (response.a === 'room:received') chat.innerHTML += `<p>Rozmówca: ${response.m}</p>`

            else if (response.a === 'room:sent') chat.innerHTML += `<p>Ty: ${response.m}</p>`

            else if (response.a === 'room:partner_disconnected') {
                roomId = undefined

                chat.innerHTML += `<p>Rozmówca rozłączył się!</p>`
                document.getElementById('disconnect').style.setProperty('display', 'none')
                document.getElementById('connect').style.setProperty('display', 'block')
            }
        }

        // ws.onclose = () => console.log('WebSocket connection closed')
    })

    document.getElementById('disconnect').addEventListener('click', () => {
        if (ws) {
            ws.close()
            roomId = undefined
            document.getElementById('disconnect').style.setProperty('display', 'none')
            document.getElementById('connect').style.setProperty('display', 'block')

            if (chat.innerHTML.includes("Łączenie...")) chat.innerHTML = `<p>Rozłączono!</p>`
            else chat.innerHTML += `<p>Rozłączyłeś się!</p>`
        }
    })

    document.getElementById('message-form').addEventListener('submit', (e) => {
        e.preventDefault()
        if (!ws || ws.readyState !== WebSocket.OPEN || !roomId) return
        if (input.value.trim() === '') return
        if (input.value.trim().length > 5000) return alert('Wiadomość nie może być dłuższa niż 5000 znaków!')
        // console.log(`Sending message: ${input.value}`)
        ws.send(JSON.stringify({a: 'room:send', m: input.value.trim(), roomId}))
        input.value = ''
    })
}