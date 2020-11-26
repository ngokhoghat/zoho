const puppeteer = require("puppeteer");

const URL =
  "https://accounts.zoho.com/signin?servicename=zohopeople&signupurl=https://www.zoho.com/people/signup.html";

const LOG_TIME_SHEET_URL =
  "https://people.zoho.com/hrportal1524046581683/zp#timesheet/form/add-formLinkName:Time_Log";

const userName = "ngocdt2@smartosc.com";
const passWord = "a@q0CYr0#Jq1";

const loginWithGoogleBtn = ".google_fed";
const loginBtn = ".zgh-accounts .zgh-login";
const nextBtn = ".qhFLie button";

const emailInput = ".Xb9hP input";
const passwordInput = ".Xb9hP input";

const attendanceTab = "#zp_maintab_attendance";

const attendanceTable = "#ZPAtt_listView";

const task = "#s2id_zp_field_412762000003736071";
const listTask = ".select2-results";

const zoho = {
  init: () => {
    zoho.getHomePage();
  },
  getHomePage: async () => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 969,
      deviceScaleFactor: 1,
    });
    await page.goto(URL);

    // await page.waitFor(loginBtn);
    // await page.$eval(loginBtn, (elem) => elem.click());

    await page.waitFor(loginWithGoogleBtn);
    await page.$eval(loginWithGoogleBtn, (elem) => elem.click());

    await page.waitFor(emailInput);
    await page.type(emailInput, userName);

    await page.waitFor(1000);
    await page.waitFor(nextBtn);
    await page.$eval(nextBtn, (elem) => elem.click());

    await page.waitFor(2000);
    await page.waitFor(passwordInput);
    await page.type(passwordInput, passWord);

    await page.waitFor(1000);
    await page.waitFor(nextBtn);
    await page.$eval(nextBtn, (elem) => elem.click());

    await page.waitFor(attendanceTab);
    await page.$eval(attendanceTab, (elem) => elem.click());

    await page.waitFor(2000);
    await page.waitFor(attendanceTable);

    const myData = await page.evaluate(() => {
      const data = [];
      const days = document.querySelectorAll("#ZPAtt_listViewEntries tr");
      days.forEach((day) => {
        const dayElem = day.querySelectorAll("td");
        let days = {
          date: dayElem[1].innerText,
          time: dayElem[7].innerText,
        };
        data.push(days);
      });

      return data;
    });

    await page.goto(LOG_TIME_SHEET_URL);

    await page.waitFor(5000);
    await page.waitFor("#zp_field_412762000003736073");
    await page.type("#zp_field_412762000003736073", "8.0");

    await page.waitFor(1000);
    await page.waitFor(".select2-results");
    await page.evaluate(() => {
      const a = document.querySelector("#zp_field_outer_412762000003736071");
      a.click();
      const b = document.querySelector("#s2id_zp_field_412762000003736071");
      b.click();
      const c = document.querySelector(".select2-choice");
      c.click();
      //   const listTasks = document.querySelectorAll(".select2-results li");
      //   listTasks.forEach((item) => {
      //     item.click();
      //   });
    });

    // await browser.close();
  },
};

module.exports = zoho;
