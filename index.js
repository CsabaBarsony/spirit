import {Statechart} from 'scion-core'

export const spirit = (statechart, opts) => {
  let sc

  const options = opts || {}

  setTimeout(() => {
    sc = new Statechart({states: statechart})

    sc.on('onEntry', (state, event = {}) => {
    const action = {...event}
  action.type = 'a:entry:' + state
  options.log && console.log('entry', state, action)
  store.dispatch(action)
})

  sc.on('onExit', (state, event = {}) => {
    const action = {...event}
  action.type = 'a:exit:' + state
  options.log && console.log('exit', state, action)
  store.dispatch(action)
})

  sc.on('onTransition', (state, targetIds, stxIdx, event) => {
    if(event && event.type) {
    const action = {...event}
    action.type = 'a:transition:' + event.type
    options.log && console.log('transition', action)
    store.dispatch(action)
  }
})

  sc.start()
}, 0)

  return store => next => action => {
    if(!action.type.startsWith('a:')) {
      sc.gen({
        name: action.type,
        data: action,
      })
    }
    else {
      next(action)
    }
  }
}
