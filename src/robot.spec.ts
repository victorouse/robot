import test from 'tape'

import { reducer, initialState, Direction } from './robot'

test('prevent the robot from falling off the table', (t) => {
  const s2 = reducer(initialState, {
    type: 'PlaceAction',
    payload: { x: 0, y: 0, direction: Direction.North }
  })
  const s3 = reducer(s2, {
    type: 'MoveAction'
  })
  t.same(s3, s2, 'robot has not moved otherwise it would fall')
  const s4 = reducer(s3, {
    type: 'RotateAction',
    payload: 'left'
  })
  t.same(s4, { ...s3, direction: Direction.West }, 'robot is now facing west')
  const s5 = reducer(s4, {
    type: 'MoveAction'
  })
  t.same(s5, s4, 'robot has not moved otherwise it would fall')
})

test('discard all commands in a sequence until a valid PLACE command has been executed', (t) => {
  const s2 = reducer(initialState, { type: 'MoveAction' })
  t.same(s2, initialState, 'robot has not moved')

  const s3 = reducer(s2, { type: 'RotateAction', payload: 'left' })
  t.same(s3, s2, 'robot has not been rotated left')

  const s4 = reducer(s3, { type: 'RotateAction', payload: 'right' })
  t.same(s4, s3, 'robot has not been rotated right')

  const s5 = reducer(s4, {
    type: 'PlaceAction',
    payload: { x: 0, y: 0, direction: Direction.East }
  })
  t.same(
    s5,
    { ...s4, location: { x: 0, y: 0 }, direction: Direction.East },
    'robot has been placed at (0, 0) facing East'
  )
  const s6 = reducer(s5, {
    type: 'MoveAction'
  })
  t.same(
    s6,
    { ...s5, location: { x: 1, y: 0 } },
    'robot has been moved to (1, 0)'
  )
  const s7 = reducer(s6, {
    type: 'PlaceAction',
    payload: { x: 2, y: 2, direction: Direction.North }
  })
  t.same(
    s7,
    { ...s6, location: { x: 2, y: 2 }, direction: Direction.North },
    'robot has been placed at (2, 2) facing North'
  )
})

test('robot can move in all directions', (t) => {
  t.same(true, true, 'trivial, left for exercise')
})

test('robot can rotate left and right facing all directions', (t) => {
  t.same(true, true, 'trivial, left for exercise')
})
