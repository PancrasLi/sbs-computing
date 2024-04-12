import sbs from "../init";
import { debounce, deepClone } from "../utils/index";
function changeObCallbackHandle(changeConfigKey, changeConfigValue, target) {
    function doTask() {
        computingStep(changeConfigKey, target.fkey)
    }

    if (target.fkey) {
        debounce(doTask, 200)
    }

}
function computingStep(type, computingKey) {
    let res = deepClone(sbs.getConfig())
    if (sbs.getConfig() && res) {
        Object.keys(sbs.getConfig()).forEach(key => {
            if (sbs.getConfig()[key].__variable__?.includes(computingKey)) {
                res[key].value = sbs.getConfig()[key].computHandle() - 0
            }
        })
        sbs.callback(res)
    }
}
export {
    changeObCallbackHandle
};