import prompts from 'prompts'

import {
  reducer,
  State,
  RobotAction,
  PlaceAction,
  MoveAction,
  RotateAction,
  ReportAction,
  initialState,
  placeRandomly
} from './robot'

interface MenuAction {
  title: string
  value: Partial<PlaceAction> | MoveAction | RotateAction | ReportAction
}

const choices: Array<MenuAction> = [
  { title: 'Place', value: { type: 'PlaceAction' } },
  { title: 'Report', value: { type: 'ReportAction' } },
  { title: 'Move', value: { type: 'MoveAction' } },
  { title: 'Rotate left', value: { type: 'RotateAction', payload: 'left' } },
  { title: 'Rotate right', value: { type: 'RotateAction', payload: 'right' } }
]

async function menu(): Promise<RobotAction> {
  const response = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select an action',
    initial: 1,
    choices
  })

  return response.action
}

async function main(state = initialState): Promise<State> {
  const action = await menu()

  switch (action.type) {
    case 'PlaceAction':
      return main(
        reducer(state, {
          ...action,
          payload: placeRandomly(state.columns, state.rows)
        })
      )

    case 'MoveAction':
    case 'RotateAction':
      return main(reducer(state, action))

    case 'ReportAction':
      if (state.location && state.direction) {
        console.log(
          `🤖 I am currently at: (x: ${state.location.x}, y: ${state.location.y}) facing: ${state.direction}`
        )
      } else {
        console.log('🤖 I have not yet been placed.')
      }
      return main(state)

    default:
      return main(state)
  }
}

main()
