// This function is inspired by the following tutorial:
// https://www.w3schools.com/ai/ai_regressions.asp
function linearRegression(xArray, yArray) {
  let xSum = 0,
    ySum = 0,
    xxSum = 0,
    xySum = 0;
  let count = xArray.length;

  for (let i = 0; i < count; i++) {
    xSum += xArray[i];
    ySum += yArray[i];
    xxSum += xArray[i] * xArray[i];
    xySum += xArray[i] * yArray[i];
  }

  let slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
  let intercept = ySum / count - (slope * xSum) / count;

  return [slope, intercept];
}

export function regressionLine(dates, values) {
  const xArray = dates.map((_, i) => i);
  const [slope, intercept] = linearRegression(xArray, values);
  return xArray.map((x) => slope * x + intercept);
}
