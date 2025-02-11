const template = document.createElement("template");
template.innerHTML = `
        <form action="">
        <section class="age-calculator-card">
          <label for="day">Day
            <input list="available-days" name="day" id="day" placeholder="DD"/>
            <datalist id="available-days">
              <option value="0"></option>
            </datalist>
            
          </label>
          <label for="month">Month
                      <input list="available-months" name="month" id="month" placeholder="MM"/>
            <datalist id="available-months">
              <option value="00"></option>
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
            <input list="available-years" name="year" id="year" placeholder="YYYY"/>
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
    #dayMonths = [
        {
            month: "January", days: 31
        },
        {
            month: "February", days: 28
        },
        {
            month: "March", days: 31
        },
        {
            month: "April", days: 30
        },
        {
            month: "May", days: 31
        },
        {
            month: "June", days: 30
        },
        {
            month: "July", days: 31
        },
        {
            month: "August", days: 31
        },
        {
            month: "September", days: 30
        },
        {
            month: "October", days: 31
        },
        {
            month: "November", days: 30
        },
        {
            month: "December", days: 31
        }
    ];
    #form;
    #dayInput;
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
        console.log(this.#form)
        this.initializeFields();
        this.#dayInput = this.#internals.shadowRoot.querySelector("input[id='day']");
        this.#monthInput = this.#internals.shadowRoot.querySelector("input[id='month']");
        this.#monthOutput = this.#internals.shadowRoot.querySelector("span[id='months']");
        this.#yearInput = this.#internals.shadowRoot.querySelector("input[id='year']");
        this.#yearOutput = this.#internals.shadowRoot.querySelector("span[id='years']");
        this.#yearInput.addEventListener('input', (event) => {
            this.setAgeOutput(this.#yearInput, this.#yearOutput, this.getAgeInYears);
        })
        this.#monthInput.addEventListener('input', (event) => {
            const lastDayInAGivenMonth = this.#dayMonths[this.#monthInput.value - 1].days;
            this.setMaximumValidDate(lastDayInAGivenMonth);
            this.setAgeOutput(this.#monthInput, this.#monthOutput, this.getAgeInMonths);
        });
        this.#form.addEventListener('input', (event) => this.#form.reportValidity());
    }
    initializeFields = () => {
        this.setupDefaultOptionsForDayAndYearFields();
    }
    setupDefaultOptionsForDayAndYearFields = () => {
        const lasyDayOfDefaultMonth = 31;
        let dayOptions = "";
        for (let i = 0; i <= lasyDayOfDefaultMonth; i++) {
            dayOptions += `<option value="${i}"></option>`;
        }
        this.#internals.shadowRoot.querySelector('datalist[id="available-days"]').innerHTML = dayOptions;
        let yearOptions = "";
        const startYearRange = 1875;
        const endYearRange = 2025;
        for (let i = startYearRange; i <= endYearRange; i++) {
            yearOptions += `  <option value="${i}"></option>`;
        }
        this.#internals.shadowRoot.querySelector('datalist[id="available-years"]').innerHTML = yearOptions;
    }
    setMaximumValidDate = (lastDayInAGivenMonth) => {
        this.#dayInput.max = lastDayInAGivenMonth;
    }
    setAgeOutput = (birthDatePartInput, birthDatePartOutput, ageCalculatingFunction) => {
        if (!birthDatePartInput.checkValidity()) {
            birthDatePartOutput.textContent = "_ _";
        } else {
            birthDatePartOutput.textContent = ageCalculatingFunction();
        }
    }
    getAgeInYears = () => {
        const yearOfbirth = Number(this.#yearInput.value);
        if (yearOfbirth == 0) {
            return 0;
        }
        return new Date().getFullYear() - Number(this.#yearInput.value);
    }
    getAgeInMonths = () => {
        console.log("adas", this.#monthInput.value)
        const monthOfbirth = Number(this.#monthInput.value);
        if (monthOfbirth == 0) {
            return 0;
        }
        return new Date().getMonth() - Number(this.#monthInput.value);
    }
    disconnectedCallback() { }
}
if (!customElements.get("age-calculator-component")) {
    customElements.define('age-calculator-component', AgeCalculatorComponent);
}
