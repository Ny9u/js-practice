// 手写promise.all
/*
写的还是有点问题的,size这个变量其实是不需要的,反而是需要一个count变量
count用于记录有几个promise被执行成功了,决定最后的resolve
*/
const all = (array) => {
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
  let count = 0;
  return new Promise((resolve, reject) => {
    //写一个方法去记录count并将promise的结果存入数组
    const addData = (index, res) => {
      result[index] = res;
      count++;
      if (count === array.length) {
        resolve(result);
      }
    };
    array.foreach((promise, index) => {
      if (promise instanceof Promise) {
        promise.then(
          (res) => addData(index, res),
          (err) => reject(err)
        );
      } else {
        addData(index, promise);
      }
    });
  });
};

// 手写call
/*
这个有点忘了,该复习一下call,bind,apply这三者的区别和写法了
call:改变函数this指向,可以传入多个参数
apply:改变函数this指向,传入一个参数数组
bind: 改变函数this指向,并且返回一个函数(不执行函数内容),可以传入多个参数
*/
Function.prototype.call = function (context, ...args) {
  let result;
  context = context || window;
  context.fn = this;
  result = context.fn(args);
  delete context.fn;
  return result;
};

//手写reduce
/*
reduce的思路还是理解的,但是代码写出来结果差点意思
不能用箭头函数实现
*/
Array.prototype.reduce = function (fn, value) {
  // if(!value){
  //     value = this[0];
  // }
  // this.foreach((item)=>{
  //     value += item.fn()
  // })
  // return value;
  let result = value;
  let i = 0;
  //防止没有初始值的情况
  if (result === undefined) {
    result = this[i];
    i++;
  }
  while (i < this.length) {
    //对数组每一个元素都执行一次fn,并将结果累积给result
    result = fn(result, this[i]);
    i++;
  }
  return result;
};

// 手写树型化(列表转树)
// array = [{id:1,name:'名字1',parent:2}...]
const treeify = (array, parentId = null) => {
  let tree = [];
  array.foreach((item) => {
    if (item.parent === parentId) {
      let obj = {
        id: item.id,
        name: item.name,
        children: treeify(array, item.id),
      };
      tree.push(obj);
    }
  });
  return tree;
};

//手写防抖
/*
防抖:执行函数时在时间内如果再次执行需要重新计时(多次触发只执行最后一次)
这里需要注意返回的函数不能写箭头函数,因为箭头函数没有arguments,无法获取参数
*/
const debounce = (fn, wait) => {
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
  return function () {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};

// 手写ajax
/*
ajax:使用原生的xhr请求数据,并对响应数据进行处理
这个还是用的比较少的,特别是onreadystatechange这个函数,还有readyState这个属性
readyState等于4表示已完成接收
*/
const URL = "目标地址";
const xhr = new XMLHttpRequest();
xhr.open("get", URL);

xhr.onreadystatechange = () => {
  if (xhr.readyState !== 4) return;
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      //处理数据
    } else {
      //处理错误
    }
  }
};

//手写instanceof
/*
instanceof原理就是通过原型判断当前对象是否出现在函数的原型链上,返回true或false
获取原型最好不要直接用__proto__(es6),而是使用Object.getPrototypeOf(obj)
*/
const myInstanceof = (obj, fn) => {
  const proto = fn.prototype;
  while (proto) {
    if (obj.__proto__ === proto) {
      return true;
    }
    proto = proto.__proto__; //Object.getPrototypeOf(proto)
  }
  return false;
};

//手写深拷贝
/*
实现思路,先判断传入的数据的类型,然后遍历对象,是否是引用类型,然后选择是否递归调用
*/
const deepClone = (obj) => {
  // 对象类型判断
  // if(typeof obj !== 'object'){
  //     return obj;
  // }
  // let newObj = {}
  let newObj = Array.isArray(obj) ? [] : {}; //判断是对象还是数组
  for (let key in obj) {
    // 需要先判断是否存在这个key!!!!!!!!!!
    if (obj.hasOwnProperty(key)) {
      if (obj[key] !== Object) {
        newObj[key] = obj[key];
      } else {
        newObj[key] = deepClone(obj[key]);
      }
    }
  }
  return newObj;
};

//手写数组合并
/*
实现思路:合并两个有序数组,遍历返回新数组
*/
const merge = (arr1, arr2) => {
  let newArr = [];
  let i = 0,
    j = 0;
  while (i < arr1.size() && j < arr2.size()) {
    if (arr1[i] <= arr2[j]) {
      newArr.push(arr1[i]);
      i++;
    } else {
      newArr.push(arr2[j]);
      j++;
    }
  }
  if (i === arr1.size()) {
    while (j < arr2.size()) {
      newArr.push(arr2[j]);
      j++;
    }
  }
  if (j === arr2.size()) {
    while (i < arr1.size()) {
      newArr.push(arr1[i]);
      i++;
    }
  }
  return newArr;
};

// 手写 trim
/*
trim是字符串的方法,用于去除字符串首尾的空格
常见的实现思路是使用正则表达式去实现
*/
String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};

// 手写sleep
/*
sleep函数用来模拟代码延迟执行,一般用 promise和 setTimeout实现
*/
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// 手写数组扁平化 (数组拍平)
/*
扁平化的意思是将数组中的嵌套数组清除,变成一个一维数组
*/
function flat() {
  let newArr = [];
  // arr为需要处理的数组 n为需要拍平的层数,n=1为只拍平第一层
  return function flatten(arr, n) {
    const currentArr = [];
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        currentArr.push(...item);
      } else {
        currentArr.push(item);
      }
    });
    newArr = currentArr;
    return n > 1 ? flatten(newArr, n - 1) : newArr;
  };
}

// 返回数组中出现最多次的元素
/*
因为js中没有方便的数据结构可以使用,所以我们的思路一般就是遍历,使用对象或者map去记录次数
*/
Array.prototype.most = function () {
  let map = new Map();
  let max = 0;
  let element = null;
  this.forEach((item) => {
    if (map.has(item)) {
      map.set(item, map.get(item) + 1);
    } else {
      map.set(item, 1);
    }
  });
  // 遍历map,获取最多次的元素
  map.forEach((value, key) => {
    if (element === null || value > max) {
      max = value;
      element = key;
    }
  });
  return element;
};

