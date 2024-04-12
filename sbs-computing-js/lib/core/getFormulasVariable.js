
// 收集每种计算方式中涉及到的变量
function getFormulasVariable(formulas) {
    formulas = formulas?.eqn ? formulas.eqn : '';
    let formsOb = formulas.split(/\+|-|\*|\/|\(|\)|plus|minus|multiply|divide|\d+/)
    return formsOb.filter(item => item != '')
}
export default getFormulasVariable;