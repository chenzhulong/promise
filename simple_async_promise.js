function Promise(execute) {
	const that = this
	this.status = "pending"
	this.fulfilled = []
	this.rejected = []
	function resolve(val) {
		if (that.status === "pending") {
			that.status = "fulfilled"
			that.value = val
			that.fulfilled.forEach(element => {
				element()
			})
		}
	}
	function reject(val) {
		if (that.status === "pending") {
			that.status = "rejected"
			that.reason = val
			that.rejected.forEach(element => {
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
	const that = this
	if (that.status === "pending") {
		that.fulfilled.push(() => fulfilled(that.value))
		that.rejected.push(() => rejected(that.reason))
	}
	if (that.status === "fulfilled") {
		fulfilled(that.value)
	}
	if (that.status === "rejected") {
		rejected(that.reason)
	}
}

new Promise(function (resolve) {
	throw "haha"
}).then(
	function (val) {
		console.log(val)
	},
	e => {
		console.log("error:", e)
	}
)
