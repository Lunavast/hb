import { css, StyleSheet } from 'aphrodite'
import * as React from 'react'

import { IAction } from '../../engine/actions/action'
import Game from '../../engine/game'
import Hex from '../../engine/hex'
import { ICell } from '../../engine/map'
import Layout from '../components/layout'
import style from '../utils/style'
import Cell from './cell'
import Sidebar from './sidebar'
import Store from './store'

const styles = StyleSheet.create({
  main: {
    background: style.darkGrey,
    color: style.textColor,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
    overflow: 'auto',
  },
})

export interface IProps {
  game: Game,
}

export interface IState {
  playerFaction: string
  game: Game,
  selectedCell?: ICell
  selectedAction?: IAction
  targets: { [idx: string]: Hex }
}

export default class Stageview extends React.Component<IProps, IState> {
  store: Store

  constructor(props) {
    super(props)
    const { game } = this.props
    // The player faction is the first one, the rest are AIs
    const playerFaction = Array.from(game.factions.keys())[0]

    this.store = new Store(this)
    this.state = { game: this.props.game, targets: {}, playerFaction }
  }

  componentDidMount() {
    const map = this.refs.map as SVGAElement
    const { x, y, width, height } = map.getBBox()
    map.setAttribute(
      'viewBox', `${x - 10} ${y - 10} ${width + 20} ${height + 20}`,
    )
  }

  render() {
    return (
      <Layout extraStyle={[styles.main]} direction="row">
        <div className={css(styles.mapContainer)}>
          <svg ref="map">
            <g>
              ${this.state.game.map.cells.map(c =>
                <Cell store={this.store} cell={c} key={c.pos.toString()}/>,
              )}
            </g>
          </svg>
        </div>
        <Sidebar store={this.store} />
      </Layout>
    )

  }
}