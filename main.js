import { DateTime, Interval } from './scripts/luxon/luxon.min.js';
const template = document.createElement("template");
template.innerHTML = `
        <form action="">
        <section class="age-calculator-card">
          <label for="day">Day
            <input list="available-days" name="day" id="day" placeholder="DD" minLength="2" maxLength="2"/>
            <datalist id="available-days">
              <option value="0"></option>
            </datalist>
            
          </label>
          <label for="month">Month
            <input list="available-months" name="month" id="month" placeholder="MM" minLength="2" maxLength="2"/>
            <datalist id="available-months">
              <option value="01"></option>
              <option value="02"></option>
              <option value="03"></option>
              <option value="04"></option>
              <option value="05"></option>
              <option value="06"></option>
              <option value="07"></option>
              <option value="08"></option>
              <option value="09"></option>
              <option value="10"></option>
              <option value="11"></option>
              <option value="12"></option>
            </datalist>

          </label>
          <label for="year">Year
            <input list="available-years" name="year" id="year" placeholder="YYYY" minLength="4" maxLength="4"/>
            <datalist id="available-years">
              <option value="0"></option>
            </datalist>
          </label>
          <span class="line"></span>
          <button>
            <img src="./assets/images/icon-arrow.svg" alt="Arrow pointing down">
          </button>
          <p class="years">
            <span id="years">
              --
            </span>
            <span>
              years
            </span>
          </p>
          <p class="months">
            <span id="months">
              --
            </span>
            <span>
              months
            </span>
          </p>
          <p class="days">
            <span id="days">
              --
            </span>
            <span>
              days
            </span>
          </p>
        </section>
      </form>
        <style>
          input::placeholder {
            font-weight: 700;
            color: var(--smokey-grey);
            font-size: 1.8em;
            align-self: center;
          }
            form{
            display: contents;
            }
          section[class="age-calculator-card"] {
            display: grid;
            height: 500px;
            width: 700px;
            grid-template-columns: repeat(4, 25%);
            background-color: white;
            gap: 10px;
            padding: 50px 100px 50px 50px;
            box-sizing: border-box;
            border-bottom-right-radius: 200px;
          }

          label:nth-of-type(1) {
            grid-column: 1;
          }

          label:nth-of-type(2) {
            grid-column: 2;

          }

          label:nth-of-type(3) {
            grid-column: 3;

          }

          label {
            width: 100%;
            text-transform: uppercase;
            font-style: normal;
          } 

          label input {
            height: 35px;
            padding-inline-start: 10px;
            width: 100%;
            box-sizing: border-box;
          }
          span[class="line"] {
            border: 0;
            border-top: 1px solid var(--smokey-grey);
            width: 100%;
            height: 1px;
            grid-row: 2;
            grid-column: 1 / -1;
            place-self: center;
          }

          button {
            grid-row: 2;
            border-radius: 50%;
            height: 50px;
            width: 50px;
            background-color: var(--purple);
            display: grid;
            place-content: center;
            place-self: center;
            grid-column: 4;
            justify-self: end;
          }

          button img {
            height: 100%;
            width: 100%;
            grid-column: -1;
          }

          span:first-child {
            color: var(--purple);
          }

          p {
            display: grid;
            grid-column: 1 / 4;
            font-size: 3.5em;
            padding: 0;
            margin: 0;
            font-weight: 800;
            text-align: start;
            grid-template-columns: auto 1fr;
            column-gap: 5px;
            font-family: 'Poppins_ExtraBoldItalic';
            user-select: none;
            -webkit-user-select: none;
          }

          p[class="years"] {
            grid-row: 3;
          }

          p[class="months"] {
            grid-row: 4;
          }

          p[class="days"] {
            grid-row: 5;
          }

          @container (inline-size < 1100px) {
            section[class="age-calculator-card"] {
              height: auto;
              width: 90cqw;
              grid-template-columns: repeat(3, 1fr);
              border-bottom-right-radius: 100px;
              padding: 50px;
            }

            p {
              font-size: 1.8em;
            }

            label:nth-of-type(1),
            label:nth-of-type(2),
            label:nth-of-type(3) {
              grid-column: unset;
            }

            button {
              grid-column: 2;
            }

            input::placeholder {
              font-size: 1.4em;
            }
          }
        </style>
      `;
