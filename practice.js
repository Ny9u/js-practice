// 手写promise.all 
/*
写的还是有点问题的,size这个变量其实是不需要的,反而是需要一个count变量
count用于记录有几个promise被执行成功了,决定最后的resolve
*/
const all = (array) =>{
    let result = [];
    // let size = array.length;
    // return new Promise ((resolve,reject) =>{
    //     const addData = (index,data) => {
    //         result[index] = data;
    //         if(index === size) {
    //             resolve(result);
    //         }
    //     }
    //     array.foreach((promise,index)=>{
    //         if(promise instanceof Promise){
    //             promise.then(res=> addData(index,res),err=> reject(err))
    //         }
    //         else{
    //             addData(index,promise)
    //         }
    //     })
   	// })
		let count=0;
		return new Promise((resolve,reject)=> {
			//写一个方法去记录count并将promise的结果存入数组
			const addData = (index,res) =>{
				result[index] = res;
				count++;
				if(count === array.length){
					resolve(result);
				}
			}
			array.foreach((promise,index)=> {
				if(promise instanceof Promise){
					promise.then(res=>addData(index,res),err => reject(err))
				}
				else{
					addData(index,promise)
				}
			})
		})
}

// 手写call
/*
这个有点忘了,该复习一下call,bind,apply这三者的区别和写法了
call:改变函数this指向,可以传入多个参数
apply:改变函数this指向,传入一个参数数组
bind: 改变函数this指向,并且返回一个函数(不执行函数内容),可以传入多个参数
*/
Function.prototype.call = function(context,...args){
    let result;
    context = context || window;
    context.fn = this;
    result=context.fn(args);
    delete context.fn;
    return result;
}

//手写reduce
/*
reduce的思路还是理解的,但是代码写出来结果差点意思
不能用箭头函数实现
*/
Array.prototype.reduce = function (fn,value) {
    // if(!value){
    //     value = this[0];
    // }
    // this.foreach((item)=>{
    //     value += item.fn()
    // })
    // return value;
    let result = value;
    let i=0;
    //防止没有初始值的情况
    if(result === undefined){
        result = this[i];
        i++;
    }
    while(i<this.length){
        //对数组每一个元素都执行一次fn,并将结果累积给result
        result = fn(result,this[i]);
        i++;
    }
    return result;
}

// 手写树型化(列表转树)
// array = [{id:1,name:'名字1',parent:2}...]
const treeify = (array,parentId=null) =>{
    let tree =[];
    array.foreach((item)=> {
        if(item.parent === parentId){
            let obj = {
                id:item.id,
                name: item.name,
                children: treeify(array,item.id)
            };
           tree.push(obj);
        }
    })
    return tree;
}

//手写防抖
/*
防抖:执行函数时在时间内如果再次执行需要重新计时(多次触发只执行最后一次)
这里需要注意返回的函数不能写箭头函数,因为箭头函数没有arguments,无法获取参数
*/
const debounce = (fn,wait) =>{
    // 计时器
    let timer; 
    // return () =>{
		// 	if(timer){
		// 			clearTimeout(timer);
		// 	}
		// 	timer = setTimeout(()=>{
		// 		fn.apply(this,args)
		// 	},wait)
    // }
		return function(){
			let args = arguments;
			if(timer){
					clearTimeout(timer);
			}
			timer = setTimeout(()=>{
				fn.apply(this,args)
			},wait)
		}
}

// 手写ajax
/*
ajax:使用原生的xhr请求数据,并对响应数据进行处理
这个还是用的比较少的,特别是onreadystatechange这个函数,还有readyState这个属性
readyState等于4表示已完成接收
*/
const URL = '目标地址'
const xhr = new XMLHttpRequest();
xhr.open('get',URL)

xhr.onreadystatechange = () =>{
		if(xhr.readyState !== 4)return;
    if(xhr.readyState === 4){
        if(xhr.status === 200){
            //处理数据
        }
        else{
            //处理错误
        }
    }
}

//手写instanceof
/*
instanceof原理就是通过原型判断当前对象是否出现在函数的原型链上,返回true或false
获取原型最好不要直接用__proto__(es6),而是使用Object.getPrototypeOf(obj)
*/
const myInstanceof = (obj,fn) =>{
	const proto = fn.prototype;
	while(proto){
		if(obj.__proto__ === proto){
			return true;
		}
		proto = proto.__proto__ //Object.getPrototypeOf(proto)
	}
	return false;
}

