import { __decorate } from "tslib";
import { Component, Vue } from 'vue-property-decorator';
let Home = /** @class */ (() => {
    let Home = class Home extends Vue {
        data() {
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
            };
        }
        get getDate() {
            return new Date().toISOString().slice(0, 10);
        }
        CalculateSerivePrice() {
            if (this.selectedService) {
                const getService = this.service.find(obj => obj.id === this.selectedService);
                this.price = getService.price;
            }
        }
        async getAppointment() {
            const getAppointments = await fetch(this.baseURL + '/appointments');
            this.appointments = await getAppointments.json();
        }
        async HandleSubmit(e) {
            e.preventDefault();
            const error = document.getElementsByClassName('error');
            if (error.length > 0) {
                error.forEach(item => {
                    item.style.display = 'none';
                    return null;
                });
            }
            let submit = true;
            if (!this.fname) {
                const fname = document.getElementById('fname');
                fname.style.display = 'block';
                submit = false;
            }
            if (!this.lname) {
                const fname = document.getElementById('fname');
                fname.style.display = 'block';
                submit = false;
            }
            if (!this.email) {
                const email = document.getElementById('email');
                email.style.display = 'block';
                submit = false;
            }
            if (!this.validEmail()) {
                const email = document.getElementById('email');
                email.style.display = 'block';
                submit = false;
            }
            if (!this.phone) {
                const phone = document.getElementById('phone');
                phone.style.display = 'block';
                submit = false;
            }
            if (!this.selectedBarber) {
                const barber = document.getElementById('barber');
                barber.style.display = 'block';
                submit = false;
            }
            if (!this.selectedService) {
                const service = document.getElementById('service');
                service.style.display = 'block';
                submit = false;
            }
            if (!this.date) {
                const date = document.getElementById('date');
                date.style.display = 'block';
                submit = false;
            }
            if (!this.time) {
                const time = document.getElementById('time');
                time.style.display = 'block';
                submit = false;
            }
            const selectedDateTime = Date.parse(this.date + ' ' + this.time);
            if (selectedDateTime < new Date().getTime()) {
                const other = document.getElementById('other');
                other.textContent = 'Appointment time should be greater then current time';
                other.style.display = 'block';
                submit = false;
            }
            if (submit) {
                await this.getAppointment();
                console.log(this.appointments);
                const barber = this.barber.find(obj => obj.id === this.selectedBarber);
                const workingHours = barber.workHours.filter(item => {
                    const date = new Date(selectedDateTime);
                    console.log(item.day);
                    return item.day === date.getDay();
                });
                console.log(workingHours);
            }
        }
        validEmail() {
            const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            return re.test(this.email);
        }
        async mounted() {
            const response = await fetch(this.baseURL + '/barbers');
            this.barber = await response.json();
            const getService = await fetch(this.baseURL + '/services');
            this.service = await getService.json();
            await this.getAppointment();
        }
    };
    Home = __decorate([
        Component
    ], Home);
    return Home;
})();
export default Home;
//# sourceMappingURL=home.js.map