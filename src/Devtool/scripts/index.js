import Vue from 'vue'
import Recorder from './Recorder'
import Store from './Store.js'
import { rewriteRequest } from './request'

Vue.prototype.$devToolStore = new Store()
const recorder = Vue.prototype.$recorder = new Recorder()

rewriteRequest(recorder)
Recorder.clearStatic()

console.log('WyMpDevtool初始化成功')
