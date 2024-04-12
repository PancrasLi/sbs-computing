import {reactive} from './reactive'
import getFormulasVariable from './getFormulasVariable'
import { setFormulasVariableToConfig } from './setFormulasVariableToConfig'
import {ref} from './ref'
const sbsCore = {
    reactive,
    getFormulasVariable,
    setFormulasVariableToConfig,
    ref
    // computed,
    // watch,
    // watchEffect
}
export default sbsCore