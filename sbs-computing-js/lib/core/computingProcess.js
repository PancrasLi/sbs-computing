import sbs from "../init";
import { debounce, deepClone } from "../utils/index";
function changeObCallbackHandle(changeConfigKey, changeConfigValue, target) {
    function doTask() {
        computingStep(changeConfigKey, target)
    }

    if (target.fkey) {
        debounce(doTask, 200)
    }

}
function computingStep(type, target) {
    if (sbs.getConfig()) {
        Object.keys(sbs.getConfig()).forEach(key => {
            if (sbs.getConfig()[key].__variable__?.includes(target.fkey)) {
               sbs.setConfig(key,sbs.getConfig()[key].computHandle(target))
            }
        })
        let res = deepClone(sbs.getConfig())
        sbs.callback(res)
        // sbs.setConfig(res)
    }
}
export {
    changeObCallbackHandle
};