// 手写lru
/*
lru:最近最少使用的元素
*/
/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.cache = new Map();
  this.capacity = capacity;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  if (this.cache.has(key)) {
    let tmp = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, tmp);
    return tmp;
  }
  return -1;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  // if(this.cache.has(key)){
  // 	this.cache.delete(key)
  // }
  // this.cache.set(key,value)
  // 忘记对容量进行判断了,如果超过容量应该删除最少使用的元素
  if (this.cache.has(key)) {
    this.cache.delete(key);
  } else if (this.cache.size >= this.capacity) {
    //获取到最少使用的元素的key,keys()获取到key的迭代器
    this.cache.delete(this.cache.keys().next().value);
  }
  this.cache.set(key, value);
};

// 获取下一个质数
/*
这个不是很常见,主要思路还是通过闭包实现,检查number是否合法
*/
function getNextPrime() {
  let number = 2;
  return function nextPrime() {
    while (true) {
      let isPrime = true;
      for (let i = 2; i < number; i++) {
        if (number % i === 0) {
          isPrime = false;
          number++;
          break;
        }
      }
      if (isPrime) {
        const prime = number;
        number++;
        return prime;
      }
    }
  };
}

// 给数字增加分隔符
/*
这个也算是比较少见的,一般是实现思路是遍历,每三位加一个分隔符
*/
function addSeparator(num) {
  let res = "";
  let number = num.toString();
  // let count = 1
  let count = 0;
  for (let i = number.length - 1; i >= 0; i--) {
    // if(count === 3){
    // 	res = ',' + res
    // 	res = number[i] + res
    // 	count = 1
    // }else {
    // 	res = number[i] + res
    // 	count++
    // }
    // 应该增加对最后一个数字的验证
    res = number[i] + res;
    count++;
    if (i !== 0 && count % 3 === 0) {
      res = "," + res;
    }
  }
  return res;
}

// 手写正则表达式匹配日期
/*
这个还是第一次见,有点奇葩,记录一下
*/
const regExp = /^\d{4}-\d{2}-\d{2}$/;
const date = "2025-01-01";
if (regExp.test(date)) {
  console.log("匹配成功");
} else {
  console.log("匹配失败");
}

// 手写发布订阅模式
/*
发布订阅模式还是挺常考的,主要是实现三个函数:发布事件,订阅事件,取消订阅事件
*/
class eventCenter {
  constructor() {
    this.events = {};
  }
  //发布事件
  emit(eventName, args) {
    //执行事件回调
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn(args);
      });
    }
  }
  //订阅事件
  on(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }
  //取消订阅
  off(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    let index = this.events[eventName].indexof(callback);
    if (index !== -1) {
      this.events[eventName].splice(index, 1);
    }
  }
}

// 手写once
/*
once函数是执行一次传入的函数,且在之后调用时不再生效,主要是依靠闭包实现
可以加个附加需求,就是之后调用时返回第一次时的返回值
*/
function once(fn) {
  let res = undefined;
  return function () {
    if (res) return res;
    const args = arguments;
    res = fn.apply(this, args);
    return res;
  };
}

// 手写柯里化
/*
柯里化的关键还是递归和闭包,通过闭包变量去记录当前参数个数,当参数个数达到要求之后才执行原函数
*/
function curry(fn) {
  let length = fn.length;
  let arr = [];
  return function _curry(...args) {
    let subArr = [...arr, ...args];
    args.push(...args);
    if (subArr.length >= length) {
      return fn.apply(this, subArr);
    } else {
      return _curry;
    }
  };
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
  let nextNode = head.next;
  let ans = nextNode || head;
  if (nextNode) head.next = null;
  while (nextNode) {
    let tmp = nextNode.next;
    ans = nextNode;
    nextNode.next = head;
    head = nextNode;
    nextNode = tmp;
  }
  return ans;

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
  if (!Array.isArray(arr)) {
    return 0;
  }
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      maxDepth = Math.max(maxDepth, getMaxDepth(arr[i]) + 1);
    }
  }
  return maxDepth;
}

// 手写promise链式调用
let promise = new Promise((resolve, reject) => {
  // 执行异步操作
  if (true) {
    // 执行成功
    resolve("success");
  } else {
    // 执行失败
    reject("error");
  }
})
  .then(
    (data1) => {
      console.log(data1);
      return "data2"; // 返回一个已解决的promise
    },
    (err1) => {
      console.log(err1);
    }
  )
  .then((data2) => {
    console.log(data2);
  });

// 手写深拷贝
/*
要求: 支持对象,数组,基本数据类型的深拷贝
*/
function deepClone(obj) {
  let res = null;
  if (typeof obj !== "object") {
    res = obj;
    return res;
  }
  res = Array.isArray(obj) ? [] : {};
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] !== "object") {
        res[key] = obj[key];
      } else {
        res[key] = deepClone(obj[key]);
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
  let res = [];
  if (arr.length === 0) return res;
  return new Promise((resolve, reject) => {
    res = Array(arr.length);
    const addResult = function (result, index) {
      res[index] = result;
      if (index === arr.length - 1) resolve(res);
    };
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] instanceof Promise) {
        arr[i].then((res) => {
          addResult(res, i);
        });
      } else {
        addResult(arr[i], i);
      }
    }
  });
};

// 实现一个防抖函数
/*
要求:防抖函数debounce，在指定时间内只执行一次
*/
function debounce(fn, time) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, time);
  };
}

// 实现vue的双向数据绑定
/*
const vm = new Vue({
  data: { message: 'Hello' },
  el: '#app'
});
要求:当修改 vm.message 时，视图自动更新
*/
Object.defineProperty(vm, "message", {
  get() {
    return vm.data.message;
  },
  set(newVal) {
    if (newVal === vm.data.message) return;
    vm.data.message = newVal;
    // 触发dom更新
  },
});

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
function makeAdd() {
  let sum = 0;
  return function add() {
    const num = arguments;
    if (arguments.length !== 0) {
      sum = sum + arguments[0];
      return add;
    } else {
      return sum;
    }
  };
}

// 实现instanceof
function myInstanceof(obj, parent) {
  const prototype = parent.prototype;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === prototype) {
      return true;
    } else {
      proto = Object.getPrototypeOf(proto);
    }
  }
  return false;
}

// 实现数组扁平化
/*
要求:实现 flattenDeep([1, [2, [3]]]) => [1,2,3]
*/
function flattenDeep(arr) {
  if (arr.length === 0) return;
  let res = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      // 数组拼接用concat
      res.concat(flattenDeep(item));
    } else {
      res.push(item);
    }
  });
  return res;
}

// 实现节流
function throttle(fn, interval) {
  let time = null;
  return function () {
    let now = new Date();
    if (!time || now - time > interval) {
      fn.apply(this, arguments);
      time = now;
    }
  };
}

// 实现发布订阅模式
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (this.events[event]) {
      return;
    } else {
      this.events[event] = callback;
    }
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event](...args);
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      delete this.events[event];
    }
  }
}

