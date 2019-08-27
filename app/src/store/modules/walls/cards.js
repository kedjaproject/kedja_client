import Vue from 'vue'

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
      Vue.set(state.cards, card.rid, card)
    },
    setCards (state, cards) {
      cards.forEach(card => {
        Vue.set(state.cards, card.rid, card)
      })
    },
    removeCard (state, rid) {
      delete state.cards[rid]
    }
  }
}
