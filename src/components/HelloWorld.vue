<template>
  <div class="hello" v-if="barber.length > 0">
   <select v-model="selectedBarber">
    <option selected disabled value=""> Select Barber</option>
    <option v-for="bar in barber" :value="bar.id" :key="'data' + bar.id">{{bar.firstName}} {{bar.lastName}}</option>
   </select>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  public fname!: string;
  public lname!: string;
  public email!: string;
  public phone!: string;
  public barber!: Array<object>;
  public service!: Array<object>;
  public date!: string;
  public time!: string;
  public price!: number;
  public selectedBarber = '';
  async mounted () {
    const baseURL = 'http://localhost:3000'
    const response = await fetch(baseURL + '/barbers')
    this.barber = await response.json()
    const getService = await fetch(baseURL + '/services')
    this.service = await getService.json()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
