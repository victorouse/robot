import { useReducer } from 'react'

import { reducer, initialState, randomlyPlace, State, Direction } from './robot'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
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

      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}

const CELL_SIZE = 100

function Board(props: State) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${props.rows}, ${CELL_SIZE}px)`,
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
