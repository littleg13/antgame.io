import { Config } from "../../config";

const Brushes = Config.brushes;
const FoodValue = Brushes.find(brush => brush.name === "Food").value;
const DirtValue = Brushes.find(brush => brush.name === "Dirt").value;
const BlockDecaySteps = Config.BlockDecaySteps;
const FoodPerCell = Config.FoodPerCell;
const DirtPerCell = Config.DirtPerCell;
const BorderWeight = Config.borderWeight;
const MapBounds = Config.MapBounds;
const MinDecayableAlpha = Config.MinDecayableAlpha;

export class MapGraphics {
  constructor(graphics) {
    this._graphics = graphics;
    this.pixelDensity = [];
    this.lastCell = "";
    this.brushColors = [];
    this.cellPixelInfo = [{}, {}];

    this._graphics.noStroke();
    this.populateBrushColors();
  }

  getPixelSizeInfo(mapSize, canvasSize) {
    const nominalCellSize = Math.floor(canvasSize / mapSize);
    const pixelsToMakeUp = canvasSize % mapSize;
    const spaceBetweenLongCells = mapSize / pixelsToMakeUp;

    const mapToPixelInfo = {};
    let canvasLocation = 0;
    let nextLongCell = spaceBetweenLongCells;
    for (let i = 0; i < mapSize; i++) {
      const isLastCell = i === mapSize - 1;
      const areCellsShort = canvasLocation + nominalCellSize < canvasSize;
      const isLongCell = Math.floor(nextLongCell) === i || (isLastCell && areCellsShort);
      if (isLongCell) nextLongCell += spaceBetweenLongCells;
      const weight = isLongCell ? nominalCellSize + 1 : nominalCellSize;
      mapToPixelInfo[i] = { startingPixel: canvasLocation, weight };
      canvasLocation += weight;
    }
    return mapToPixelInfo;
  }

  setupMap(canvasWidth, canvasHeight) {
    const drawableWidth = canvasWidth - BorderWeight * 2;
    const drawableHeight = canvasHeight - BorderWeight * 2;
    this.pixelDensity = [
      (drawableWidth / MapBounds[0]).toFixed(2),
      (drawableHeight / MapBounds[1]).toFixed(2),
    ];
    this.cellPixelInfo = [
      this.getPixelSizeInfo(MapBounds[0], drawableWidth),
      this.getPixelSizeInfo(MapBounds[1], drawableHeight),
    ];
  }

  populateBrushColors() {
    Brushes.forEach(brush => {
      if (brush.decayable) {
        for (let i = 1; i <= BlockDecaySteps; i++) {
          const index = brush.value + i;
          const alpha =
            Math.round((255 - MinDecayableAlpha) * (i / BlockDecaySteps)) + MinDecayableAlpha;
          this.brushColors[index] = this._graphics.color(brush.color);
          this.brushColors[index].setAlpha(alpha);
        }
      }
      if (brush.color) this.brushColors[brush.value] = this._graphics.color(brush.color);
    });
    this.brushColors["homeText"] = this._graphics.color("#F1948A");
    this.brushColors["foodText"] = this._graphics.color("#7DCEA0");
  }

  drawFullMap({ map }) {
    this._graphics.clear();
    this.lastCell = "";
    for (let x = 0; x < MapBounds[0]; x++) {
      for (let y = 0; y < MapBounds[1]; y++) {
        let cell = map[x][y];
        if (cell.length !== 1) cell = cell[0];
        if (cell !== " ") {
          if (cell !== this.lastCell) {
            this.lastCell = cell;
            this.setFillColor(this.brushColors[cell]);
          }
          this.drawCellColor([x, y]);
        }
      }
    }
    this.lastCell = "";
  }