// 实现bind
Function.prototype.bind = function (context, ...args) {
  // const fn = this
  // return function(){
  // 	fn.apply(context,args)
  // }
  const self = this;
  return function (...innerArgs) {
    return self.apply(
      // 这里判断是为了内部函数作为构造函数被new时this可以正确指向新对象
      this instanceof self ? this : context,
      args.concat(innerArgs)
    );
  };
};

// 手写call
Function.prototype.call = function (context, ...args) {
  context = context || window;
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};

// 手写apply
Function.prototype.apply = function (context, args) {
  context = context || window;
  context.fn = this;
  const result = context.fn(args);
  delete context.fn;
  return result;
};

// 数组去重(多种方法)
function unique1(arr) {
  // from将类数组对象/可迭代对象转为数组
  return Array.from(new Set(arr));
}

function unique2(arr) {
  return Array.filter((item, index, arr) => {
    return arr.indexOf(item) === index;
  });
}

function unique3(arr) {
  arr.reduce((arr, cur) => {
    acc.includes(cur) ? acc : [...acc, cur];
  }, []);
}

function unique4(arr) {
  const map = new Map();
  let res = [];
  arr.forEach((item) => {
    if (!map.has(item)) {
      map.set(item, true);
      res.push(item);
    }
  });
  return res;
}

// 实现深拷贝
/*
要求:支持对象,数组,循环引用的深拷贝
*/
function deepClone(obj, map = new Map()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (map.has(obj)) return map.get(obj);
  let res = Array.isArray(obj) ? [] : {};
  map.set(obj, res);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        res[key] = deepClone(obj[key], map);
      } else {
        res[key] = obj[key];
      }
    }
  }
  return res;
}

// 实现函数柯里化
/*
实现代码，满足：
 add(1)(2) => 3
 add(1)(2)(3) => 6
*/
function curry(fn, ...args) {
  // 这种柯里化首先要获取的就是总的参数长度
  let length = fn.length;
  let arg = args || [];
  return function () {
    //然后在内部函数判断是否超过总参数长度,超过则执行原函数,否则继续柯里化
    let newArg = arg.concat(Array.from(arguments));
    if (newArg.length >= length) {
      return fn.apply(this, newArg);
    } else {
      // 调用call,这样newArg就能同步到arg
      return curry.call(this, fn, ...newArg);
    }
  };
}

// 手写new
Function.prototype.New = function (...args) {
  let obj = {};
  obj.__proto__ = this.prototype;
  const res = this.apply(obj, args);
  return Object(res) ? res : obj;
};

// 手写数字千分位格式化
function format(num) {
  const str = num.toString();
  let res = "";
  for (let i = str.length - 1; i >= 0; i--) {
    res = res + str[i];
    if ((str.length - i) % 3 === 0 && i !== 0) {
      res = res + ",";
    }
  }
  return res.split("").reverse().join("");
}

// 带并发限制的异步调度器
class Worker {
  constructor(limit) {
    this.limit = limit;
    this.task = [];
    this.num = 0;
  }

  add(fn) {
    this.task.push(fn);
  }

  async run() {
    if (this.num >= this.limit || this.task.length <= 0) return;
    this.num++;
    const fn = this.task.shift();
    let res;
    try {
      res = await fn();
    } catch {
      //报错处理
    } finally {
      this.num--;
    }
    return res;
  }
}

// 观察者模式实现event类
class Event {
  constructor() {
    this.events = {};
  }

  emit(event) {
    if (this.events[event]) {
      this.events[event].forEach((fn) => {
        fn();
      });
    }
  }

  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  off(event, fn) {
    if (!this.events[event]) return;
    const index = this.events[event].indexOf(fn);
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  }
}

// 深拷贝(字节日常一面)
function deepClone(obj, map = new Map()) {
  let res = null;
  if (obj === null || typeof obj !== "object") {
    res = obj;
    return res;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  res = Array.isArray(obj) ? [] : {};
  map.set(obj, res);
  for (let key in obj) {
    if (obj.hasOwnPerperty(key)) {
      if (typeof obj[key] === "object") {
        res[key] = deepClone(obj[key], map);
      } else {
        res[key] = obj[key];
      }
    }
  }
  return res;
}

// 手写promise.all(字节二面)
Promise.prototype.all = function (arr) {
  let ans = [];
  if (arr.length === 0) return ans;
  return new Promise((resolve, reject) => {
    ans = Array(arr.length);
    arr.forEach((item, index) => {
      if (item instanceof Promise) {
        item.then(
          (res) => {
            ans[index] = res;
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        ans[index] = item;
      }
      if (index === arr.length - 1) resolve(ans);
    });
  });
};

// 实现带once的发布订阅模式(字节一面)
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  off(event, fn) {
    if (!this.events[event]) return;
    const index = this.events[event].indexOf(fn);
    this.events[event].splice(index, 1);
  }

  emit(event, args) {
    if (!this.events[event]) return;
    this.events[event].forEach((fn) => {
      fn(args);
    });
  }
  once(event, fn) {
    const onceFn = (...args) => {
      //在注册的事件中取消该回调
      fn(...args);
      this.off(event, onceFn);
    };
    this.on(event, onceFn);
  }
}

// 手写列表转树形结构
// array = [{id:1,name:'名字1',parent:2}...]
function toTree(arr, parentId) {
  let tree = [];
  arr.forEach((item) => {
    if (item.parent === parentId) {
      let obj = {
        id: item.id,
        name: item.name,
        children: toTree(arr, item.id),
      };
      tree.push(obj);
    }
  });
  return tree;
}

// 手写对象的深比较
function isEqual(obj1, obj2) {
  if (
    obj1 === null ||
    obj2 === null ||
    obj1 === undefined ||
    obj2 === undefined
  ) {
    return obj1 === obj2;
  }
  if (typeof obj1 !== "object") {
    return obj1 === obj2;
  } else {
    for (key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        if (
          isEqual(obj1[key], obj2[key]) === false ||
          obj2.hasOwnPerperty(key) === false
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// promise.race
Promise.prototype.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      if (promise instanceof Promise) {
        promise.then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        resolve(promise);
      }
    });
  });
};

// 手撕 Promise 异步并发限制数量的图片上传(百度一面)
function asyncPool(pics, uploadFn, limit) {
  let res = [];
  let isRunning = 0;
  let index = 0;

  return new Promise((resolve, reject) => {
    function uploadPic() {
      if (isRunning === 0 && index >= pics.length) {
        resolve(res);
        return;
      }
      if (isRunning < limit && index < pics.length) {
        let pic = pics[index++];
        isRunning++;
        uploadFn(pic)
          .then((data) => {
            res.push(data);
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            isRunning--;
            uploadPic();
          });
      }
    }
    uploadPic();
  });
}

// 手写深拷贝(网易一面)
function deepClone(obj, map = new Map()) {
  let res;
  if (typeof obj !== "object") {
    res = obj;
    return res;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  map.set(obj, res);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        res[key] = deepClone(obj[key], map);
      } else {
        res[key] = obj[key];
      }
    }
  }
  return res;
}

