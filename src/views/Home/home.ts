
import { Component, Vue } from 'vue-property-decorator'

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
    if (this.selectedService) {
      const getService = this.service.find(obj => obj.id === this.selectedService)
      this.price = getService.price
    }
  }

  async getAppointment () {
    const getAppointments = await fetch(this.baseURL + '/appointments')
    debugger
    this.appointments = await getAppointments.json()
  }

  async HandleSubmit (e) {
    e.preventDefault()
    const error = document.getElementsByClassName('error')
    if (error.length > 0) {
      error.forEach(item => {
        item.style.display = 'none'
        return null
      })
    }
    let submit = true
    if (!this.fname) {
      const fname = document.getElementById('fname')
      fname.style.display = 'block'
      submit = false
    }
    if (!this.lname) {
      const fname = document.getElementById('fname')
      fname.style.display = 'block'
      submit = false
    }
    if (!this.email) {
      const email = document.getElementById('email')
      email.style.display = 'block'
      submit = false
    }
    if (!this.validEmail()) {
      const email = document.getElementById('email')
      email.style.display = 'block'
      submit = false
    }
    if (!this.phone) {
      const phone = document.getElementById('phone')
      phone.style.display = 'block'
      submit = false
    }
    if (!this.selectedBarber) {
      const barber = document.getElementById('barber')
      barber.style.display = 'block'
      submit = false
    }
    if (!this.selectedService) {
      const service = document.getElementById('service')
      service.style.display = 'block'
      submit = false
    }
    if (!this.date) {
      const date = document.getElementById('date')
      date.style.display = 'block'
      submit = false
    }
    if (!this.time) {
      const time = document.getElementById('time')
      time.style.display = 'block'
      submit = false
    }
    const selectedDateTime = Date.parse(this.date + ' ' + this.time)
    if (selectedDateTime < new Date().getTime()) {
      const other = document.getElementById('other')
      other.textContent = 'Appointment time should be greater then current time'
      other.style.display = 'block'
      submit = false
    }
    if (submit) {
      await this.getAppointment()
      const barber = await this.barber.find(obj => obj.id === this.selectedBarber)
      const selectedDateObj = new Date(selectedDateTime)
      const workingHours = await barber.workHours.filter(item => item.day === selectedDateObj.getDay())
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
          const checkAppointment = await this.appointments.filter(item => {
            const itemObj = new Date(item.startDate)
            if ((itemObj.getDate() === selectedDateObj.getDate()) && (itemObj.getHours() === selectedDateObj.getHours())) {
              const getService = this.service.find(serviceitem => serviceitem.id === item.serviceId)
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
        const id = this.appointments[this.appointments.length - 1].id + 1
        const data = {
          barberId: this.selectedBarber,
          id: id,
          serviceId: this.selectedService,
          startDate: selectedDateTime
        }
        const submitAppointment = await fetch(this.baseURL + '/appointments', {
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
        other.textContent = message
        other.style.display = 'block'
      }
    }
  }

  validEmail () {
    const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    return re.test(this.email)
  }

  async mounted () {
    const response = await fetch(this.baseURL + '/barbers')
    this.barber = await response.json()
    const getService = await fetch(this.baseURL + '/services')
    this.service = await getService.json()
    await this.getAppointment()
  }
}
