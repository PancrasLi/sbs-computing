import getFormulasVariable from "./getFormulasVariable"


function setFormulasVariableToConfig(config){
    Object.keys(config).map((item,index) =>{
        config[item]['__variable__'] = getFormulasVariable(config[item])
    })
    console.log(config)
    return config
}


export {setFormulasVariableToConfig}