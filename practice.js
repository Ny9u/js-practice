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
*/
Array.prototype.reduce = (fn,value) => {
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
	return new Promise(resolve => setTimeout(resolve,time))
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