// 手写防抖(哈啰一面)
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// 提取URL参数
// "https://example.com/page?name=JohnDoe&age=25&city=New+York"
function getUrlParams(url) {
  let res = {};
  const params = url.split("?")[1].split("&");
  params.forEach((param) => {
    let args = param.split("=");
    res[args[0]] = args[1];
  });
  return res;
}

// 手写promise.all(蔚来一面)
promise.prototype.all = function (promises) {
  let res = [];
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      if (promise instanceof Promise) {
        promise.then(
          (res) => {
            res.push(res);
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        res.push(promise);
      }
      if (index === promises.length) {
        resolve(res);
      }
    });
  });
};

// 手写数字千分位(作业帮一面)
function addComma(num) {
  let numStr = num.toString();
  let res = "";
  let count = 0;
  for (let i = numStr.length - 1; i >= 0; i--) {
    if (count % 3 === 0 && count !== 0) {
      res += ",";
    }
    res += numStr[i];
    count++;
  }
  return res.split("").reverse().join("");
  // 也可以用正则结合replace实现
  // /(\d)(?=(\d{3})+(?!\d))/g
}

// 数组reduce实现累加(小红书一面)
function addSum(arr) {
  return arr.reduce((acc, cur) => {
    return (acc += cur);
  }, 0);
}

// 求两个数组的公共部分
function commonArray(arr1, arr2) {
  let res = [];
  arr1.forEach((item) => {
    if (arr2.includes(item)) {
      res.push(item);
    }
  });
}

// 手写apply(虾皮一面)
Function.prototype.apply = function (context, args) {
  context = context || window;
  context.fn = this;
  const res = context.fn(...args);
  delete context.fn;
  return res;
};

// 实现一个LRU(最近最少使用)类(小红书二面)
class LRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      let value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      //删除最近最少使用的元素
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}

// 输出多级嵌套结构的 Object 的所有 key 值
function getKeys(obj) {
  let res = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        res = res.concat(getKeys(obj[key]));
      } else {
        res.push(key);
      }
    }
  }
  return res;
}

// 数组扁平化(腾讯一面)
function flat(arr) {
  let res = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      res = res.concat(flat(item));
    } else {
      res.push(item);
    }
  });
  return res;
}

// 用promise实现sleep(腾讯一面)
function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 实现lodash_get(虾皮一面)
/*
lodash_get函数是通过传入的路径获取值,处理访问对象的属性时可能会出现undefined的情况
*/
function myGet(obj, path, defaultVal) {
  let pathArr = path.split(".");
  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i];
    if (obj) {
      obj = obj[key];
    } else {
      return defaultVal;
    }
  }
  return obj === "undefined" ? defaultVal : obj;
}

// 反转字符串(滴滴一面)
function reverseString(str) {
  str.split("").reverse().join("");
}

// 防抖(滴滴一面)
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// lodash.get(腾讯一面)
/*
给一个字符串，例如a.b.c a[0].b.c 用这个字符串去访问这个对象 如果能正确访问就返回取到的值 否则就返回自己设置的默认值
*/

function myGet(obj, str, defaultValue) {
  let strArr = str.split(".");
  for (let i = 0; i < strArr.length; i++) {
    let key = strArr[i];
    if (obj[key]) {
      obj = obj[key];
    } else {
      return defaultValue;
    }
  }
  return obj === "undefined" ? defaultValue : obj;
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
function treeify(arr, parentId = null) {
  let ans = [];
  arr.forEach((item) => {
    if (item.pid === parentId) {
      const obj = {
        id: item.id,
        name: item.name,
        children: treeify(arr, item.id),
      };
      ans.push(obj);
    }
  });
  return ans;
}

// promise限制最大并发数(腾讯一面)
function asyncPool(promises, limit) {
  let res = [];
  let isRunning = 0;
  let index = 0;
  return new Promise((resolve, reject) => {
    function fn() {
      if (isRunning === 0 && index >= promises.length) {
        resolve(res);
        return;
      }
      if (isRunning < limit && index < promises.length) {
        let promise = promises[index++];
        isRunning++;
        promise
          .then(
            (data) => {
              res.push(data);
            },
            (err) => {
              reject(err);
            }
          )
          .finally(() => {
            isRunning--;
            fn;
          });
      }
    }
    fn();
  });
}

// 二分查找(字节一面)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  // 根据数组性质进行排序
  // arr.sort()
  while (left < right) {
    let index = (right - left) >> 1;
    if (arr[index] === target) {
      return index;
    } else if (arr[index] > target) {
      right = index - 1;
    } else if (arr[index] < target) {
      left = index + 1;
    }
  }
  return -1;
}

// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// 节流
function throttle(fn, time) {
  let lastTime = null;
  return function () {
    let now = new Date();
    if (!lastTime || now - time >= lastTime) {
      fn.apply(this, arguments);
      lastTime = now;
    }
  };
}

// 深拷贝
function deepClone(obj, map = new Map()) {
  let ans = null;
  if (typeof obj !== "object") {
    ans = obj;
    return ans;
  }
  if (map.get(obj)) {
    return map.get(obj);
  }
  ans = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        ans[key] = deepClone(obj[key], map);
      } else {
        ans[key] = obj[key];
      }
    }
  }
  map.set(obj, ans);
  return ans;
}

// 获取对应节点中的所有子节点
/*
const obj = {
	id:1,
	child:[
		{
			id:2,
			child:[
				{
					id:3,
					child:[...]
				}
			]
		}
	]
}
*/
function getChilds(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(arr[i].id);
    if (arr[i].child) {
      res = res.concat(getChilds(arr[i].child));
    }
  }
  return res;
}

function fn(obj, id) {
  for (let key in obj) {
    if (obj[key] === id) {
      return getChilds(obj.child);
    } else if (typeof obj[key] === "object") {
      return fn(obj[key], id);
    }
  }
}

// 求出数组的所有子集
function getChildArray(arr) {
  let res = [[]];
  for (let i = 0; i < arr.length; i++) {
    let newChildArr = res.map((a) => [...a, arr[i]]); //往res每一个子集中加入arr[i]
    res = [...res, ...newChildArr];
  }
  return res;
}