//手写深拷贝 
/*
实现思路,先判断传入的数据的类型,然后遍历对象,是否是引用类型,然后选择是否递归调用
*/
const deepClone = (obj) =>{
	// 对象类型判断
	// if(typeof obj !== 'object'){
	//     return obj;
	// }
	// let newObj = {}
	let newObj = Array.isArray(obj)?[]:{} //判断是对象还是数组
	for(let key in obj){
		// 需要先判断是否存在这个key!!!!!!!!!!
		if(obj.hasOwnProperty(key)){
			if(obj[key]!== Object){
				newObj[key]= obj[key];            
			}
			else{
				newObj[key]=deepClone(obj[key]);    
			}
		}
	}
	return newObj
}

//手写数组合并
/*
实现思路:合并两个有序数组,遍历返回新数组
*/
const merge = (arr1,arr2) =>{
	let newArr = [];
	let i=0,j=0;
	while(i<arr1.size()&&j<arr2.size()){
		if(arr1[i]<=arr2[j]){
			newArr.push(arr1[i]);
			i++;
		}
		else{
			newArr.push(arr2[j]);
			j++;
		}
	}
	if(i===arr1.size()){
		while(j<arr2.size()){
			newArr.push(arr2[j]);
			j++;
		}
	}
	if(j===arr2.size()){
		while(i<arr1.size()){
			newArr.push(arr1[i]);
			i++;
		}
	}
	return newArr;
} 

// 手写 trim 
/*
trim是字符串的方法,用于去除字符串首尾的空格
常见的实现思路是使用正则表达式去实现
*/
String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g,'')
}

// 手写sleep 
/*
sleep函数用来模拟代码延迟执行,一般用 promise和 setTimeout实现
*/ 
function sleep(time) {
	return new Promise(resolve => {
		setTimeout(resolve,time)
	})
}

// 手写数组扁平化 (数组拍平)
/*
扁平化的意思是将数组中的嵌套数组清除,变成一个一维数组
*/
function flat() {
	let newArr = []
	// arr为需要处理的数组 n为需要拍平的层数,n=1为只拍平第一层
	return function flatten(arr, n) {
		const currentArr = []
		arr.forEach((item)=>{
			if(Array.isArray(item)){
				currentArr.push(...item)
			}else{
				currentArr.push(item)
			}
		})
		newArr = currentArr
		return n > 1 ? flatten(newArr,n-1) : newArr
	}
}

// 返回数组中出现最多次的元素
/*
因为js中没有方便的数据结构可以使用,所以我们的思路一般就是遍历,使用对象或者map去记录次数
*/
Array.prototype.most = function(){
	let map = new Map() 
	let max = 0
	let element = null
	this.forEach((item) => {
		if(map.has(item)){
			map.set(item,map.get(item)+1)
		}else {
			map.set(item,1)
		}
	})
	// 遍历map,获取最多次的元素
	map.forEach((value,key)=>{
		if(element === null || value > max){
			max = value
			element = key
		}
	})
	return element
}

// 手写lru
/*
lru:最近最少使用的元素
*/
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
	this.cache = new Map()
	this.capacity = capacity
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
	if(this.cache.has(key)){
		let tmp = this.cache.get(key)
		this.cache.delete(key)
		this.cache.set(key,tmp)
		return tmp
	}
	return -1
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  // if(this.cache.has(key)){
	// 	this.cache.delete(key)
	// }
	// this.cache.set(key,value)
	// 忘记对容量进行判断了,如果超过容量应该删除最少使用的元素
	if(this.cache.has(key)){
		this.cache.delete(key)
	}else if(this.cache.size >= this.capacity){
		//获取到最少使用的元素的key,keys()获取到key的迭代器
		this.cache.delete(this.cache.keys().next().value)
	}
	this.cache.set(key,value)
};

// 获取下一个质数
/*
这个不是很常见,主要思路还是通过闭包实现,检查number是否合法
*/
function getNextPrime(){
	let number = 2
	return function nextPrime(){
		while(true){
			let isPrime = true
			for(let i=2;i<number;i++){
				if(number % i === 0){
					isPrime = false
					number++
					break
				}
			}
			if(isPrime){
				const prime = number
				number++
				return prime
			}
		}
	}
}

