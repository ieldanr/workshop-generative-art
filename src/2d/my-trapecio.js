const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes/1000.json');
const random = require('canvas-sketch-util/random');

let palette = random.pick(palettes);

palette = random.shuffle(palette);
palette = palette.slice(0, random.rangeFloor(2, palette.length + 1));

const background = palette.shift();

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const count = 6;

  const createGrid = () => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);
        const position = [u, v];
        points.push({
          position
        });
      }
    }
    return points;
  };

  const createTrapecios = points => {
    const trapecios = [];
    for (let x = 0; x < points.length; x = x + 2) {
      trapecios.push({
        point1: points[x],
        point2: points[x + 1],
        color: random.pick(palette)
      });
    }
    return trapecios;
  };

  let points = createGrid();

  points = random.shuffle(points);
  console.log(points);

  let trapecios = createTrapecios(points);

  return ({ context, width, height }) => {
    const margin = width * 0.175;

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    trapecios.sort((trapecio1, trapecio2) => {
      u1 = (trapecio1.point1.position[1] + trapecio1.point2.position[1]) / 2.0;
      u2 = (trapecio2.point1.position[1] + trapecio2.point2.position[1]) / 2.0;
      return u1 - u2;
    });
    trapecios.forEach(trapecio => {
      const { point1, point2 } = trapecio;
      const x1 = lerp(margin, width - margin, point1.position[0]);
      const y1 = lerp(margin, height - margin, point1.position[1]);
      const x2 = lerp(margin, width - margin, point2.position[0]);
      const y2 = lerp(margin, height - margin, point2.position[1]);

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x2, height - margin);
      context.lineTo(x1, height - margin);
      context.closePath();
      context.fillStyle = trapecio.color;
      context.globalAlpha = 0.5;
      context.fill();

      context.strokeStyle = background;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
