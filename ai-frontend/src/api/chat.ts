export async function sendMessageToAi(data: any) {
    const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return res.json()
}