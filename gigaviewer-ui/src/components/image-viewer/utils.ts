export const getScalebarSizeAndTextForMetric = (ppm: number, minSize: number) => {
    const value = normalize(ppm, minSize);
    const factor = roundSignificand((value / ppm) * minSize, 3);
    const size = value * minSize;
    const valueWithUnit = getWithUnit(factor, 'm');
    return {
      size: size,
      text: valueWithUnit,
    };
}

// export const getTotalFrames = (data: any) => {
//     return data[0].sources[0].length;
//     // var sum = 0;
//     // for (var i = 0; i < data[0].frame.source.length; i++)
//     //   sum++;
//     // return sum;
// };

const calcLog10 = (x: number) => {
    return Math.log(x) / Math.log(10);
}

const getSignificand = (x: number) => {
    return x * Math.pow(10, Math.ceil(-calcLog10(x)));
}

const normalize = (value: number, minSize: number) => {
    const significand = getSignificand(value);
    const minSizeSign = getSignificand(minSize);
    let result = getSignificand(significand / minSizeSign);
    if (result >= 5) {
      result /= 5;
    }
    if (result >= 4) {
      result /= 4;
    }
    if (result >= 2) {
      result /= 2;
    }
    return result;
}

const getWithUnit = (value: number, unitSuffix: string) => {
    if (value < 0.000001) {
      return value * 1000000000 + ' n' + unitSuffix;
    }
    if (value < 0.001) {
      return value * 1000000 + " μ" + unitSuffix;
    }
    if (value < 1) {
      return value * 1000 + " m" + unitSuffix;
    }
    if (value >= 1000) {
      return value / 1000 + " k" + unitSuffix;
    }
    return value + " " + unitSuffix;
}

const roundSignificand = (x: number, decimalPlaces: number) => {
    const exponent = -Math.ceil(-calcLog10(x));
    const power = decimalPlaces - exponent;
    const significand = x * Math.pow(10, power);
    // To avoid rounding problems, always work with integers
    if (power < 0) {
      return Math.round(significand) * Math.pow(10, -power);
    }
    return Math.round(significand) / Math.pow(10, power);
  }
