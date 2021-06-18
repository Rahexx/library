<template>
  <div v-if="isLogin || role">
    <v-toolbar color="#41baf2">
      <v-toolbar-title>Książki</v-toolbar-title>
    </v-toolbar>
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
    <v-expansion-panels v-for="(item, index) in books" :key="index">
      <v-expansion-panel
        v-if="
          (isBooksAvailable === false &&
            item.bookName.toLowerCase().includes(searchBook.toLowerCase())) ||
          (isBooksAvailable === true &&
            item.available &&
            item.bookName.toLowerCase().includes(searchBook.toLowerCase()))
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
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ item.description }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <div v-else class="logForm">
    <v-card class="mx-auto" outlined>
      <h2 class="mt-6 text-center">Logowanie</h2>
      <v-form class="my-6">
        <v-layout>
          <v-col class="mx-auto" cols="9">
            <v-text-field
              v-model="login"
              class="my-3"
              label="Login"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              class="my-3"
              label="Hasło"
              required
            ></v-text-field>
            <v-btn class="my-3 formBtn" color="primary"> Zaloguj się </v-btn>
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
export default {
  data() {
    return {
      books: [],
      count: null,
      isBooksAvailable: false,
      searchBook: '',
      isLogin: false,
      login: null,
      password: null,
      role: null,
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