// 发布订阅模式
class EventEmitter {
  constructor() {
    this.events = {};
  }

  emit(event, args) {
    if (this.events[event]) {
      this.events[event].forEach((fn) => {
        fn(args);
      });
    }
  }

  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  off(event, fn) {
    if (!this.events[event]) return;
    let index = this.events[event].indexOf(fn);
    this.events[event].splice(index, 1);
  }
}

// 手写flat
function flat(arr) {
  let res = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      res = res.concat(flat(item));
    } else {
      res.push(item);
    }
  });
  return res;
}

//字符串中每个字符出现的字数
function getStrCount(str) {
  let res = new Map();
  for (let i = 0; i < str.length; i++) {
    res.set(str[i], res.has(str[i]) ? res.get(str[i]) + 1 : 1);
  }
  return res;
}

/*判断有效括号

给定一个只包括 `'('` ，`')'` ，`'{'` ，`'}'` ，`'['` ，`']'` 的字符串，判断字符串是否有效。

有效字符串需满足：

- 左括号必须用相同类型的右括号闭合。
- 左括号必须以正确的顺序闭合。

注意空字符串可被认为是有效字符串。*/
//输入: "()"
//输出: true

function fn(str) {
  let arr = [];
  for (let i = 0; i < str.length; i++) {
    let topValue = arr.length > 0 ? arr[arr.length - 1] : null;
    if (
      str[i] === "(" ||
      str[i] === "{" ||
      str[i] === "[" ||
      topValue === null
    ) {
      arr.push(str[i]);
    } else {
      if (arr.length === 0) return false;
      if (str[i] === ")") {
        if (topValue !== "(") return false;
        arr.pop();
      }
      if (str[i] === "}") {
        if (topValue !== "{") return false;
        arr.pop();
      }
      if (str[i] === "]") {
        if (topValue !== "[") return false;
        arr.pop();
      }
    }
  }
  return true;
}

// vnode转化为html(腾讯一面)
/*
const vnode = {
  tag: 'div',
  props: {
    id: 'container',
    class: 'wrapper',
  },
  children: [
    { tag: 'h1', props: {}, children: [{ text: 'Hello, World!' }] },
    { tag: 'p', props: { style: 'color: red;' }, children: [{ text: 'This is a paragraph.' }] },
  ],
};
*/
function vnodeToHtml(vnode) {
  if (vnode.text) {
    return vnode.text;
  }
  let html = `<${vnode.tag}`;
  if (vnode.props) {
    for (let key in vnode.props) {
      if (vnode.props.hasOwnProperty(key)) {
        html += ` ${key}="${vnode.props[key]}"`;
      }
    }
  }
  if (vnode.children) {
    for (let child of vnode.children) {
      html += vnodeToHtml(child);
    }
  }
  html += `${vnode.tag}>`;
  return html;
}

// 实现并发控制的promise,实现100个请求,一次执行10个(小红书一面)
function fn(promises, limit) {
  let res = [];
  let pendingList = [];
  let isPending = 0;
  let index = 0;
  return new Promise((resolve, reject) => {
    function run() {
      if (index >= promises.length) {
        promise.allSettled(pendingList).then((data) => {
          res.concat(data);
          resolve(res);
        });
        return;
      }
      while (isPending < limit && index < promises.length) {
        pendingList.push(promises[index]);
        isPending++;
        index++;
      }
      if (pendingList.length === limit) {
        Promise.allSettled(pendingList).then((data) => {
          res = res.concat(data);
          isPending = 0;
          pendingList = [];
          run();
        });
      }
    }
    run();
  });
}

// 防抖(小红书一面)
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// 数字逆序输出，用%和/实现(小红书一面)
function reverseNumber(num) {
  let reverseNum = 0;
  let isNegative = false;
  if (num < 0) {
    num = -num;
    isNegative = true;
  }
  while (num > 0) {
    const lastNum = num % 10;
    num = Math.floor(num / 10);
    reverseNum = reverseNum * 10 + lastNum;
  }
  return isNegative === false ? reverseNum : -reverseNum;
}

// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let left = [];
  let right = [];
  let pivot = arr[0];
  arr.forEach((item) => {
    if (item < pivot) {
      left.push(item);
    } else if (item > pivot) {
      right.push(item);
    }
  });
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 对url参数进行解析(作业帮笔试)
/*
对url进行解析,提取其协议域名端口号参数锚点等,元素之间用逗号分隔,返回一个字符串
*/
function parseUrl(url) {
  let Url = new URL(url);
  let res = "";
  const protocol = Url.protocol || ""; // 协议
  const hostname = Url.hostname || ""; // 域名
  const port = Url.port || ""; // 端口号
  const pathname = Url.pathname || ""; // 路径
  const searchParams = Url.search || ""; // 查询参数
  const hash = Url.hash || ""; // 锚点
  res = [protocol, hostname, port, pathname, searchParams, hash].join(",");
  return res;
}

// 实现颜色代码转换(作业帮笔试)
/*
如果颜色代码不足6位时会自动进行补全,#0A0 => #00AA00
*/
function colorToHex(color) {
  let code = color.slice(1);
  if (code.length === 3) {
    code = code
      .split("")
      .map((item) => item + item)
      .join("");
  }
  // 十六进制转十进制
  const a = parseInt(code.slice(0, 2), 16);
  const b = parseInt(code.slice(2, 4), 16);
  const c = parseInt(code.slice(4, 6), 16);

  return `rgb(${a},${b},${c})`;
}

// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let p = arr[0];
  let left = [];
  let right = [];
  for (let i = 1; i < arr.length; i++) {
    if (nums[i] < p) {
      left.push(nums[i]);
    } else {
      right.push(nums[i]);
    }
  }
  return [...quickSort(left), p, ...quickSort(right)];
}

// 节流(快手二面)
function throttle(fn, delay) {
  let lastTime = null;
  return function () {
    let cur = new Date();
    if (cur - lastTime > delay || !lastTime) {
      fn.apply(this, arguments);
      lastTime = cur;
    }
  };
}

// vnode转为html(快手二面)
/*const vnode = {
  tag: 'div',
  props: {
    id: 'container',
    class: 'wrapper',
  },
  children: [
    { tag: 'h1', props: {}, children: [{ text: 'Hello, World!' }] },
    { tag: 'p', props: { style: 'color: red;' }, children: [{ text: 'This is a paragraph.' }] },
  ],
};*/
function vnodeToHtml(vnode) {
  if (vnode.text) {
    return vnode.text;
  }
  let html = `<${vnode.tag}`;
  if (vnode.props) {
    for (let key in vnode.props) {
      if (vnode.props.hasOwnProperty(key)) {
        html += ` ${key}="${vnode.props[key]}"`;
      }
    }
  }
  html += `>`;
  if (vnode.children) {
    for (let child of vnode.children) {
      html += vnodeToHtml(child);
    }
  }
  html += `</${vnode.tag}>`;
  return html;
}

