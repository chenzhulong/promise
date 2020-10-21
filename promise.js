function Promise(execute) {
	const self = this
	this.status = "pending"
	this.value = undefined
	this.reason = undefined
	this.fulfilled = []
	this.rejected = []
	function resolve(val) {
		if (self.status === "pending") {
			self.status = "fulfilled"
			self.value = val
			self.fulfilled.forEach(element => {
				element()
			})
		}
	}
	function reject(val) {
		if (self.status === "pending") {
			self.status = "rejected"
			self.reason = val
			self.rejected.forEach(element => {
				element()
			})
		}
	}
	try {
		execute(resolve, reject)
	} catch (e) {
		reject(e)
	}
}
Promise.prototype.then = function (fulfilled, rejected) {
	const self = this
	fulfilled = typeof fulfilled === "function" ? fulfilled : fulfilled => fulfilled
	rejected = typeof rejected === "function" ? rejected : rejected => rejected
	const promise2 = new Promise(function (resolve, reject) {
		if (self.status === "pending") {
			try {
				self.fulfilled.push(() => {
					let x = fulfilled(self.value)
					resolvePromise(promise2, x, resolve, reject)
				})
				self.rejected.push(() => {
					let x = rejected(self.reason)
					resolvePromise(promise2, x, resolve, reject)
				})
			} catch (e) {
				reject(e)
			}
		}
		if (self.status === "fulfilled") {
			try {
				let x = fulfilled(self.value)
				resolvePromise(promise2, x, resolve, reject)
			} catch (e) {
				reject(e)
			}
		}
		if (self.status === "rejected") {
			try {
				let x = rejected(self.reason)
				resolvePromise(promise2, x, resolve, reject)
			} catch (e) {
				reject(e)
			}
		}
	})

	return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) {
		return reject(new Error("循环调用"))
	}
	if ((x != null && typeof x === "object") || typeof x === "function") {
		try {
			const then = x.then
			if (typeof then === "function") {
				then.call(
					x,
					y => {
						resolvePromise(promise2, y, resolve, reject)
					},
					e => reject(e)
				)
			} else {
				resolve(x)
			}
		} catch (e) {
			reject(e)
		}
	} else {
		resolve(x)
	}
}

var proObj = new Promise(function (resolve, reject) {
	setTimeout(function () {
		resolve("haha")
	}, 5000)
})

proObj
	.then(function (e) {
		console.log(e)
		return proObj
	})
	.then(
		e => {
			e
		},
		e => console.log(e)
	)

promiseObj.then(
	value => {
		console.log("resolved:" + value)
	},
	reason => {
		console.log("rejected:" + reason)
	}
)