class AgeCalculatorComponent extends HTMLElement {
  #internals;
  #form;
  #dayInput;
  #dayOutput;
  #monthInput;
  #monthOutput;
  #yearInput;
  #yearOutput;
  constructor() {
    super();
  };
  connectedCallback() {
    this.#internals = this.attachInternals();
    this.#internals.shadowRoot.innerHTML = template.innerHTML;
    this.#form = this.#internals.shadowRoot.querySelector("form");
    this.initializeFields();
    this.#dayInput = this.#internals.shadowRoot.querySelector("input[id='day']");
    this.#dayOutput = this.#internals.shadowRoot.querySelector("span[id='days']");
    this.#monthInput = this.#internals.shadowRoot.querySelector("input[id='month']");
    this.#monthOutput = this.#internals.shadowRoot.querySelector("span[id='months']");
    this.#yearInput = this.#internals.shadowRoot.querySelector("input[id='year']");
    this.#yearOutput = this.#internals.shadowRoot.querySelector("span[id='years']");
    this.#monthInput.addEventListener('input', (event) => {
      if (this.#monthInput.value != "" && this.#monthInput.checkValidity() && this.#yearInput.value != "" && this.#yearInput.checkValidity()) {
        const lastDayInAGivenMonth = this.getLastDayInGivenMonth();
        this.setOptionsForDateField(lastDayInAGivenMonth);
      }
    });
    this.#form.addEventListener('input', (event) => {
      this.#form.reportValidity();
      if (this.formFieldsAreFilled() && this.#form.checkValidity()) {
        this.displayAge();
      }
    })
  }
  initializeFields = () => {
    this.setupDefaultOptionsForDayAndYearFields();
  }
  setupDefaultOptionsForDayAndYearFields = () => {
    const lastDayOfDefaultMonth = 31;
    this.setOptionsForDateField(lastDayOfDefaultMonth);
    this.setOptionsForYearField(1875, 2025);
  }
  setOptionsForDateField = (lastDayInAGivenMonth) => {
    let dayOptions = "";
    for (let i = 0; i <= lastDayInAGivenMonth; i++) {
      dayOptions += `<option value="${i}"></option>`;
    }
    this.#internals.shadowRoot.querySelector('datalist[id="available-days"]').innerHTML = dayOptions;
  }
  setOptionsForYearField = (startYearRange, endYearRange) => {
    let yearOptions = "";
    for (let i = startYearRange; i <= endYearRange; i++) {
      yearOptions += `  <option value="${i}"></option>`;
    }
    this.#internals.shadowRoot.querySelector('datalist[id="available-years"]').innerHTML = yearOptions;
  }
  setAgeOutput = (birthDatePartInput, birthDatePartOutput, ageCalculatingFunction) => {
    if (!birthDatePartInput.checkValidity()) {
      birthDatePartOutput.textContent = "_ _";
    } else {
      birthDatePartOutput.textContent = ageCalculatingFunction();
    }
  }

  getDateOfBirth = () => {
    const birthDate = this.#yearInput.value + "-" + this.#monthInput.value + "-" + this.#dayInput.value;
    return DateTime.fromISO(birthDate);
  }
  displayAge = () => {
    const age = DateTime.now().diff(this.getDateOfBirth(), ["years", "months", "days"]).toObject();
    this.#dayOutput.textContent = Math.floor(Number(age.days));
    this.#monthOutput.textContent = Math.floor(Number(age.months));
    this.#yearOutput.textContent = Math.floor(Number(age.years));
  }
  formFieldsAreFilled() {
    return this.#dayInput.value != "" && this.#monthInput.value != "" && this.#yearInput.value != "";
  }
  getLastDayInGivenMonth = () => {
    if (this.#monthInput.value != "" && this.#monthInput.checkValidity() && this.#yearInput.value != "" && this.#yearInput.checkValidity()) {
      return DateTime.fromISO(this.#yearInput.value + "-" + this.#monthInput.value + "-01").daysInMonth
    }
  }
  disconnectedCallback() { }
}
if (!customElements.get("age-calculator-component")) {
  customElements.define('age-calculator-component', AgeCalculatorComponent);
}


