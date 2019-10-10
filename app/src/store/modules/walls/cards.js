import Vue from 'vue'
import { eventBus } from '../../../utils'

export default {
  namespaced: true,
  state: {
    cards: {}
  },
  getters: {
    getList: state => list => (list || []).map(rid => state.cards[rid])
  },
  mutations: {
    setCard (state, card) {
      // Allow card states internally (Should probably be in component)
      const existingCard = state.cards[card.rid] || card
      card.states = existingCard.states || {}
      Vue.set(state.cards, card.rid, card)
    },
    setCards (state, cards) {
      cards.forEach(card => {
        // Allow card states internally (See above)
        const existingCard = state.cards[card.rid] || card
        card.states = existingCard.states || {}
        Vue.set(state.cards, card.rid, card)
      })
    },
    removeCard (state, card) {
      delete state.cards[card.rid]
    },
    setCardState (state, {rid, stateName, stateFlag}) {
      Vue.set(state.cards[rid].states, stateName, stateFlag)
      eventBus.$emit('relationsUpdated')
    },
    resetCardState (state, {rid, stateName}) {
      Vue.set(state.cards[rid].states, stateName, undefined)
      eventBus.$emit('relationsUpdated')
    },
    resetCardStates (state, {rid}) {
      Vue.set(state.cards[rid], 'states', {})
      eventBus.$emit('relationsUpdated')
    }
  }
}