// 给数字增加分隔符
/*
这个也算是比较少见的,一般是实现思路是遍历,每三位加一个分隔符
*/
function addSeparator(num) {
	let res = ''
	let number = num.toString()
	// let count = 1
	let count = 0
	for (let i = number.length-1; i >= 0; i--){
		// if(count === 3){
		// 	res = ',' + res
		// 	res = number[i] + res
		// 	count = 1
		// }else {
		// 	res = number[i] + res
		// 	count++
		// }
		// 应该增加对最后一个数字的验证
		res = number[i] + res
		count++
		if(i!==0 && count % 3 === 0){
			res = ',' + res
		}
	}
	return res
}

// 手写正则表达式匹配日期
/*
这个还是第一次见,有点奇葩,记录一下
*/
const regExp = /^\d{4}-\d{2}-\d{2}$/
const date = '2025-01-01'
if(regExp.test(date)){
	console.log('匹配成功')
}else{
	console.log('匹配失败')
}

// 手写发布订阅模式
/*
发布订阅模式还是挺常考的,主要是实现三个函数:发布事件,订阅事件,取消订阅事件
*/
class eventCenter{
	constructor(){
		this.events = {}
	}
	//发布事件
	emit(eventName,args) {
		//执行事件回调
		if(this.events[eventName]){
			this.events[eventName].forEach(fn => {
				fn(args)
			})
		}
	}
	//订阅事件
	on(eventName,callback){
		this.events[eventName] = this.events[eventName] || []
		this.events[eventName].push(callback)
	}
	//取消订阅
	off(eventName,callback){
		this.events[eventName] = this.events[eventName] || []
		let index = this.events[eventName].indexof(callback)
		if(index !== -1){
			this.events[eventName].splice(index,1)
		}
	}
}

// 手写once
/*
once函数是执行一次传入的函数,且在之后调用时不再生效,主要是依靠闭包实现
可以加个附加需求,就是之后调用时返回第一次时的返回值
*/
function once(fn){
	let res = undefined
	return function(){
		if(res) return res
		const args = arguments
		res = fn.apply(this,args)
		return res
	}
}

// 手写柯里化
/*
柯里化的关键还是递归和闭包,通过闭包变量去记录当前参数个数,当参数个数达到要求之后才执行原函数
*/
function curry(fn){
	let length = fn.length
	let arr = []
	return function _curry(...args){
		let subArr = [...arr,...args]
		args.push(...args)
		if(subArr.length >= length){
			return fn.apply(this,subArr)
		}else {
			return _curry
		}
	}
}

// 手写链表倒置
/*
输入一个链表的头节点,返回倒置后链表的头节点
数据结构:
class ListNode {  
	constructor(val, next = null) {
		this.val = val;
		this.next = next;
	}
}
*/
function reverseLinkedList(head) {
	let nextNode = head.next
	let ans = nextNode || head
	if(nextNode) head.next = null
	while(nextNode){
		let tmp = nextNode.next
		ans = nextNode
		nextNode.next = head
		head = nextNode
		nextNode = tmp
	}
	return ans

	// 以下是Ai写的版本,感觉逻辑更容易理解
	// 初始化前一个节点为 null
	let prev = null;
	// 当前节点初始化为头节点
	let current = head;
	while (current) {
			// 保存当前节点的下一个节点
			let nextNode = current.next;
			// 将当前节点的 next 指针指向前一个节点
			current.next = prev;
			// 更新前一个节点为当前节点
			prev = current;
			// 更新当前节点为下一个节点
			current = nextNode;
	}
	// 循环结束后，prev 就是反转后链表的头节点
	return prev;
}

// 获取嵌套数组最大深度
function getMaxDepth(arr) {
	let maxDepth = 0;
	if(!Array.isArray(arr)){
		return 0;
	}
	for(let i=0;i<arr.length;i++){
		if(Array.isArray(arr[i])){
			maxDepth = Math.max(maxDepth,getMaxDepth(arr[i]) + 1)
		}
	}
	return maxDepth;
}

// 手写promise链式调用
let promise = new Promise((resolve,reject) => {
	// 执行异步操作
	if(true) {
		// 执行成功
		resolve('success')
	}else {
		// 执行失败
		reject('error')
	}
}).then((data1)=>{
	console.log(data1)
	return 'data2' // 返回一个已解决的promise
},(err1)=>{
	console.log(err1)
}).then((data2)=>{
	console.log(data2)
})

