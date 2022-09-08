import Vue from 'vue'

export function rewriteRequest (recorder) {
  const platform = process.env.VUE_APP_PLATFORM; // mp-weixin mp-alipay
  let wxRequest;
  switch(platform){
    case 'mp-weixin':
      wxRequest= wx.request
      Object.defineProperty(wx, 'request', { writable: true })
      wx.request = customRequest
      break;
    case 'mp-alipay':   
      wxRequest= my.request
      Object.defineProperty(my, 'request', { writable: true })
      my.request = customRequest
      break;
    default: 
      wxRequest= uni.request
      Object.defineProperty(uni, 'request', { writable: true })
      uni.request = customRequest
      break;
  }
  function customRequest (options) {
    options = options || {}
    const id = recorder.addRecord(options)
    const _this = this
    const { complete } = options

    function _complete (...args) {
      typeof complete === 'function' && complete.apply(_this, args)
      recorder.addResponse(id, ...args)
    }

    setHeaders(options.header)
    setGatewayTag(options.header)
    return wxRequest.call(_this, { ...options, complete: _complete })
  }
}

function setHeaders (header) {
  header = header || {}
  setGatewayTag(header)
}

function setGatewayTag (header) {
  const store = Vue.prototype.$devToolStore
  const tag = store.get('gatewayTag')
  if (tag) {
    Object.assign(header, {
      'x-global-router-tag': tag
    })
  }
}