// promise.all(快手一面)
Promise.prototype.all = function (promises) {
  let ans = [];
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      if (promise instanceof Promise) {
        promise.then(
          (res) => {
            ans[index] = res;
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        ans[index] = promise;
      }
      if (ans.length === promises.length) {
        resolve(ans);
      }
    });
  });
};

// 快排(快手一面)
function quickSort(arr) {
  let p = arr[0];
  let left = [];
  let right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < p) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), p, ...quickSort(right)];
}

// 发布订阅模式(快手一面)
class EventEmiiter {
  constructor() {
    this.events = {};
  }

  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  off(event, fn) {
    if (this.events[event].indexOf(fn) > -1) {
      this.events[event].splice(this.events[event].indexOf(fn), 1);
    }
  }

  emit(event, args) {
    if (this.events[event]) {
      this.events[event].forEach((fn) => {
        fn(args);
      });
    }
  }
}

// 深拷贝(快手一面)
function deepClone(obj, map = new Map()) {
  if (typeof obj !== "object") {
    return obj;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  let res = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnPerperty(key)) {
      if (typeof obj[key] !== "object") {
        res[key] = obj[key];
      } else {
        res[key] = deepClone(obj[key]);
      }
    }
  }
  map.set(obj, res);
  return res;
}

// 限制最大并发数(腾讯音乐一面)
class promiseController {
  constructor(limit) {
    this.queue = [];
    this.limit = limit;
    this.isRunning = 0;
  }

  add(fn) {
    this.queue.push(fn);
  }
  async run() {
    if (this.isRunning >= this.limit || this.queue.length === 0) return;
    let promise = queue.shift();
    this.isRunning++;
    const res = await promise();
    this.isRunning--;
    return res;
  }
}

// 事件总线(腾讯音乐二面)
class eventEmitter {
  constructor() {
    this.event = {};
  }
  on(eventName, fn) {
    if (!this.event[eventName]) {
      this.event[eventName] = [];
    }
    this.event[eventName].push(fn);
  }

  off(eventName, fn) {
    if (!this.event[eventName]) return;
    let index = this.event[eventName].indexOf(fn);
    if (index !== -1) {
      this.event[eventName].splice(index, 1);
    }
  }

  emit(eventName, args) {
    if (!this.event[eventName]) return;
    this.event[eventName].forEach((fn) => {
      fn(args);
    });
  }
}

// 解析url
function praseUrl(url) {
  let res = {};
  let arr = url.split("?")[1];
  if (arr) {
    params = arr.split("&");
    params.forEach((param) => {
      param = param.split("=");
      res[param[0]] = param[1];
    });
  }
  return res;
}

// 消除字符串中相同元素(美团二面)
/*
字符串'aabbcc'→''，'aevccvm'→'aem'
*/
function deleteSame(str) {
  let stack = [];
  let n = str.length;
  for (let i = 0; i < n; i++) {
    let top = stack.length > 0 ? stack[stack.length - 1] : null;
    if (str[i] === top) {
      stack.pop();
    } else {
      stack.push(str[i]);
    }
  }
  if (stack.length === 0) return "";
  return stack.join("");
}

// 数组去重(美团一面)
function unique(arr) {
  return arr.reduce((acc, cur) => {
    if (!acc.includes(cur)) {
      acc.push(cur);
    }
    return acc;
  }, []);
}

// 链表去重(美团一面)
function unique(head) {
  let map = new Map();
  let dummy = new ListNode(0, head);
  let cur = dummy;
  if (!head) return null;
  while (cur.next) {
    if (map.has(cur.next.val)) {
      cur.next = cur.next.next;
    } else {
      map.set(cur.next.val, true);
      cur = cur.next;
    }
  }
  return dummy.next;
}

// 手写bind (b站一面)
Function.prototype.bind = function (context, ...args) {
  let self = this;
  return function () {
    return self.apply(
      this instanceof self ? this : context,
      args.concat(arguments)
    );
  };
};

// 解析URL参数为对象(美团一面)
function parseUrl(url) {
  let res = {};
  let params = url.split("?")[1].split("&");
  params.forEach((param) => {
    let a = param.split("=");
    res[a[0]] = a[1];
  });
  return res;
}

// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, delay);
    } else {
      clearTimeout(timer);
    }
  };
}

// 节流
function throttle(fn, delay) {
  let time = null;
  return function () {
    if (Date.now() - time > delay || !time) {
      fn.apply(this, arguments);
      time = Date.now();
    }
  };
}

// 将一个js对象转换成可迭代的对象,用symbol.iterator实现(高德一面)
// 要求转换后的对象for of 的item是返回对象key,value的数组
/*
对象的 [Symbol.iterator] 方法是一个特殊的方法，用于实现 可迭代协议（iterable protocol）
function*()是一个生成器函数,yield关键字用于暂停函数的执行并返回一个值,类似于输出
*/
obj[Symbol.iterator] = function* () {
  for (let key in this) {
    if (this.hasOwnProperty(key)) {
      yield [key, this[key]];
    }
  }
};

// 使用Math.random实现[min,max)和[min,max]的随机数(高德一面)
function random1(min, max) {
  let a = Math.random();
  return min + a * (max - min);
}

function random2(min, max) {
  let a = Math.random();
  return min + Math.ceil(a * (max - min)); //Math.ceil进行向上取整,[0,max-min)-->[0,max-min]
}

// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let index = Math.floor(Math.random() * arr.length);
  let p = arr[index];
  let left = [];
  let right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < p) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), p, ...quickSort(right)];
}

// 实现一个监听器函数,返回当前值和前一个值(高德一面)
// const count = ref(0)
function usePrevious(count) {
  let cur = count.value;
  let prev = undefined;
  watch(count, (oldVal, newVal) => {
    cur = newVal;
    prev = oldVal;
  });
  return {
    cur,
    prev,
  };
}

// 发布订阅模式
class EventEmitter {
  constructor() {
    this.Events = {};
  }

  add(event, fn) {
    if (!Events[event]) {
      Events[event] = [];
    }
    Events[event].push(fn);
  }

  emit(event, ...args) {
    if (!Events[event]) return;
    Events[event].forEach((fn) => {
      fn(...args);
    });
  }

  delete(event, fn) {
    if (!Events[event]) return;
    let index = Events[event].indexOf(fn);
    if (index !== -1) {
      Events[event].splice(index, 1);
    }
  }
}