// 手写深拷贝
/*
要求: 支持对象,数组,基本数据类型的深拷贝
*/
function deepClone(obj) {
	let res = null;
	if(typeof obj !== 'object'){
		res = obj
		return res;
	}
	res = Array.isArray(obj) ? [] : {}
	for(key in obj){
		if(obj.hasOwnProperty(key)){
			if(typeof obj[key] !== 'object'){
				res[key] = obj[key]
			}else {
				res[key] = deepClone(obj[key])
			}
		}
	}
	return res;
}

// 实现一个promise.all
/*
要求: 模拟Promise.all的功能，接收一个Promise数组，返回一个新的Promise
*/
Promise.prototype.all = function (arr) {
	let res = []
	if(arr.length === 0) return res
	return new Promise((resolve,reject)=>{
		res = Array(arr.length)
		const addResult = function (result,index) {
			res[index] = result
			if(index === arr.length -1) resolve(res);
		}
		for(let i=0;i<arr.length;i++){
			if(arr[i] instanceof Promise){
				arr[i].then((res)=>{
					addResult(res,i)
				})
			}else{
				addResult(arr[i],i)
			}
		}
	})
}

// 实现一个防抖函数
/*
要求:防抖函数debounce，在指定时间内只执行一次
*/
function debounce(fn,time){
	let timer = null;
	return function() {
		const context = this
		const args = arguments
		if(timer){
			clearTimeout(timer)
			timer = null
		}
		timer = setTimeout(()=>{
			fn.apply(context,args)
		},time)
	}
}

// 实现vue的双向数据绑定
/*
const vm = new Vue({
  data: { message: 'Hello' },
  el: '#app'
});
要求:当修改 vm.message 时，视图自动更新
*/
Object.defineProperty(vm, 'message',{
	get(){
		return vm.data.message
	},
	set(newVal){
		if(newVal === vm.data.message) return
		vm.data.message = newVal
		// 触发dom更新
	}
})

// 实现vue的组件间通信
/*
要求：父组件向子组件传递数据，子组件向父组件触发事件
*/
/*
思路描述: 父组件中使用'@'绑定自定义事件,并在父组件中定义响应函数,子组件中使用$emit发送信号
*/

// 实现函数柯里化
/*
实现代码，满足：
 add(1)(2)() => 3
 add(1)(2)(3)() => 6
*/
function makeAdd(){
	let sum = 0;
	return function add(){
		const num = arguments
		if (arguments.length !== 0) {
			sum = sum + arguments[0]
			return add
		}else {
			return sum
		}
	}
}

// 实现instanceof 
function myInstanceof(obj, parent) {
	const prototype = parent.prototype;
	let proto = Object.getPrototypeOf(obj)
	while(proto){
		if(proto === prototype){
			return true
		}else{
			proto = Object.getPrototypeOf(proto)
		}
	}
	return false
}

// 实现数组扁平化
/*
要求:实现 flattenDeep([1, [2, [3]]]) => [1,2,3]
*/
function flattenDeep(arr) {
  if(arr.length === 0) return;
	let res = []
	arr.forEach((item)=>{
		if(Array.isArray(item)){
			// 数组拼接用concat
			res.concat(flattenDeep(item))
		}else {
			res.push(item)
		}
	})
	return res
}

// 实现节流
function throttle(fn, interval) {
	let time = null;
	return function(){
		let now = new Date()
		if(!time || now-time>interval){
			fn.apply(this,arguments)
			time = now
		}
	}
}

// 实现发布订阅模式
class EventEmitter {
  constructor() {
		this.events = {}
  }

  on(event, callback) {
		if(this.events[event]){
			return
		}else {
			this.events[event] = callback
		}
	}

  emit(event, ...args) {
		if(this.events[event]){
			this.events[event](...args)
		}
	}

  off(event, callback) {
		if(this.events[event]){
			delete this.events[event]
		}
	}
}

// 实现bind 
Function.prototype.bind = function(context,...args){
	// const fn = this
	// return function(){
	// 	fn.apply(context,args)
	// }
	const self = this;
  return function(...innerArgs) {
    return self.apply(
			// 这里判断是为了内部函数作为构造函数被new时this可以正确指向新对象
      this instanceof self ? this : context,
      args.concat(innerArgs)
    );
  };
}

// 手写call 
Function.prototype.call = function(context,...args){
	context = context || window
	context.fn = this
	const result = context.fn(...args)
	delete context.fn
	return result
}

// 手写apply
Function.prototype.apply = function(context,args){
	context = context || window
	context.fn = this
	const result = context.fn(args)
	delete context.fn
	return result
}