  drawMap({ cellsToDraw, map }) {
    cellsToDraw.forEach(cellPos => {
      let cell = map[cellPos[0]][cellPos[1]];
      if (cell === " ") {
        this.eraseCell(cellPos);
        return;
      }
      if (cell !== this.lastCell) {
        this.lastCell = cell;
        if (cell[0] === FoodValue || cell[0] === DirtValue) {
          const cellAmount = cell.substr(1);
          let strength;
          if (!cellAmount) strength = BlockDecaySteps;
          else {
            const maxPerCell = cell[0] === FoodValue ? FoodPerCell : DirtPerCell;
            strength = Math.ceil(BlockDecaySteps * (cellAmount / maxPerCell));
          }
          const index = cell[0] + strength;
          this.setFillColor(this.brushColors[index]);
        } else {
          this.setFillColor(this.brushColors[cell]);
        }
      }
      this.eraseCell(cellPos);
      this.drawCellColor(cellPos);
    });
  }

  drawHomeAmounts({ homeAmounts, totalFood }) {
    if (homeAmounts)
      for (const [key, value] of Object.entries(homeAmounts)) {
        const location = key.split(",").map(point => parseInt(point));
        const score = Math.round((value / totalFood) * 100000);
        this.drawText([location[0], location[1]], score, this.brushColors.homeText);
      }
  }

  drawFoodAmounts({ foodAmounts }) {
    foodAmounts.forEach(amount => {
      this.drawText([amount.x, amount.y], amount.value, this.brushColors.foodText);
    });
  }

  drawText([x, y], textValue, color) {
    const intMapXY = MapXYToInt([x, y]);
    this._graphics.textAlign(this._graphics.CENTER, this._graphics.CENTER);
    this._graphics.textFont("Courier New", 16);
    this._graphics.fill(color);
    this._graphics.stroke(0);
    this._graphics.strokeWeight(4);
    this._graphics.text(
      textValue,
      Math.floor(BorderWeight + intMapXY[0] * this.pixelDensity[0] + this.pixelDensity[0] / 2),
      Math.floor(BorderWeight + intMapXY[1] * this.pixelDensity[1] + this.pixelDensity[1] / 2)
    );
    this.lastCell = false;
    this._graphics.strokeWeight(0);
  }

  setFillColor(color) {
    this._graphics.noErase();
    this._graphics.fill(color);
  }

  eraseCell(intMapXY) {
    this._graphics.erase();
    this.drawCellColor(intMapXY);
    this._graphics.noErase();
  }

  drawCellColor(mapXY) {
    const intMapXY = MapXYToInt(mapXY);
    const pixelInfoX = this.cellPixelInfo[0][intMapXY[0]];
    const pixelInfoY = this.cellPixelInfo[1][intMapXY[1]];
    this._graphics.rect(
      pixelInfoX.startingPixel + BorderWeight,
      pixelInfoY.startingPixel + BorderWeight,
      pixelInfoX.weight,
      pixelInfoY.weight
    );
  }

  mapXYToCanvasXY(mapXY) {
    return [
      BorderWeight + mapXY[0] * this.pixelDensity[0] + this.pixelDensity[0] / 2,
      BorderWeight + mapXY[1] * this.pixelDensity[1] + this.pixelDensity[1] / 2,
    ];
  }

  canvasXYToMapXY(canvasXY) {
    let mapX;
    let mapY;

    for (const xPos in this.cellPixelInfo[0]) {
      const keyDrawingInfo = this.cellPixelInfo[0][xPos];
      if (this.canvasLocationInsideRange(canvasXY[0], keyDrawingInfo)) {
        mapX = xPos;
      }
    }

    for (const yPos in this.cellPixelInfo[1]) {
      const keyDrawingInfo = this.cellPixelInfo[1][yPos];
      if (this.canvasLocationInsideRange(canvasXY[1], keyDrawingInfo)) {
        mapY = yPos;
      }
    }

    return [parseInt(mapX), parseInt(mapY)];
  }

  canvasLocationInsideRange(canvasLocation, drawingInfo) {
    const adjustedLocation = canvasLocation - BorderWeight;
    const startingPixel = drawingInfo.startingPixel;
    return (
      startingPixel <= adjustedLocation && adjustedLocation <= startingPixel + drawingInfo.weight
    );
  }
}

const MapXYToInt = mapXY => {
  return [Math.round(mapXY[0]), Math.round(mapXY[1])];
};
