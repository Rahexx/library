import axios from 'axios'

export const state = () => ({
  books: [],
  role: null,
  token: null,
  email: null,
  password: null,
})

export const mutations = {
  setBooks: (state, data) => {
    state.books = data
  },
  setRole: (state, data) => {
    state.role = data
  },
  setToken: (state, data) => {
    state.token = data
  },
  setEmail: (state, data) => {
    state.email = data
  },
  setPassword: (state, data) => {
    state.password = data
  },
}

export const actions = {
  async fetchBooks({ commit }) {
    const books = await this.$strapi.$books.find()

    commit('setBooks', books)

    return books
  },
  async fetchUser({ commit, state }) {
    await axios
      .post('http://localhost:1337/auth/local', {
        identifier: state.email,
        password: state.password,
      })
      .then((response) => {
        // Handle success.
        commit('setRole', 'admin')
        commit('setToken', response.data.jwt)
      })
      .catch((error) => {
        // Handle error.
        console.log('An error occurred:', error.response)
      })
  },
}

export const getters = {
  getBooks: (state) => {
    return state.books
  },
  getRole: (state) => {
    return state.role
  },
  getToken: (state) => {
    return state.token
  },
  getEmail: (state) => {
    return state.email
  },
  getPassword: (state) => {
    return state.password
  },
}
