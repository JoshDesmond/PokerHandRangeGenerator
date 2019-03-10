import {CardCombos} from "../model/model.js";

const svg = d3.select("svg");
const margin = 10;
const width = 500 - 2 * margin;
const height = 500 - 2 * margin;
const gridWidth = width / 13;
const gridHeight = height / 13;
const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);

function gridData() {
    let data = [169];
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;
    var index = 0;

    // iterate for rows
    for (let row = 0; row < 13; row++) {
        // iterate for cells/columns inside rows
        for (let column = 0; column < 13; column++) {
            data[index] = {
                val: CardCombos[row][column],
                x: xpos,
                y: ypos,
                width: gridWidth,
                height: gridHeight
            };

            // increment the x position. I.e. move it over by 50 (width variable)
            index += 1;
            xpos += gridWidth;
        }
        // reset the x position after a row is complete
        xpos = 1;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += gridHeight;
    }
    return data;
}

const gridDataArray = gridData();
const cardDict = {};
for (let index in gridDataArray) {
    cardDict[gridDataArray[index].val] = gridDataArray[index];
}


class Views {
    constructor(model) {
        this.model = model;
        this.model.addObserver(this);
        this.drawCards();
    }

    /**
     * Called by the model on every update.
     */
    notify() {
        this.updateColors();
    }

    drawCards() {
        this.gridSVG = chart.selectAll(".square")
            .data(this.model.metaHandRanks)
            .enter()
            .append("rect")
            .attr("class", "square")
            .attr("x", (d) => cardDict[d.hand].x)
            .attr("y", (d) => cardDict[d.hand].y)
            .attr("width", (d) => cardDict[d.hand].width)
            .attr("height", (d) => cardDict[d.hand].height)
            .attr("id", (d) => cardDict[d.hand].val)
            .style("stroke", "#222")
            .each((data, index) => {
                chart.append("text")
                    .attr("x", cardDict[data.hand].x + gridWidth / 2)
                    .attr("y", cardDict[data.hand].y + gridHeight / 2)
                    .text(cardDict[data.hand].val)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "12px")
                    .attr("text-anchor", "middle")
            });
    }

    updateColors() {
        let squares = chart.selectAll(".square")
            .data(this.model.getMetaHandRanks());

        squares
            .style("fill", (data) => this.getColor(data.hand, data.rank, data.tightestRange))
    }

    /**
     * Returns the color of the given card value.
     * @param val
     */
    getColor(val, rank, tightestRange) {
        let l, a, b;

        if (tightestRange === "3bet") {
            a = 100;
        } else if (tightestRange === "early") {
            a = 50;
        } else if (tightestRange === "late") {
            a = -75;
        } else {
            l = 150;
            a = 0;
            b = 0;
        }

        if (tightestRange != "fold") {
            l = 70 + (rank / 169) * 120;
            b = 100;
        }

        return d3.lab(l, a, b);
    }


}


export {Views}