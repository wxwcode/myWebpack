import { paramString } from './utils/tools'
import './ind.css'

const arr = [3,5,8]
const str = paramString(arr)
console.log(str)
console.log('hello webpack')

function getComponent() {
  return import(/* webpackChunkName: "lodash" */ 'lodash').then(({default: _}) => {
    const el = document.createElement('div')
    el.innerHTML = _.join(['Hello', 'Evan'], '-')
    return el
  })
}
getComponent().then(el => {
  document.body.appendChild(el)
})
