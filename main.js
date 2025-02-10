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
    #yearInput;
    constructor() {
        super();
    };
    connectedCallback() {
        this.#internals = this.attachInternals();
        this.#form = this.#internals.shadowRoot.querySelector("form");
        this.#dayInput=this.#internals.shadowRoot.querySelector("input[id='day']");
        this.#monthInput=this.#internals.shadowRoot.querySelector("input[id='month']");
        this.#yearInput=this.#internals.shadowRoot.querySelector("input[id='year']").max = new Date().getFullYear();  
        this.#monthInput.addEventListener('input', (event) => {
            const lastDayInAGivenMonth = this.#dayMonths[this.#monthInput.value - 1].days;
            this.setMaximumValidDate(lastDayInAGivenMonth);
        });
        this.#form.addEventListener('input', (event) => this.#form.reportValidity());
    }
    setMaximumValidDate = (lastDayInAGivenMonth) => {
        this.#dayInput.max = lastDayInAGivenMonth;
    }
    disconnectedCallback() { }
}
if (!customElements.get("age-calculator-component")) {
    customElements.define('age-calculator-component', AgeCalculatorComponent);
}
