let data = {price: 5, quantity: 2}
let target = null
let total = 0  // 10 right?
target = () => { total = price * quantity}

class Dep {
	constructor() {
		this.subs = []
	}

	depend() {
		if (target && !this.subs.includes(target)) {
			this.subs.push(target)
		}
	}

	notify(){
		this.subs.forEach(sub => sub())
	}
}

Object.keys(data).forEach(key => {
	let intVal = data[key]

	const dep = new Dep()
	Object.defineProperty(data, key, {
		get(){
			console.log(`Getting ${key}: ${intVal}`)
			dep.depend()
			return intVal
		},
		set(newVal){
			console.log(`Setting ${key} to: ${newVal}`)
			intVal = newVal
			dep.notify()
		}

	})
})

// let price = 5
// let quantity = 2
// let intVal = data.price
function watcher(fun) {
	target = fun
	target()
	target = null
}


// let storage = []

// function record(){
// 	storage.push(target)
// }
// function replay(){
// 	storage.forEach(run => run())
// }


// record()
// dep.depend();
// target()

watcher(()=>{
	data.total = data.price * data.quantity
})

// price = 20
// console.log(`total is ${total}`)
// replay()
// console.log(`total is ${total}`)