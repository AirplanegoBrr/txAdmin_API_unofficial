const io = require('socket.io-client');
const fetch = require('node-fetch');

async function socketStuff(url, cookie) {
    const opts = {
        transports: ['polling'],
        extraHeaders: {
            'Cookie': cookie
        },
        upgrade: false,
        query: {
            room: 'liveconsole'
        }
    }
    socket = io(url, { ...opts, path: '/socket.io' });

    socket.on('error', (error) => {
        console.dir(error)
    });

    socket.on('connect', () => {
        console.log("Socket.IO Connected.");
    });

    socket.on('disconnect', () => {
        console.log("Socket.IO Disonnected.");
    });

    socket.on('goDashboard', (error) => {
        console.log("goDashboard");
    });

    socket.on('consoleData', function (msg) {
        console.log(msg)
    });
}

async function runCommand(command) {
    try {
        socket.emit('consoleCommand', command);
    } catch (e) {
        console.log(e)
    }
}

async function login(username, password, url) {
    const cookie = await fetch(url, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1"
        },
        "referrer": `${url}/auth`,
        "body": `username=${username}&password=${password}`,
        "method": "POST",
        "mode": "cors"
    }).then(async res => {
        var cookie = await res.headers.get('set-cookie')
        return cookie
    })
    return cookie
}

async function status(url, cookie) {
    const status = await fetch(`${url}/status/web`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest",
            "Cookie": cookie
        },
        "referrer": `${url}/`,
        "method": "GET",
        "mode": "cors"
    }).then(async res => {
        var status = await res.json()
        return status
    })
    return status
}

async function cfg(url, cookie, cfg) {
    await fetch(`${url}/cfgEditor/save`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Cookie": cookie
        },
        "referrer": `${url}/cfgEditor`,
        "body": `cfgData=${cfg}`,
        "method": "POST",
        "mode": "cors"
    })
    return 'good'
}

async function getResources(url, cookie) {
    const resourcesOUT = await fetch(`${url}/resources`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
            "Cookie": cookie
        },
        "referrer": url,
        "method": "GET",
        "mode": "cors"
    }).then(async res => {
        var resourcesOUT = await res.text()
        return resourcesOUT
    })
    //get everything in table table-hover table-outline mb-0 and get all the IDs of the resources
    var resources = resourcesOUT.match(/<tr id="(.*?)"/g)
    var resources = resources.map(x => x.match(/<tr id="(.*?)"/)[1])
    return resources
}

module.exports = {
    login,
    status,
    cfg,
    socketStuff,
    runCommand,
    getResources
}


async function notUsed() {
    //start resource
    await fetch("http://dns.dreamcityrp.ga:40120/fxserver/commands", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest"
        },
        "referrer": "http://dns.dreamcityrp.ga:40120/resources",
        "body": "action=ensure_res&parameter=Ferrara",
        "method": "POST",
        "mode": "cors"
    });

    //stop resource
    await fetch("http://dns.dreamcityrp.ga:40120/fxserver/commands", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest"
        },
        "referrer": "http://dns.dreamcityrp.ga:40120/resources",
        "body": "action=stop_res&parameter=Durastar",
        "method": "POST",
        "mode": "cors"
    });

    //restart is the same as start


    //Server actions

    //stop server
    await fetch("http://dns.dreamcityrp.ga:40120/fxserver/controls/stop", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest"
        },
        "referrer": "http://dns.dreamcityrp.ga:40120/",
        "method": "GET",
        "mode": "cors"
    });

    //start server 
    await fetch("http://dns.dreamcityrp.ga:40120/fxserver/controls/start", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest"
        },
        "referrer": "http://dns.dreamcityrp.ga:40120/",
        "method": "GET",
        "mode": "cors"
    });

    //Restart server
    await fetch("http://dns.dreamcityrp.ga:40120/fxserver/controls/restart", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest"
        },
        "referrer": "http://dns.dreamcityrp.ga:40120/",
        "method": "GET",
        "mode": "cors"
    });

}