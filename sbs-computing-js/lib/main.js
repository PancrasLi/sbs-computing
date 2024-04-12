
import sbs from "./init"
import {reactive} from "./core/reactive"
export  {
  sbs,reactive
}
// let config = reactive({
//   a:{
//     value:100,
//     eqn:'',
//     computHandle(){
//       console.log('-------',this)
//       // return this.a.value
//     }
//   },
//   b:{
//     value:0,
//     eqn:'100+a',
//     computHandle(){
//       const _this = config;
//       console.log('-------',_this)
//       return +_this.a.value+100
//     }
//   },
//   c:{
//     value:0,
//     eqn:'a+b',
//     computHandle(){
//       const _this = config;
//       return  +_this.a.value+_this.b.value
//     }
//   }
// })


// sbs.init(config,function(res){
//   console.log('计算更新',res)
// })

// sbs.success = function(res){
//   console.log('计算成功',res)
// }
// config.a.value = 1000
// config.b.value = 200



