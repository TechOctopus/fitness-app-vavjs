// This test is inspired by the following article:
// https://medium.com/@cofiali53/automation-api-testing-in-javascript-using-mocha-chai-and-supertest-a-beginners-guide-47e317e04501

var assert = require("assert");

const API_URL = "http://localhost:8080/api";
const SUCCESS_HTTP_STATUS = 200;

describe("E2E tests", () => {
  let jwtToken = null;

  before("should login", async () => {
    const payload = {
      email: "admin",
      password: "admin",
    };

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    jwtToken = response.token;
  });

  it("should add new measurement", async () => {
    const newMeasurement = {
      measurement: "weight",
      value: 99,
      date: "2021-01-01",
      methodId: 1,
    };

    const response = await fetch(`${API_URL}/measurement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newMeasurement),
    }).then((res) => {
      assert.equal(res.status, SUCCESS_HTTP_STATUS);
      return res.json();
    });

    assert.equal(response.name, "Weight");
    assert.equal(response.value, 99);
    assert.equal(response.date, "2021-01-01");
    assert.equal(response.method, "Swimming");
  });
});
