/*
使用方法：在终端运行“go build -o sample.wasm main.go”，会生成sample.wasm。
*/
package main

import (
	"syscall/js"
	"time"
)

var totalNum int = 0

// js调用Go。点击按钮一次，增加一次计数。
func addTotal(this js.Value, args []js.Value) interface{} {
	totalNum = totalNum + 1
	return js.ValueOf(totalNum)
}

// js调用Go, Go回调js。Go等待2秒后，才回调js。
func asyncAndCallbak(this js.Value, args []js.Value) interface{} {
	// js输入参数
	input := args[0].String()
	// js回调函数
	callback := args[1]
	// 协程
	go func() {
		// 等待2秒
		time.Sleep(2 * time.Second)
		result := "回复：" + input
		// 运行js回调函数
		callback.Invoke(result)
	}()

	return nil
}

func main() {
	// 创建通道
	channel := make(chan int)
	// 1.Go调用js的console.log()方法,在开发者工具的Consol面板中查看。
	console := js.Global().Get("console")
	console.Call("log", "hello, world!")

	// 2.js调用Go的addTotal()方法
	js.Global().Set("addTotal", js.FuncOf(addTotal))

	// 3.js调用Go的asyncAndCallbak()方法, Go回调js。
	js.Global().Set("asyncAndCallbak", js.FuncOf(asyncAndCallbak))

	// 通道阻塞了main()方法
	<-channel

	// main()方法在结束之前，不会运行到这个位置。
	console.Call("log", "exit")
}
