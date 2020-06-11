import { Component, Vue } from 'vue-property-decorator'
/* eslint-disable */

@Component
export default class Home extends Vue {
  data () {
    return {
      baseURL: 'http://localhost:3000',
      fname: '',
      lname: '',
      email: '',
      phone: '',
      barber: [],
      service: [],
      date: new Date().toISOString().slice(0, 10),
      time: '',
      price: '',
      selectedBarber: '',
      selectedService: '',
      appointments: []
    }
  }

  get getDate () {
    return new Date().toISOString().slice(0, 10)
  }

  CalculateSerivePrice () {
    if (this.$data.selectedService) {
      const getService = this.$data.service.find((obj: any) => obj.id === this.$data.selectedService)
      this.$data.price = getService.price
    }
  }

  async getAppointment () {
    const getAppointments = await fetch(this.$data.baseURL + '/appointments')
    this.$data.appointments = await getAppointments.json()
  }

  async HandleSubmit (e: any) {
    e.preventDefault()
    const error: any = document.getElementsByClassName('error')
    if (error.length > 0) {
      error.forEach((item: any) => {
        item.style.display = 'none'
        return null
      })
    }
    let submit = true
    if (!this.$data.fname) {
      const fname = document.getElementById('fname')
      if (fname) {
        fname.style.display = 'block'
        submit = false
      }
    }
    if (!this.$data.lname) {
      const fname = document.getElementById('fname')
      if (fname) {
        fname.style.display = 'block'
      }
      submit = false
    }
    if (!this.$data.email) {
      const email = document.getElementById('email')
      if (email) {
        email.style.display = 'block'
      }
      submit = false
    }
    if (!this.validEmail()) {
      const email = document.getElementById('email')
      if (email) {
        email.style.display = 'block'
      }
      submit = false
    }
    if (!this.$data.phone) {
      const phone = document.getElementById('phone')
      if (phone) {
        phone.style.display = 'block'
      }
      submit = false
    }
    if (!this.$data.selectedBarber) {
      const barber = document.getElementById('barber')
      if (barber) {
        barber.style.display = 'block'
      }
      submit = false
    }
    if (!this.$data.selectedService) {
      const service = document.getElementById('service')
      if (service) {
        service.style.display = 'block'
      }
      submit = false
    }
    if (!this.$data.date) {
      const date = document.getElementById('date')
      if (date) {
        date.style.display = 'block'
      }
      submit = false
    }
    if (!this.$data.time) {
      const time = document.getElementById('time')
      if (time) {
        time.style.display = 'block'
      }
      submit = false
    }
    const selectedDateTime = Date.parse(this.$data.date + ' ' + this.$data.time)
    if (selectedDateTime < new Date().getTime()) {
      const other = document.getElementById('other')
      if (other) {
        other.textContent = 'Appointment time should be greater then current time'
        other.style.display = 'block'
      }
      submit = false
    }
    if (submit) {
      await this.getAppointment()
      const barber = await this.$data.barber.find((obj: any) => obj.id === this.$data.selectedBarber)
      const selectedDateObj = new Date(selectedDateTime)
      const workingHours = await barber.workHours.filter((item: any) => item.day === selectedDateObj.getDay())
      let message = ''
      if (workingHours.length > 0) {
        const workday = workingHours[0]
        if (parseInt(workday.startHour) > selectedDateObj.getHours()) {
          message = 'Appointment not available at this time. shop is closed'
          submit = false
        } else if (parseInt(workday.endHour) < selectedDateObj.getHours()) {
          message = 'Appointment not available at this time. shop is closed'
          submit = false
        } else if (parseInt(workday.lunchTime.startHour) === selectedDateObj.getHours()) {
          if (selectedDateObj.getMinutes() < parseInt(workday.lunchTime.durationMinutes)) {
            message = 'Appointment not available at this time. Lunch Time ..'
            submit = false
          }
        } else {
          const checkAppointment = await this.$data.appointments.filter((item: any) => {
            const itemObj = new Date(item.startDate)
            if ((itemObj.getDate() === selectedDateObj.getDate()) && (itemObj.getHours() === selectedDateObj.getHours())) {
              const getService = this.$data.service.find((serviceitem: any) => serviceitem.id === item.serviceId)
              const itemStartTime = item.startDate
              const endTime = item.startDate + (getService.durationMinutes * 60 * 1000)
              return ((selectedDateTime >= itemStartTime) && (endTime >= selectedDateTime))
            }
          })
          console.log(checkAppointment)
          if (checkAppointment.length > 0) {
            message = 'Appointment not available at this time. barber is busy'
            submit = false
          }
        }
      } else {
        message = 'Appointment not available on weekends. shop is closed'
        submit = false
      }
      if (submit) {
        const id = this.$data.appointments[this.$data.appointments.length - 1].id + 1
        const data = {
          barberId: this.$data.selectedBarber,
          id: id,
          serviceId: this.$data.selectedService,
          startDate: selectedDateTime
        }
        const submitAppointment = await fetch(this.$data.baseURL + '/appointments', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const appoint = await submitAppointment.json()
        if (appoint) {
          this.$router.push('/success')
        }
        this.getAppointment()
      } else {
        const other = document.getElementById('other')
        if (other) {
          other.textContent = message
          other.style.display = 'block'
        }
      }
    }
  }

  validEmail () {
    const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    return re.test(this.$data.email)
  }

  async mounted () {
    const response = await fetch(this.$data.baseURL + '/barbers')
    this.$data.barber = await response.json()
    const getService = await fetch(this.$data.baseURL + '/services')
    const service = await getService.json()
    this.$data.service = service
    await this.getAppointment()
  }
}
