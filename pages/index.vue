<template>
  <div v-if="role">
    <v-toolbar color="#41baf2">
      <v-toolbar-title>Książki</v-toolbar-title>
      <v-btn
        v-if="role === 'admin' && !isAddingBook"
        class="my-3 ml-6"
        color="white"
        small
        @click="openAddBookForm"
      >
        Dodaj książkę
      </v-btn>
    </v-toolbar>
    <v-alert v-if="successAddBook" class="my-3" dense :type="addBookStatus">
      {{ addBookText }}
    </v-alert>
    <div v-if="!isEdit && !isAddingBook">
      <v-form class="my-6">
        <v-container>
          <v-layout row>
            <v-col cols="7" md="5" lg="4" xl="3">
              <v-text-field
                v-model="searchBook"
                label="Nazwa książki"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-switch
                v-model="isBooksAvailable"
                label="Dostępna w sklepie"
              ></v-switch>
            </v-col>
          </v-layout>
        </v-container>
      </v-form>
      <h2>Lista książek</h2>
      <p>Wyszukane książki: {{ count }}</p>
    </div>
    <div v-if="!isAddingBook">
      <v-expansion-panels v-for="(item, index) in books" :key="index">
        <v-expansion-panel
          v-if="
            (isBooksAvailable === false &&
              item.bookName.toLowerCase().includes(searchBook.toLowerCase()) &&
              !isEdit) ||
            (isBooksAvailable === true &&
              item.available &&
              item.bookName.toLowerCase().includes(searchBook.toLowerCase()) &&
              !isEdit)
          "
        >
          <v-expansion-panel-header cols="12" lg="8">
            <v-row no-gutters>
              <v-col cols="12">
                {{ item.bookName }}
              </v-col>
              <v-col cols="12" class="text--secondary my-2">
                <span> autor: {{ item.author }} </span>
              </v-col>
              <v-col cols="12" class="text--secondary my-2">
                <span> kategoria: {{ item.categories }} </span>
              </v-col>
              <v-col cols="12" class="text--secondary my-2">
                <span>
                  Dostępny w sklepie: {{ item.available ? 'Tak' : 'Nie' }}
                </span>
              </v-col>
              <v-col cols="12" class="text--secondary my-2">
                <span> Cena: {{ item.price }} zł</span>
              </v-col>
              <v-col
                v-if="role === 'admin'"
                cols="12"
                class="text--secondary my-2"
              >
                <span>
                  <v-icon color="error" @click="deleteBook(item.id)">
                    mdi-cancel
                  </v-icon>
                  <v-icon color="warning" @click="prepareEditForm(item)"
                    >mdi-clipboard-edit-outline</v-icon
                  >
                </span>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ item.description }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <v-card v-if="isEdit && !isAddingBook" class="mt-8 mx-auto" outlined>
      <h2 class="mt-6 text-center">Edytowanie danych książki</h2>
      <v-form class="my-6">
        <v-layout>
          <v-col class="mx-auto" cols="9">
            <v-text-field
              v-model="editBook.bookName"
              class="my-3"
              label="Nazwa książki"
              required
            ></v-text-field>
            <v-text-field
              v-model="editBook.categories"
              class="my-3"
              label="Kategoria"
              required
            ></v-text-field>
            <v-text-field
              v-model="editBook.price"
              class="my-3"
              label="Cena"
              type="Number"
              step="0.01"
              required
            ></v-text-field>
            <v-textarea
              v-model="editBook.description"
              label="Opis"
            ></v-textarea>
            <v-checkbox
              v-model="editBook.available"
              label="Dostępny w sklepie"
            ></v-checkbox>
            <v-btn class="my-3 formBtn" color="warning" @click="updateBook">
              Edytuj
            </v-btn>
          </v-col>
        </v-layout>
      </v-form>
      <p class="text-center">
        Wróć do listy książek
        <v-icon
          large
          color="primary"
          class="arrowIcon ml-2"
          @click="endEditBook"
        >
          mdi-arrow-left
        </v-icon>
      </p>
    </v-card>
    <v-card v-if="isAddingBook" class="mt-8 mx-auto" outlined>
      <h2 class="mt-6 text-center">Dodawanie nowej książki</h2>
      <v-form class="my-6">
        <v-layout>
          <v-col class="mx-auto" cols="9">
            <v-text-field
              v-model="newBook.bookName"
              class="my-3"
              label="Nazwa książki"
              required
            ></v-text-field>
            <v-text-field
              v-model="newBook.author"
              class="my-3"
              label="Autor książki"
              required
            ></v-text-field>
            <v-text-field
              v-model="newBook.categories"
              class="my-3"
              label="Kategoria"
              required
            ></v-text-field>
            <v-text-field
              v-model="newBook.price"
              class="my-3"
              label="Cena"
              type="Number"
              step="0.01"
              required
            ></v-text-field>
            <v-textarea v-model="newBook.description" label="Opis"></v-textarea>
            <v-checkbox
              v-model="newBook.available"
              label="Dostępny w sklepie"
            ></v-checkbox>
            <v-btn
              class="my-3 formBtn"
              color="primary"
              :loading="loadingAddBookForm"
              @click="sendNewBookServer"
            >
              Dodaj
            </v-btn>
          </v-col>
        </v-layout>
      </v-form>
      <p class="text-center">
        Wróć do listy książek
        <v-icon
          large
          color="primary"
          class="arrowIcon ml-2"
          @click="endAddingBook"
        >
          mdi-arrow-left
        </v-icon>
      </p>
    </v-card>
  </div>
  <div v-else class="logForm">
    <v-card class="mx-auto" outlined>
      <h2 class="mt-6 text-center">Logowanie</h2>
      <v-form class="my-6">
        <v-layout>
          <v-col class="mx-auto" cols="9">
            <v-text-field
              :value="email"
              class="my-3"
              label="Email"
              required
              @input="setEmail"
            ></v-text-field>
            <v-text-field
              :value="password"
              class="my-3"
              label="Hasło"
              type="password"
              required
              @input="setPassword"
            ></v-text-field>
            <v-btn
              class="my-3 formBtn"
              color="primary"
              :loading="loadingLogForm"
              @click="logIn"
            >
              Zaloguj się
            </v-btn>
          </v-col>
        </v-layout>
      </v-form>
      <p class="text-center">
        Kontynuuj jako
        <v-icon
          large
          color="primary"
          class="arrowIcon ml-2"
          @click="setGuestRole"
        >
          mdi-arrow-right
        </v-icon>
      </p>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      editBook: null,
      count: null,
      isBooksAvailable: false,
      searchBook: '',
      isEdit: false,
      loadingLogForm: false,
      loadingAddBookForm: false,
      isAddingBook: false,
      newBook: {
        bookName: null,
        price: null,
        author: null,
        available: false,
        categories: null,
        description: null,
      },
      successAddBook: false,
      addBookStatus: null,
      addBookText: null,
    }
  },
  computed: mapState([
    'books',
    'role',
    'token',
    'password',
    'email',
    'password',
  ]),
  watch: {
    isBooksAvailable() {
      const matchArray = this.books.filter((item) => item.available === true)

      this.count = matchArray.length
    },
    searchBook(val) {
      const matchArray = this.books.filter((item) =>
        item.bookName.toLowerCase().includes(val.toLowerCase())
      )

      this.count = matchArray.length
    },
  },
  async created() {
    await this.fetchBooks()
    this.count = this.getBooks().length
  },
  methods: {
    ...mapActions(['fetchBooks', 'fetchUser']),
    ...mapMutations(['setEmail', 'setPassword', 'setRole']),
    ...mapGetters([
      'getBooks',
      'getRole',
      'getToken',
      'getEmail',
      'getPassword',
    ]),
    setGuestRole() {
      this.setRole('guest')
    },
    async deleteBook(bookId) {
      try {
        await axios.delete(`http://localhost:1337/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
      } catch (error) {
        this.error = error
      }
      await this.fetchBooks()
      this.count = this.getBooks().length
    },
    prepareEditForm(item) {
      this.isEdit = true
      this.editBook = JSON.parse(JSON.stringify(item))
    },
    endEditBook() {
      this.isEdit = false
    },
    async updateBook() {
      await axios.put(
        `http://localhost:1337/books/${this.editBook.id}`,
        this.editBook,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )

      await this.fetchBooks()

      this.isEdit = false
    },
    async logIn() {
      this.loadingLogForm = true

      await this.fetchUser()

      this.loadingLogForm = false
    },
    endAddingBook() {
      this.isAddingBook = false
    },
    openAddBookForm() {
      this.isAddingBook = true
    },
    async sendNewBookServer() {
      this.loadingAddBookForm = true

      await axios
        .post('http://localhost:1337/books', this.newBook, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(() => {
          this.addBookStatus = 'success'
          this.addBookText = 'Książka została pomyślnie dodana'
        })
        .catch((error) => {
          this.addBookStatus = 'error'
          this.addBookText = `Błąd książka nie została dodana. Błąd: ${error}`
        })

      await this.fetchBooks()

      this.loadingAddBookForm = true
      this.isAddingBook = false
      this.successAddBook = true

      setTimeout(this.closeAddBookAlert, 3000)
    },
    closeAddBookAlert() {
      this.successAddBook = false
    },
  },
}
</script>

<style scoped>
.logForm {
  width: 360px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.arrowIcon {
  cursor: pointer;
}

.formBtn {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
