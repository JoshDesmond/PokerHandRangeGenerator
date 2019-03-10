import {CardCombos} from "./model.js";

// Generate Card Combo Percentages
const totalHands = 1326;
const pairWeight = 6;
const suitedWeight = 4;
const offWeight = 12;

class HandLogic {
    /**
     * Returns true if hand is suited
     * @param hand string of length 2-3
     */
    static isSuited(hand) {
        return hand.includes("s");
    }

    /**
     * returns true if the hand is a pair
     * @param hand string of length 2-3
     */
    static isPair(hand) {
        return (hand.length == 2 && (hand[0] === hand[1]));
    }

    /**
     * Returns true if the hand isn't offsuit, and not a pair
     * @param hand string of length 2-3
     */
    static isOff(hand) {
        return (!this.isPair(hand) && !this.isSuited(hand));
    }

    /**
     * Returns the percentage of total hands the given hand represents
     * @param hand string of length 2-3
     * @returns number weight of card
     */
    static getCardWeight(hand) {
        if (this.isSuited(hand)) {
            return suitedWeight;
        } else if (this.isOff(hand)) {
            return offWeight;
        } else if (this.isPair(hand)) {
            return pairWeight;
        } else {
            console.error("Hand wasn't suited, off, or paired");
        }
    }
}

/**
 * Returns a list of meta-data-hands given a list of hands ranked in order. A meta-data-hands list is a list of objects,
 * which includes the hand, it's cumulative probability, and it's rank. The data structure can also be used in model
 * to store state.
 *
 * @param rankings list of all hands in order of strength
 * @returns {[]}
 */
function getMetaHandListFromRankings(rankings) {
    let metaHandList = [169];

    let cumulativeWeight = 0;
    for (let cardIndex in rankings) {
        const currentHand = rankings[cardIndex];
        const cardWeight = HandLogic.getCardWeight(currentHand);
        cumulativeWeight += cardWeight;
        const cumulativePercentage = cumulativeWeight / totalHands;
        metaHandList[cardIndex] = {
            hand: currentHand,
            cumulativePercentage: cumulativePercentage,
            rank: cardIndex
        }
    }



    // Now we have to order the cards back in the original order since d3 cares about data ordering.
    let NuMetaHandList = [169];
    let index = 0;
    for (let i = 0; i < 13; i++) {
        for (let j = 0; j <13; j++) {
            // find the card CardCombos[i][j] in metaHandList
            const currCard = CardCombos[i][j];
            for (let x = 0; x < 169; x++) {
                if (metaHandList[x].hand === currCard) {
                    NuMetaHandList[index] = metaHandList[x];
                }
            }

            if (NuMetaHandList[index] == null) console.error("card not found" + currCard);
            index += 1;
        }
    }

    return NuMetaHandList;
}

