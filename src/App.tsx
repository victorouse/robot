import { useReducer } from 'react'

interface RobotLocation {
  x: number
  y: number
}

enum Direction {
  North = 'North',
  East = 'East',
  South = 'South',
  West = 'West'
}

type Rotation = 'left' | 'right'

type Action =
  | {
      type: 'PlaceAction'
      payload: RobotLocation & { direction: Direction }
    }
  | {
      type: 'RotateAction'
      payload: Rotation
    }
  | {
      type: 'MoveAction'
    }
  | {
      type: 'ReportAction'
    }

interface State {
  rows: number
  columns: number
  location: RobotLocation | null
  direction: Direction | null
}

const initialState: State = {
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
  // Location (x, y) values are technically
  // zero-based indexes, so we need to +1 them
  // when checking bounds.
  return (
    location.x < 0 ||
    location.x + 1 > columns ||
    location.y < 0 ||
    location.y + 1 > rows
  )
}

function randomlyPlace(columns: number, rows: number) {
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

function reducer(state = initialState, action: Action): State {
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

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <Board
        rows={state.rows}
        columns={state.columns}
        location={state.location}
        direction={state.direction}
      />

      <button
        onClick={() =>
          dispatch({
            type: 'PlaceAction',
            payload: randomlyPlace(state.columns, state.rows)
          })
        }
      >
        Place
      </button>

      <button
        onClick={() =>
          dispatch({
            type: 'MoveAction'
          })
        }
      >
        Move
      </button>

      <button
        onClick={() =>
          dispatch({
            type: 'RotateAction',
            payload: 'left'
          })
        }
      >
        Left
      </button>

      <button
        onClick={() =>
          dispatch({
            type: 'RotateAction',
            payload: 'right'
          })
        }
      >
        Right
      </button>

      <button
        onClick={() =>
          dispatch({
            type: 'ReportAction'
          })
        }
      >
        Report
      </button>
    </div>
  )
}

function Board(props: State) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, 100px)`,
        gridTemplateRows: `repeat(${props.rows}, 100px)`,
        gap: '10px'
      }}
    >
      {new Array(props.rows).fill(0).map((_, y) =>
        new Array(props.columns).fill(0).map((_, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              border: '2px solid black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100px',
              backgroundColor:
                props.location?.x === x && props.location?.y === y
                  ? 'lightskyblue'
                  : 'ghostwhite'
            }}
          >
            <pre>
              ({x}, {y}
              {(props.location?.x === x &&
                props.location?.y === y &&
                props.direction &&
                ', ' +
                  {
                    [Direction.North]: '👆',
                    [Direction.South]: '👇',
                    [Direction.East]: '👉',
                    [Direction.West]: '👈'
                  }[props.direction]) ||
                '‍'}
              )
            </pre>
          </div>
        ))
      )}
    </div>
  )
}