// promise.all
Promise.prototype.all = function (promises) {
  let ans = [];
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      if (promise instanceof Promise) {
        promise.then(
          (res) => {
            ans.push(res);
            if (ans.length === promises.length) {
              resolve(ans);
            }
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        ans.push(res);
        if (ans.length === promises.length) {
          resolve(ans);
        }
      }
    });
  });
};

// 数组乱序输出
function randomArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// 实现一个有时间限制的异步任务
function timeLimitFunc(fn, time) {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      reject("超时");
    }, time);
    Promise.race([fn, timer]).then((res) => {
      resolve(res);
    });
  });
}

// 实现一个并发控制器
class Controller {
  constructor(limit) {
    this.limit = limit;
    this.queue = []; // 任务队列
    this.running = 0;
  }

  add(task) {
    this.queue.push(task);
  }

  run() {
    if (this.running >= this.limit || this.queue.length === 0) return;
    const fn = this.queue.shift();
    this.running++;
    fn().then(
      () => {
        this.running--;
      },
      (err) => {
        this.running--;
        throw new Error(err);
      }
    );
  }
}

// 手撕深拷贝
function deepClone(obj, map = new Map()) {
  if (obj === null || typeof obj !== "object" || typeof obj === "function") {
    return obj;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  // 处理Date
  if (obj instanceof Date) {
    return new Date(obj);
  }
  // 处理map
  if (obj instanceof Map) {
    let newMap = new Map();
    map.set(obj, newMap);
    obj.forEach((value, key) => {
      newMap.set(deepClone(key, map), deepClone(value, map));
    });
    return newMap;
  }
  // 处理set
  if (obj instanceof Set) {
    let newSet = new Set();
    map.set(obj, newSet);
    obj.forEach((value) => {
      newSet.add(deepClone(value, map));
    });
    return newSet;
  }
  let a = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      a[key] =
        typeof obj[key] === "object" ? deepClone(obj[key], map) : obj[key];
    }
  }
  map.set(obj, a);
  return a;
}

// 手撕URL解析
function parseUrl(url) {
  let params = url.split("?")[1].split("&");
  let ans = {};
  for (param of params) {
    let a = param.split("=");
    ans[a[0]] = a[1];
  }
  return ans;
}

// 手撕Object.create
function myCreate(obj) {
  function fn() {}
  let newObj = new fn();
  fn.prototype = obj;
  newObj.__proto__ = obj;
  return newObj;
}

// 手撕防抖
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      timer = clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// 手撕节流
function throttle(fn, wait) {
  let lastTime = null;
  return function () {
    if (!lastTime || Date.now() - wait > lastTime) {
      lastTime = Date.now();
      fn.apply(this, arguments);
    }
  };
}

function curry(fn, ...args) {
  let oldArg = [];
  let n = args.length;
  let func = fn;
  return function _curry(...args) {
    let newArg = args.concat(oldArg);
    oldArg = newArg;
    if (newArg.length >= n) {
      func.apply(this, newArg);
    } else {
      return _curry;
    }
  };
}

async function async1() {
  console.log("a");
  await async2();
  console.log("b");
}

async function async2() {
  console.log("c");
}

console.log("d");
async1();

setTimeout(() => {
  console.log("e");
}, 0);

new Promise((resolve, reject) => {
  console.log("f");
  resolve();
}).then(() => {
  console.log("g");
});

Object.defineProperty(name, {
  getter() {
    console.log(this.name);
  },
  setter(newVal, oldVal) {
    this.name = newVal;
    console.log(this.name);
  },
});

const a = ["1.2.3", "1.2.4", "0.0.1", "0.1.0", "2.3.4.5"];
// 1.2.4 1.24
// 12.4 1.24
// 0.1 0.1.0
function versionNumberSort(a) {}

function Foo() {
  getName = function () {
    alert(1);
  };
  return this;
}

Foo.getName = function () {
  alert(2);
};

Foo.prototype.getName = function () {
  alert(3);
};

var getName = function () {
  alert(4);
};

function getName() {
  alert(5);
}

Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();

function sum(...args) {
  let n = args.length;
  let oldArg = [];
  return function mySum(...args) {
    let newArg = [].concat(args);
    oldArg = newArg;
    function sumOf() {
      let a = newArg.reduce((arr, cur) => arr + cur);
      return a;
    }
    return mySum;
  };
}

const obj = sum(1, 2, 3, 4).sumOf();
console.log(obj);

//给定一个整数数组 a，其中1 ≤ a[i] ≤ n （n为数组长度）, 其中有些元素出现两次而其他元素出现一次。
//找到所有出现两次的元素。

function fn(arr) {
  let n = arr.length;
  let a = new Array(n + 1).fill(0);
  let ans = [];
  for (let i = 0; i < n; i++) {
    let obj = arr[i];
    a[obj]++;
  }
  a.forEach((item, index) => {
    if (item === 2) {
      ans.push(index);
    }
  });
  return ans;
}

// 手写Object.create
function myCreate(obj) {
  function fn() {}
  let newObj = new fn();
  newObj.__proto__ = obj;
  fn.prototype = obj;
  return newObj;
}

function makeTree(arr, left, right) {
  let n = arr.length;
  let ans = [];
  function build(arr, left, right) {
    if (left > right) return;
    let mid = left + Math.floor((right - left) / 2);
    let root = arr[mid];
    ans.push(root);
    build(arr, left, mid - 1); //左节点
    build(arr, mid + 1, right); //右节点
  }
  build(arr, 0, n - 1);
  return ans;
}

// 二叉搜索树（BST）里找到第 K 大的值
//利用二叉搜索树的特性,中序遍历可以获取一个升序的数组,我们翻过来即可
function findTopK(root) {
  let count = 0;
  let ans = null;
  function dfs(root) {
    if (!root) return;
    dfs(root.right);
    count++;
    if (count === k) {
      ans = root.val;
    }
    dfs(root.left);
  }
  dfs(root);
  return ans;
}

// 数字千分位
function formatNum(num) {
  let numStr = num.toString();
  let n = numStr.length;
  let res = "";
  for (let i = 0; i < n; i++) {
    if (i % 3 === 0 && i !== 0) {
      res = numStr[n - i - 1] + "." + res;
    } else {
      res = numStr[n - i - 1] + res;
    }
  }
  return res;
}

