<template lang="html">
  <section class="home-page">
      <div class="container">
        <div class="home-heading">
          <h1>BOOK YOUR BARBER</h1>
          <p>Great Hair Doesn't Happen By Chance. It Happen By Appointment!<br>
            <span class="extra-pra"> So Don't Wait And Book Your Appointment Now!</span>
          </p>
        </div>
        <div class="mix-content">
          <div class="home-img">
            <img src="/img/image.jpg" alt="barber">
          </div>
          <div class="appointment-form">
            <div class="fill-form">
              <h2>BOOK YOUR APPOINTMNET</h2>

              <form method="post" @submit="HandleSubmit">
                <div class="row form-group pb-mb-3">
                  <div class="col-md-6 pr-md-1">
                    <input type="text" class="form-control" v-model="fname" placeholder="First Name">
                    <span class="error" id="fname">Please enter your full name</span>
                </div>
                <div class="col-md-6 pl-md-1">
                    <input type="text" class="form-control" v-model="lname" placeholder="Last Name">
                </div>
                </div>
                <div class="row form-group">
                  <div class="col-md-6 pr-md-1">
                    <input type="email" class="form-control" v-model="email" placeholder="Email">
                    <span class="error" id="email">Please enter a valid email </span>
                </div>
                <div class="col-md-6 pl-md-1">
                    <input type="text" class="form-control" v-model="phone" placeholder="Contact Number">
                    <span class="error" id="phone">Please enter a phone number </span>
                </div>
                </div>
                <div class="row form-group">
                  <div class="col-md-6 pr-md-1">
                    <select class="form-control custom-select" v-model="selectedBarber" >
                      <option selected disabled value=""> Select Barber</option>
                      <option v-for="bar in barber" :value="bar.id" :key="'data' + bar.id">{{bar.firstName}} {{bar.lastName}}</option>
                    </select>
                    <span class="error" id="barber">Please select a barber </span>
                </div>
                <div class="col-md-6 pl-md-1">
                    <select class="form-control custom-select" v-model="selectedService" @change="CalculateSerivePrice">
                      <option selected disabled value=""> Select Service</option>
                      <option v-for="serve in service" :value="serve.id" :key="'ser' + serve.id">{{serve.name}}</option>
                    </select>
                    <span class="error" id="service">Please select a service </span>
                </div>
                </div>
                <div class="row form-group py-md-2">
                  <div class="col-md-6 pr-md-1">
                    <input type="date" v-model="date" :min="getDate" class="form-control" placeholder="Select Date">
                    <span class="error" id="date">Please pick a date </span>
                </div>
                <div class="col-md-6 pl-md-1">
                    <input type="time" v-model="time" class="form-control" placeholder="Select Time">
                    <span class="error" id="time" >Please pick a time </span>
                </div>
                </div>
                <div class="form-group">
                    <input type="number" v-model="price" readonly class="form-control" id="exampleFormControlInput1" placeholder="Select any service">
                </div>
                 <span class="error" id="other"> Other errors </span>
              <div class="text-center">
                <button type="submit" class="book_appointment">
                  BOOK <span class="extra-pra">APPOINTMENT</span>
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>
<script lang='ts' src="./home.ts"></script>
<style lang="scss">
  @import "./home.scss";
</style>
