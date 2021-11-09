var url = 'url'

var other = require('./other')

async function go(cookie){
    var status = await other.status(url, cookie)
    console.log(status)
    await other.socketStuff(url, cookie)
    const resource = await other.getResources(url, cookie)
    console.log(resource)
}

async function main() {
    var cookie = await other.login('username', 'password', url)
    console.log(cookie)
    if (cookie != null || cookie != undefined) {
        go(cookie)
    } else {
        console.log('Login failed')
    }

}
main()