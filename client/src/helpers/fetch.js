async function post(path, content) {
    const res = await fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    })

    return res;
}

async function get(path,content) {
    const res = await fetch(path, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    })
    return res;
}

export { post, get }