// Generate TightHand Rankings
const TightHandRankings = ["AA", "KK", "QQ", "JJ", "AKs", "TT", "AK", "AQs", "99", "AJs", "AQ", "88", "ATs", "KQs", "AJ", "77", "KJs", "QJs", "KTs", "KQ", "A9s", "AT", "66", "A8s", "QTs", "JTs", "KJ", "A7s", "A5s", "K9s", "A4s", "A6s", "55", "Q9s", "A3s", "J9s", "KT", "QJ", "A9", "T9s", "K8s", "A2s", "K7s", "44", "A8", "QT", "Q8s", "JT", "J8s", "K6s", "98s", "T8s", "K5s", "A7", "K4s", "K9", "A5", "33", "K3s", "A4", "Q9", "87s", "Q7s", "T7s", "Q6s", "K2s", "J7s", "A6", "97s", "Q5s", "A3", "J9", "T9", "22", "K8", "A2", "Q4s", "76s", "K7", "86s", "96s", "J6s", "J5s", "K6", "Q3s", "Q2s", "T6s", "65s", "K5", "75s", "Q8", "54s", "J8", "J4s", "T8", "98", "85s", "95s", "K4", "J3s", "64s", "T4s", "T5s", "87", "Q7", "K3", "J2s", "74s", "97", "J7", "53s", "Q6", "T3s", "K2", "94s", "T7", "84s", "43s", "63s", "Q5", "86", "T2s", "93s", "76", "Q4", "92s", "96", "73s", "J6", "Q3", "52s", "65", "J5", "T6", "82s", "42s", "83s", "Q2", "75", "54", "J4", "62s", "85", "32s", "95", "72s", "J3", "T5", "T4", "64", "J2", "53", "74", "84", "T3", "43", "94", "T2", "93", "63", "92", "73", "52", "42", "83", "82", "62", "32", "72"];
const RandomHandRankings = ["AA", "KK", "QQ", "AKs", "JJ", "AQs", "KQs", "AJs", "KJs", "TT", "AK", "ATs", "QJs", "KTs", "QTs", "JTs", "99", "AQ", "A9s", "KQ", "88", "K9s", "T9s", "A8s", "Q9s", "J9s", "AJ", "A5s", "77", "A7s", "KJ", "A4s", "A3s", "A6s", "QJ", "66", "K8s", "T8s", "A2s", "98s", "J8s", "AT", "Q8s", "K7s", "KT", "55", "JT", "87s", "QT", "44", "22", "33", "K6s", "97s", "K5s", "76s", "T7s", "K4s", "K2s", "K3s", "Q7s", "86s", "65s", "J7s", "54s", "Q6s", "75s", "96s", "Q5s", "64s", "Q4s", "Q3s", "T9", "T6s", "Q2s", "A9", "53s", "85s", "J6s", "J9", "K9", "J5s", "Q9", "43s", "74s", "J4s", "J3s", "95s", "J2s", "63s", "A8", "52s", "T5s", "84s", "T4s", "T3s", "42s", "T2s", "98", "T8", "A5", "A7", "73s", "A4", "32s", "94s", "93s", "J8", "A3", "62s", "92s", "K8", "A6", "87", "Q8", "83s", "A2", "82s", "97", "72s", "76", "K7", "65", "T7", "K6", "86", "54", "K5", "J7", "75", "Q7", "K4", "K3", "96", "K2", "64", "Q6", "53", "85", "T6", "Q5", "43", "Q4", "Q3", "74", "Q2", "J6", "63", "J5", "95", "52", "J4", "J3", "42", "J2", "84", "T5", "T4", "32", "T3", "73", "T2", "62", "94", "93", "92", "83", "82", "72"];
const HeadsupHandRankings = ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "AKs", "77", "AQs", "AJs", "AK", "ATs", "AQ", "AJ", "KQs", "66", "A9s", "AT", "KJs", "A8s", "KTs", "KQ", "A7s", "A9", "KJ", "55", "QJs", "K9s", "A5s", "A6s", "A8", "KT", "QTs", "A4s", "A7", "K8s", "A3s", "QJ", "K9", "A5", "A6", "Q9s", "K7s", "JTs", "A2s", "QT", "44", "A4", "K6s", "K8", "Q8s", "A3", "K5s", "J9s", "Q9", "JT", "K7", "A2", "K4s", "Q7s", "K6", "K3s", "T9s", "J8s", "33", "Q6s", "Q8", "K5", "J9", "K2s", "Q5s", "T8s", "K4", "J7s", "Q4s", "Q7", "T9", "J8", "K3", "Q6", "Q3s", "98s", "T7s", "J6s", "K2", "22", "Q2s", "Q5", "J5s", "T8", "J7", "Q4", "97s", "J4s", "T6s", "J3s", "Q3", "98", "87s", "T7", "J6", "96s", "J2s", "Q2", "T5s", "J5", "T4s", "97", "86s", "J4", "T6", "95s", "T3s", "76s", "J3", "87", "T2s", "85s", "96", "J2", "T5", "94s", "75s", "T4", "93s", "86", "65s", "84s", "95", "T3", "92s", "76", "74s", "T2", "54s", "85", "64s", "83s", "94", "75", "82s", "73s", "93", "65", "53s", "63s", "84", "92", "43s", "74", "72s", "54", "64", "52s", "62s", "83", "42s", "82", "73", "53", "63", "32s", "43", "72", "52", "62", "42", "32"];
    function getTightMetaRankings() {
    return getMetaHandListFromRankings(TightHandRankings);
}

function getRandomMetaRankings() {
    return getMetaHandListFromRankings(RandomHandRankings);
}

function getHeadsupRankings() {
    return getMetaHandListFromRankings(HeadsupHandRankings);
}

export {getTightMetaRankings, getRandomMetaRankings, getHeadsupRankings, HandLogic}