// 数组去重(多种方法)
function unique1(arr){
	// from将类数组对象/可迭代对象转为数组
	return Array.from(new Set(arr))
}

function unique2(arr){
	return Array.filter((item,index,arr) =>{
		return arr.indexOf(item) === index
	})
}

function unique3(arr){
	arr.reduce((arr,cur) =>{
		acc.includes(cur) ? acc : [...acc, cur]
	},[])
}

function unique4(arr){
	const map = new Map()
	let res = []
	arr.forEach((item)=>{
		if(!map.has(item)){
			map.set(item,true)
			res.push(item)
		}
	})
	return res
}

// 实现深拷贝
/*
要求:支持对象,数组,循环引用的深拷贝
*/
function deepClone (obj , map = new Map()){
	if(obj === null || typeof obj !== 'object') return obj
	if(map.has(obj)) return map.get(obj)
	let res = Array.isArray(obj) ? [] : {}
	map.set(obj, res);
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			if(typeof obj[key] === 'object'){
				res[key] = deepClone(obj[key],map)
			}else {
				res[key] = obj[key]
			}
		}
	}
	return res
}

// 实现函数柯里化
/*
实现代码，满足：
 add(1)(2) => 3
 add(1)(2)(3) => 6
*/
function curry(fn,...args){
	// 这种柯里化首先要获取的就是总的参数长度
	let length = fn.length
	let arg = args || []
	return function (){
		//然后在内部函数判断是否超过总参数长度,超过则执行原函数,否则继续柯里化
		let newArg = arg.concat(Array.from(arguments))
		if(newArg.length >= length){
			return fn.apply(this,newArg)
		}else{
			// 调用call,这样newArg就能同步到arg
			return curry.call(this,fn,...newArg)
		}
	}
}

// 手写new
Function.prototype.New = function (...args){
	let obj = {}
	obj.__proto__ = this.prototype
	const res = this.apply(obj,args)
	return Object(res)? res : obj
}

// 手写数字千分位格式化
function format(num){
	const str = num.toString()
	let res = ''
	for(let i = str.length-1;i>=0;i--){
		res = res + str[i]
		if(((str.length-i))%3 === 0 && i!==0){
			res = res + ','
		}
	}
	return res.split('').reverse().join('');
}

// 带并发限制的异步调度器
class Worker {
	constructor(limit){
		this.limit = limit 
		this.task = []
		this.num = 0
	}

	add(fn){
		this.task.push(fn)
	}

	async run(){
		if(this.num >= this.limit || this.task.length <= 0) return
		this.num++
		const fn = this.task.shift()
		let res;
		try{
			res = await fn()
		}catch{
			//报错处理
		}finally{
			this.num--
		}
		return res
	}
}

// 观察者模式实现event类
class Event {
	constructor(){
		this.events = {}
	}

	emit(event){
		if(this.events[event]){
			this.events[event].forEach(fn => {
				fn()
			})
		}
	}

	on(event,fn){
		if(!this.events[event]){
			this.events[event] = []
		}
		this.events[event].push(fn)
	}

	off(event,fn){
		if(!this.events[event]) return
		const index = this.events[event].indexOf(fn)
		if(index !== -1){
			this.events[event].splice(index,1)
		}
	}

}

// 深拷贝(字节日常一面)
function deepClone(obj,map = new Map()){
	let res = null 
	if(obj === null || typeof obj !== 'object') {
		res = obj
		return res
	}
	if(map.has(obj)){
		return map.get(obj)
	}
	res = Array.isArray(obj)? [] : {}
	map.set(obj,res)
	for(let key in obj){
		if(obj.hasOwnPerperty(key)){
			if(typeof obj[key] === 'object'){
				res[key] = deepClone(obj[key],map)
			}else{
				res[key] = obj[key]
			}
		}
	}
	return res
}

// 手写promise.all(字节二面)
Promise.prototype.all = function(arr){
	let ans = []
	if(arr.length === 0)return ans
	return new Promise((resolve,reject)=>{
		ans = Array(arr.length)
		arr.forEach((item,index)=>{
			if(item instanceof Promise){
				item.then((res)=>{
					ans[index] = res
				},(err)=>{
					reject(err)
				})
			}else{
				ans[index] = item
			}
			if(index === arr.length -1) resolve(ans)
		})
	})
}

