import {Model} from "./model/model.js";
import {Views} from "./views/views.js";

const radioElements = document.querySelectorAll('input[name=range-type]');
const sliderRangeElements = document.querySelectorAll("input[class=slider]");
const sliderTextElements = document.querySelectorAll("input[class=range-text]");

class Controller {

    constructor(model) {
        this.model = model;

        // Radio Controllers
        const radioClickListener = (e) => {
            this.model.selectRangeType(e.srcElement.getAttribute("value"));
        }
        let radioElement;
        for (radioElement of radioElements) {
            radioElement.addEventListener("click", radioClickListener);
        }

        // Range Slider Controllers
        const sliderListener = (e) => {
            let newValue = e.target.value;
            const rangeType = e.target.parentElement.getAttribute("id");
            this.updateRangeSlider(newValue, rangeType);
        };
        let sliderElement;
        for (sliderElement of sliderRangeElements) {
            sliderElement.addEventListener("input", sliderListener);
        }

        // Slider Text Controllers
        const sliderTextListener = (e) => {
            const rangeType = e.target.parentElement.parentElement.getAttribute("id");
            let newValue = e.target.value;
            newValue = newValue.replace(/[^0-9.]/g, "");
            this.updateRangeSlider(newValue, rangeType);
        };
        let sliderTextElement;
        for (sliderTextElement of sliderTextElements) {
            sliderTextElement.addEventListener("keyup", sliderTextListener);
        }
    }

    /**
     * Updates the ranges of the slider and text
     * @param newValue the new value
     * @param rangeType the ID of the parent div. "primary", "3bet", "secondary"
     */
    updateRangeSlider(newValue, rangeType) {
        const parentElement = document.getElementById(rangeType);
        let element;
        for (element of parentElement.children) {
            if (element.tagName === "P") {
                element.children.item(1).value = newValue;
            } else if (element.tagName === "INPUT") {
                element.value = newValue;
            }
        }

        this.model.updateRangeSlider(Number(newValue), rangeType);
    }

    run() {
        // Initialize Sliders:
        controller.updateRangeSlider(4, "3bet");
        controller.updateRangeSlider(14, "early");
        controller.updateRangeSlider(25, "late");

        this.model.running = true;
    }
}

// Initialize MVC elements
const model = new Model();
const views = new Views(model);
const controller = new Controller(model, views);
controller.run();

