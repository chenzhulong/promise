function Promise(execute) {
	const that = this
	this.status = "pending"
	function resolve(val) {
		if (that.status === "pending") {
			// 状态一旦变化，将不可逆
			that.status = "fulfilled"
			that.value = val
		}
	}
	function reject(val) {
		if (that.status === "pending") {
			that.status = "rejected"
			that.reason = val
		}
	}
	execute(resolve, reject)
}

Promise.prototype.then = function (fulfilled, rejected) {
	if (this.status === "fulfilled") {
		fulfilled(this.value)
	} else {
		rejected && rejected(this.reason)
	}
}

new Promise(function (resolve) {
	resolve("haha")
}).then(function (val) {
	console.log(val)
})