// 实现带once的发布订阅模式(字节一面)
class EventEmitter {
	constructor(){
		this.events = {}
	}

	on(event,fn){
		if(!this.events[event]){
			this.events[event] = []
		}
		this.events[event].push(fn)
	}

	off(event,fn){
		if(!this.events[event]) return
		const index = this.events[event].indexOf(fn)
		this.events[event].splice(index,1)
	}

	emit(event,args){
		if(!this.events[event]) return
		this.events[event].forEach(fn => {
			fn(args)
		})
	}
	once(event,fn){
		const onceFn = (...args) => {
			//在注册的事件中取消该回调
			fn(...args)
			this.off(event,onceFn)
		}
		this.on(event,onceFn)
	}
}

// 手写列表转树形结构
// array = [{id:1,name:'名字1',parent:2}...]
function toTree(arr, parentId){
	let tree = []
	arr.forEach(item =>{
		if(item.parent === parentId){
			let obj = {
				id: item.id,
				name: item.name,
				children: toTree(arr,item.id)
			}
			tree.push(obj)
		}
	})
	return tree
}

// 手写对象的深比较
function isEqual(obj1,obj2){
	if (obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
		return obj1 === obj2;
}
	if(typeof obj1 !== 'object'){
		return obj1 === obj2
	}else{
		for(key in obj1){
			if(obj1.hasOwnProperty(key)){
				if(isEqual(obj1[key],obj2[key]) === false || obj2.hasOwnPerperty(key) === false){
					return false
				}
			}
		}
	}
	return true
}

// promise.race
Promise.prototype.race = function(promises){
	return new Promise((resolve,reject)=>{
		promises.forEach((promise)=>{
			if(promise instanceof Promise){
				promise.then((res)=>{
					resolve(res)
				},(err)=>{
					reject(err)
				})
			}else{
				resolve(promise)
			}
		})		
	})
}

// 手撕 Promise 异步并发限制数量的图片上传(百度一面)
function asyncPool(pics,uploadFn,limit){
	let res = []
	let isRunning = 0
	let index = 0

	return new Promise((resolve,reject)=>{
		function uploadPic(){
			if(isRunning === 0 && index>= pics.length){
				resolve(res)
				return
			}
			if(isRunning < limit && index < pics.length){
				let pic = pics[index++]
				isRunning++
				uploadFn(pic).then((data)=>{
					res.push(data)
				}).catch((err)=>{
					reject(err)
				}).finally(()=>{
					isRunning--
					uploadPic()
				})
			}
		}
		uploadPic()
	})
}

// 手写深拷贝(网易一面)
function deepClone(obj,map= new Map()){
	let res;
	if(typeof obj !== 'object'){
		res = obj
		return res
	}
	if(map.has(obj)){
		return map.get(obj)
	}
	map.set(obj,res)
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			if(typeof obj[key]=== 'object'){
				res[key] = deepClone(obj[key],map)
			}else{
				res[key] = obj[key]
			}
		}
	}
	return res
}

// 手写防抖(哈啰一面)
function debounce(fn,delay){
	let timer = null
	return function(){
		if(timer){
			clearTimeout(timer)
		}
		timer = setTimeout(()=>{
			fn.apply(this,arguments)
		},delay)
	}
}

// 提取URL参数
// "https://example.com/page?name=JohnDoe&age=25&city=New+York"
function getUrlParams(url){
	let res = {}
	const params = url.split('?')[1].split('&')
	params.forEach((param)=>{
		let args = param.split('=')
		res[args[0]] = args[1]
	})
	return res
}

// 手写promise.all(蔚来一面)
promise.prototype.all = function(promises){
	let res = []
	return new Promise((resolve,reject)=>{
		promises.forEach((promise,index)=>{
			if(promise instanceof Promise){
				promise.then((res)=>{
					res.push(res)
				},(err)=>{
					reject(err)
				})
			}else{
				res.push(promise)
			}
			if(index === promises.length){
				resolve(res)
			}
		})

	})
}

// 手写数字千分位(作业帮一面)
function addComma(num){
	let numStr = num.toString()
	let res = ''
	let count = 0
	for(let i = numStr.length-1;i>=0;i--){
		if(count%3 === 0 && count !== 0){
			res += ','
		}
		res+=numStr[i]
		count++
	}
	return res.split('').reverse().join('')
	// 也可以用正则结合replace实现
	// /(\d)(?=(\d{3})+(?!\d))/g
}

