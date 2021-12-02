require('./assets/wasm_exec.js');
const wasm_url = '/package_lesson1/assets/sample.wasm.br'

Page({
	data: {
		notice: '',
		inputText: '你好！Go语言。',
		test_result1: '0',
		test_result2: '',
	},
	async onReady() {
		// 在小程序基础类库的global对象上，增加console对象。
		global.console = console
		// 使用小程序类库的WXWebAssembly，初始化Go运行环境。
		await this.initGo()
	},
	async initGo() {
		var _that = this;
		const go = new global.Go();
		try {
			const result = await WXWebAssembly.instantiate(wasm_url, go.importObject)
			var msg = 'Go初始化成功,在小程序调试窗口查看console的信息。'
			_that.setData({
				notice: msg,
			})
			console.log('initGo', msg)

			// 运行go程序的main()方法
			await go.run(result.instance);
			// 注意：在go程序的main()方法退出之前，小程序不会运行到这个位置。
			console.log('initGo', '运行完成')
		} catch (err) {
			console.error('initGo', err)
		}
	},
	btnRun1() {
		var _that = this;
		var res = global.addTotal()
		_that.setData({
			test_result1: res,
		})
		console.log(res)
	},
	btnRun2() {
		var _that = this;
		wx.showLoading({
			title: '请等待2秒',
			mask:true,
		})
		global.asyncAndCallbak(_that.data.inputText, function (res) {
			wx.hideLoading()

			_that.setData({
				test_result2: _that.data.test_result2+res+' ',
			})
			console.log(res)
		})
	},
})
