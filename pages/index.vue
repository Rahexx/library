<template>
  <div v-if="role">
    <v-toolbar color="#41baf2">
      <v-toolbar-title>Książki</v-toolbar-title>
    </v-toolbar>
    <div v-if="!isEdit">
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
              <span> kategoria: {{ item.category }} </span>
            </v-col>
            <v-col cols="12" class="text--secondary my-2">
              <span>
                Dostępny w sklepie: {{ item.available ? 'Tak' : 'Nie' }}
              </span>
            </v-col>
            <v-col
              cols="12"
              class="text--secondary my-2"
              v-if="role === 'admin'"
            >
              <span>
                <v-icon color="error" @click="deleteBook(index)">
                  mdi-cancel
                </v-icon>
                <v-icon color="warning" @click="editBook(index)"
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
    <v-card class="mt-8 mx-auto" outlined v-if="isEdit">
      <h2 class="mt-6 text-center">Edytowanie danych książki</h2>
      <v-form class="my-6">
        <v-layout>
          <v-col class="mx-auto" cols="9">
            <v-text-field
              class="my-3"
              label="Nazwa książki"
              required
            ></v-text-field>
            <v-text-field
              class="my-3"
              label="Kategoria"
              required
            ></v-text-field>
            <v-text-field
              class="my-3"
              label="Cena"
              type="Number"
              step="0.01"
              required
            ></v-text-field>
            <v-textarea label="Opis"></v-textarea>
            <v-checkbox label="Dostępny w sklepie"></v-checkbox>
            <v-btn class="my-3 formBtn" color="warning" @click="logIn">
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
  </div>
  <div v-else class="logForm">
    <v-card class="mx-auto" outlined>
      <h2 class="mt-6 text-center">Logowanie</h2>
      <v-form class="my-6">
        <v-layout>
          <v-col class="mx-auto" cols="9">
            <v-text-field
              v-model="email"
              class="my-3"
              label="Email"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              class="my-3"
              label="Hasło"
              type="password"
              required
            ></v-text-field>
            <v-btn class="my-3 formBtn" color="primary" @click="logIn">
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

export default {
  data() {
    return {
      books: [],
      count: null,
      isBooksAvailable: false,
      searchBook: '',
      email: null,
      password: null,
      role: null,
      isEdit: false,
    }
  },
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
  async mounted() {
    try {
      this.books = await this.$strapi.$books.find()
      this.count = await this.$strapi.$books.count()
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    setGuestRole() {
      this.role = 'guest'
    },
    logIn() {
      axios
        .post('http://localhost:1337/auth/local', {
          identifier: this.email,
          password: this.password,
        })
        .then((response) => {
          // Handle success.
          this.role = 'admin'
        })
        .catch((error) => {
          // Handle error.
          console.log('An error occurred:', error.response)
        })
    },
    deleteBook(id) {
      console.log(id)
    },
    editBook(id) {
      console.log(id)
      this.isEdit = true
    },
    endEditBook() {
      this.isEdit = false
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