// 防抖
function debounce(fn, delay) {
  // 随时开启一个定时器,定时结束才触发函数,适用于搜索
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// 节流
function throttle(fn, wait) {
  //执行完函数之后需要等待一段时间才能继续执行,通过记录上一次的执行时间决定
  let lastTime = null;
  return function () {
    let now = Date.now();
    if (!lastTime || now - lastTime > wait) {
      fn.apply(this, arguments);
      lastTime = now;
    }
  };
}

// promise.all
Promise.prototype.all = function (promises) {
  return new Promise((resolve, reject) => {
    let n = promises.length;
    let ans = new Array(n);
    function add(res, i) {
      ans[i] = res;
      if (i === n - 1) {
        resolve(ans);
      }
    }
    for (let i = 0; i < n; i++) {
      if (promises[i] instanceof Promise) {
        promises[i].then(
          (res) => add(res, i),
          (err) => reject(err)
        );
      } else {
        add(promises[i], i);
      }
    }
  });
};

// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// 深拷贝
function deepClone(obj, map = new Map()) {
  let ans = null;
  if (typeof obj !== "object") {
    ans = obj;
    return ans;
  }
  // 避免循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }
  if (obj instanceof Array) {
    ans = [];
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "object") {
        ans[i] = deepClone(obj[i], map);
      } else {
        ans[i] = obj[i];
      }
    }
    map.set(obj, ans);
    return ans;
  }
  if (obj instanceof Object) {
    ans = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object") {
          ans[key] = deepClone(obj[key], map);
        } else {
          ans[key] = obj[key];
        }
      }
    }
    map.set(obj, ans);
    return ans;
  }
}

// 蔚来一面
// 实现一个函数search可以进行关键词搜索,返回出关键词出现的链路
// 比如 search('西半') 返回 ['北京市', '朝阳区', '西半街道']
// 比如 search('朝阳区') 返回 ['北京市', '朝阳区']
// 比如 search('街道') 返回 ['北京市', '昌平区', '昌平街道']、 ['北京市', '朝阳区', '西半街道']
// let testObj = {
//     babel: '北京市',
//     child: [
//         {
//             babel: '朝阳区',
//             child: [
//                 {
//                     babel: '西半街道',
//                 },
//                 {
//                     babel: '向上向善',
//                 }
//             ]
//         },
//         {
//             babel: '昌平区',
//             child: [
//                 {
//                     babel: '香水百合',
//                 },
//                 {
//                     babel: '昌平街道',
//                 }
//             ]
//         }
//     ]
// }
function search(key) {
  let ans = [];
  function dfs(obj, path) {
    if (!obj) return;
    path.push(obj.babel);
    if (obj.babel.includes(key)) {
      //includes实现部分匹配
      ans.push([...path]);
    }
    if (obj.child) {
      for (let i = 0; i < obj.child.length; i++) {
        dfs(obj.child[i], [...path]);
      }
    }
  }
  dfs(testObj, []);
  return ans;
}

// 发布订阅
class eventEmitter {
  constructor() {
    this.events = {};
  }
  // 发布事件
  emit(event) {
    if (this.events[event]) {
      this.events[event].forEach((fn) => fn());
    }
  }
  // 订阅事件
  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  // 取消订阅
  delete(event, fn) {
    let index = this.events[event].indexOf(fn);
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  }
}

// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// 节流
function throttle(fn, delay) {
  let lastTime = null;
  return function () {
    if (lastTime === null || Date.now() - lastTime > delay) {
      fn.apply(this, arguments);
      lastTime = Date.now();
    }
  };
}

// 使用setTimeout实现setInterval(字节一面)
function mySetInterval(fn, delay) {
  let timer = null;
  function startTimer() {
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      startTimer();
    }, delay);
    startTimer();
  }
  return {
    clear() {
      clearTimeout(timer);
    },
  };
}

// promise.all(字节一面)
Promise.protoType.myAll = function (promises) {
  let ans = [];
  return new Promise((resolve, rejected) => {
    for (let i = 0; i < promises.length; i++) {
      if (promises[i] instanceof Promise) {
        promise[i].then(
          (res) => {
            ans.push(res);
          },
          (err) => {
            rejected(err);
          }
        );
      } else {
        ans.push(promises[i]);
      }
    }
    if (ans.length === promises.length) {
      resolve(ans);
    }
  });
};

// lodash.get
// var object = { 'a': [{ 'b': { 'c': 3 } }] };
function get(obj, path, defaultValue) {
  //path需要支持数组和字符串
  if (!obj || !path || path.length === 0) return defaultValue;
  if (typeof path === "string") {
    path = path.split(".");
  }
  for (let i = 0; i < path.length; i++) {
    if (obj[path[i]]) {
      obj = obj[path[i]];
    } else {
      return defaultValue;
    }
  }
  return obj;
}

// 获取url参数(字节一面)
function getUrlParam(url) {
  let Url = new URL(url);
  let protocol = Url.protocol; //协议
  let host = Url.hostname; //域名
  let port = Url.port; //端口号
  let params = Url.search; // 参数
  let hash = Url.hash; // hash

  return [protocol, host, port, params, hash];
}

// 实现一个方法，能串行地执行传入的 promises，实现效果与 promise.all 区别只有 "串行执行"(美团二面)
function myPromise(promises) {
  let ans = [];
  return new Promise((resolve, reject) => {
    let i = 0;
    while (i < promises.length) {
      promises[i]
        .then((res) => {
          ans.push(res);
          i++;
          if (i === promises.length) {
            resolve(ans);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

// 深拷贝(滴滴二面)
function deepClone(obj, map = new Map()) {
  // 处理对象,数组,普通类型,时间类型,set,map
  if (obj === null || typeof obj !== "object" || typeof obj === "function") {
    return obj;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }

  if (obj instanceof Date) {
    ans = new Date(obj);
    return ans;
  }
  if (obj instanceof Set) {
    let newSet = new Set();
    map.set(obj, newSet);
    obj.forEach((value) => {
      newSet.add(deepClone(value, map));
    });
    return newSet;
  }
  if (obj instanceof Map) {
    let newMap = new Map();
    map.set(obj, newMap);
    obj.forEach((value, key) => {
      newMap.set(deepClone(key, map), deepClone(value, map));
    });
    return newMap;
  }

  let ans = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      ans[key] =
        typeof obj[key] === "object" ? deepClone(obj[key], map) : obj[key];
    }
  }
  map.set(obj, ans);
  return ans;
}

// 二分查找
function binarySearch(arr, target) {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }
  return -1;
}

// 反转字符串中的单词(美团二面)
/*
I want apple -> I tnaw elppa
*/
function reverseStrItem(str) {
  let ans = "";
  str = str.split(" ");
  for (let i = 0; i < str.length; i++) {
    let v = str[i];
    ans += v.split("").reverse().join("");
    if (i < str.length - 1) {
      ans += " ";
    }
  }
  return ans;
}
