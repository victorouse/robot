export interface RobotLocation {
  x: number
  y: number
}

export enum Direction {
  North = 'North',
  East = 'East',
  South = 'South',
  West = 'West'
}

export type Rotation = 'left' | 'right'

export interface PlaceAction {
  type: 'PlaceAction'
  payload: RobotLocation & { direction: Direction }
}

export interface RotateAction {
  type: 'RotateAction'
  payload: Rotation
}

export interface MoveAction {
  type: 'MoveAction'
}

export interface ReportAction {
  type: 'ReportAction'
}

export type RobotAction = PlaceAction | RotateAction | MoveAction | ReportAction

export interface State {
  rows: number
  columns: number
  location: RobotLocation | null
  direction: Direction | null
}

export const initialState: State = {
  rows: 5,
  columns: 5,
  location: null,
  direction: null
}

function isOutOfBounds(
  rows: number,
  columns: number,
  location: RobotLocation
): boolean {
  return (
    location.x < 0 ||
    location.y < 0 ||
    // Location (x, y) values are technically
    // zero-based indexes, so we need to +1 them
    // when checking bounds.
    location.x + 1 > columns ||
    location.y + 1 > rows
  )
}

export function placeRandomly(columns: number, rows: number) {
  return {
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * rows),
    direction:
      {
        0: Direction.North,
        1: Direction.East,
        2: Direction.South,
        3: Direction.West
      }[Math.floor(Math.random() * 4)] || Direction.North
  }
}

function rotate(rotate: Rotation, current: Direction | null) {
  if (current) {
    return {
      left: {
        [Direction.North]: Direction.West,
        [Direction.East]: Direction.North,
        [Direction.South]: Direction.East,
        [Direction.West]: Direction.South
      },
      right: {
        [Direction.North]: Direction.East,
        [Direction.East]: Direction.South,
        [Direction.South]: Direction.West,
        [Direction.West]: Direction.North
      }
    }[rotate][current]
  }

  return current
}

function move(location: RobotLocation, direction: Direction): RobotLocation {
  return {
    x:
      location.x +
      {
        [Direction.North]: 0,
        [Direction.East]: 1,
        [Direction.South]: 0,
        [Direction.West]: -1
      }[direction],
    y:
      location.y +
      {
        [Direction.North]: -1,
        [Direction.East]: 0,
        [Direction.South]: 1,
        [Direction.West]: 0
      }[direction]
  }
}

export function reducer(state: State, action: RobotAction): State {
  switch (action.type) {
    case 'ReportAction':
      if (state.location && state.direction) {
        alert(
          `🤖 I am at (x: ${state.location.x}, y: ${state.location.y}) and facing: ${state.direction}`
        )
      } else {
        alert('🤖 I have not been placed yet.')
      }

      return state

    case 'PlaceAction':
      return {
        ...state,
        direction: action.payload.direction,
        location: {
          x: action.payload.x,
          y: action.payload.y
        }
      }

    case 'RotateAction':
      return {
        ...state,
        direction: rotate(action.payload, state.direction)
      }

    case 'MoveAction':
      // Don't move if we're not placed on the board,
      // which implicitly imlpies we do not yet have
      // a location or a direction.
      if (state.location && state.direction) {
        // Assess the next move, and only
        // move if it is a valid move
        const nextMove = move(state.location, state.direction)
        if (!isOutOfBounds(state.columns, state.rows, nextMove)) {
          return {
            ...state,
            location: nextMove
          }
        }
      }

    default:
      return state
  }
}
