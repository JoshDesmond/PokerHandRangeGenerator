import {getTightMetaRankings, getHeadsupRankings, getRandomMetaRankings, HandLogic} from "./handrankings.js";

const TypeEnum = {
    TIGHT: "tight",
    RANDOM: "random",
    HEADS_UP: "heads-up"
};

const RangesEnum = ["fold", "late", "early", "3bet"];

// Generate Card Combos
const Cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const CardCombos = [];
for (let i = 0; i < Cards.length; i++) {
    CardCombos[i] = [];
    for (let j = 0; j < Cards.length; j++) {
        if (j > i) {
            CardCombos[i].push(Cards[i] + Cards[j]);
            CardCombos[i][j] += "s";
        } else {
            CardCombos[i].push(Cards[j] + Cards[i]);

        }
    }
}

class Model {
    constructor() {
        this.observers = [];
        this.rangeDictionary = {};
        this.rangeDictionary["fold"] = 1;
        this.selectRangeType("tight");
    }


    /**
     * Sets the rangeType to the given string.
     * @param rangeTypeValueString
     */
    selectRangeType(rangeTypeValueString) {
        const currentRange = this.rangeType;
        this.rangeType = rangeTypeValueString;

        if (currentRange == this.rangeType) {
            return; // no change to hand type.
        }

        if (rangeTypeValueString == "tight") {
            this.metaHandRanks = getTightMetaRankings();
        } else if (rangeTypeValueString == "random") {
            this.metaHandRanks = getRandomMetaRankings();
        } else if (rangeTypeValueString == "heads-up") {
            this.metaHandRanks = getHeadsupRankings();
        } else {
            console.error("Illegal argument for selectRangeType()");
        }

        this.updateMetaRanges();
        this.update();
    }

    /**
     * Updates the given rangeType to the given value.
     * @param newValue value between 0.5 and 100 representing percent.
     * @param rangeType string representing type of range.
     */
    updateRangeSlider(newValue, rangeType) {
        this.rangeDictionary[rangeType] = newValue / 100;

        this.updateMetaRanges();
        this.update();
    }

    /**
     * Updates the 'tightestRange' values of every card in metaHandRanks
     */
    updateMetaRanges() {
        for (let rangesEnumIndex in RangesEnum) {
            for (let i = 0; i < 169; i++) {
                if (this.metaHandRanks[i].cumulativePercentage <= this.rangeDictionary[RangesEnum[rangesEnumIndex]]) {
                    this.metaHandRanks[i].tightestRange = RangesEnum[rangesEnumIndex];
                }
            }
        }
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    update() {
        for (let index in this.observers) {
            this.observers[index].notify();
        }
    }

    getMetaHandRanks() {
        return this.metaHandRanks;
    }
}

export {Model, CardCombos}