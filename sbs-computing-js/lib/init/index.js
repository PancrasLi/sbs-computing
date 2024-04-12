import { setFormulasVariableToConfig } from "../core/setFormulasVariableToConfig";
let sbs = {
    init,
    getConfig,
    callback
}
let __haveDependentConfig = null
function initConfigData(configData){
    // 依赖收集注入到传入的配置文件
    __haveDependentConfig = setFormulasVariableToConfig(configData)
}

function init (configData){
    initConfigData(configData)
}

function getConfig() {
    return __haveDependentConfig
}

function callback(config){
    console.log('res',config)
    sbs['success'](config)
}

export default sbs