// 数组reduce实现累加(小红书一面)
function addSum(arr){
	return arr.reduce((acc,cur)=>{
		return acc += cur
	},0)
}

// 求两个数组的公共部分
function commonArray(arr1,arr2){
	let res = []
	arr1.forEach((item)=>{
		if(arr2.includes(item)){
			res.push(item)
		}
	})
}

// 手写apply(虾皮一面)
Function.prototype.apply = function(context,args){
	context = context || window
	context.fn = this
	const res = context.fn(...args)
	delete context.fn
	return res
}

// 实现一个LRU(最近最少使用)类(小红书二面)
class LRU{
	constructor(capacity){
		this.capacity = capacity
		this.cache = new Map()
	}

	get(key){
		if(this.cache.has(key)){
			let value = this.cache.get(key)
			this.cache.delete(key)
			this.cache.set(key,value)
			return value
		}
	}

	put(key,value){
		if(this.cache.has(key)){
			this.cache.delete(key)
		}else if(this.cache.size >= this.capacity){
			//删除最近最少使用的元素
			this.cache.delete(this.cache.keys().next().value)
		}
		this.cache.set(key,value)
	}
}

// 输出多级嵌套结构的 Object 的所有 key 值
function getKeys(obj){
	let res = []
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			if(typeof obj[key] === 'object'){
				res= res.concat(getKeys(obj[key]))
			}else{
				res.push(key)
			}
		}
	}
	return res
}

// 数组扁平化(腾讯一面)
function flat(arr){
	let res = []
	arr.forEach((item)=>{
		if(Array.isArray(item)){
			res = res.concat(flat(item))
		}else{
			res.push(item)
		}
	})
	return res
}

// 用promise实现sleep(腾讯一面)
function sleep(time){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve()
		},time)
	})
}

// 实现lodash_get(虾皮一面)
/*
lodash_get函数是通过传入的路径获取值,处理访问对象的属性时可能会出现undefined的情况
*/
function myGet(obj,path,defaultVal){
	let pathArr = path.split('.')
	for(let i=0;i<pathArr.length;i++){
		const key = pathArr[i]
		if(obj){
			obj = obj[key]
		}else{
			return defaultVal
		}
	}
	return obj === 'undefined' ? defaultVal : obj
}

// 反转字符串(滴滴一面)
function reverseString(str){
	str.split('').reverse().join('')
}

// 防抖(滴滴一面)
function debounce(fn,delay){
	let timer = null
	return function(){
		if(timer){
			clearTimeout(timer)
		}
		timer=setTimeout(()=>{
			fn.apply(this,arguments)
		},delay)
	}
}

// lodash.get(腾讯一面)
/*
给一个字符串，例如a.b.c a[0].b.c 用这个字符串去访问这个对象 如果能正确访问就返回取到的值 否则就返回自己设置的默认值
*/

function myGet(obj,str,defaultValue){
	let strArr = str.split('.')
	for(let i=0;i<strArr.length;i++){
		let key = strArr[i]
		if(obj[key]){
			obj = obj[key]
		}else{
			return defaultValue
		}
	}
	return obj === 'undefined' ? defaultValue : obj
} 

// 数组树型化(虾皮一面)
/*
data = [
 {id: 1, pid: null, name: '中国'},
 {id: 2, pid: 1, name: '广东省'},
 {id: 3, pid: 1, name: '四川省'},
 {id: 5, pid: 2, name: '深圳市'},
 {id: 4, pid: 2, name: '中山市'},
 {id: 8, pid: 1, name: '湖北省'},
]
*/
function treeify(arr,parentId=null){
	let ans= []
	arr.forEach((item)=>{
		if(item.pid === parentId){
			const obj={
				id:item.id,
				name:item.name,
				children:treeify(arr,item.id)
			}
			ans.push(obj)
		}
	})
	return ans
}

// promise限制最大并发数(腾讯一面)
function asyncPool(promises,limit){
	let res=[]
	let isRunning = 0
	let index = 0
	return new Promise((resolve,reject)=>{
		function fn(){
			if(isRunning === 0 && index >= promises.length){
				resolve(res)
				return
			}
			if(isRunning<limit && index < promises.length){
				let promise = promises[index++]
				isRunning++
				promise.then((data)=>{
					res.push(data)
				},(err)=>{
					reject(err)
				}).finally(()=>{
					isRunning--
					fn
				})
			}
		}
		fn()
	})
}