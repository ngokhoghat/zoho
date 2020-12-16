const puppeteer = require("puppeteer");
const moment = require("moment");

const URL =
  "https://accounts.zoho.com/signin?servicename=zohopeople&signupurl=https://www.zoho.com/people/signup.html";

const LOG_TIME_SHEET_URL =
  "https://people.zoho.com/hrportal1524046581683/zp#timesheet/form/add-formLinkName:Time_Log";

const userName = "ngocdt2@smartosc.com";
const passWord = "a@q0CYr0#Jq1";

// const userName = "hiepnc@smartosc.com";
// const passWord = "TWI92CcJ%^";

// const userName = "hiepnc@smartosc.com";
// const passWord = "TWI92CcJ%^";

const loginWithGoogleBtn = ".google_fed";
const loginBtn = ".zgh-accounts .zgh-login";
const nextBtn = ".qhFLie button";

const emailInput = ".Xb9hP input";
const passwordInput = ".Xb9hP input";

const attendanceTab = "#zp_maintab_attendance";

const attendanceTable = "#ZPAtt_listView";

const task = "#s2id_zp_field_412762000003736071";
const listTask = ".select2-results";

const expData = [
  {
    date: "Mon,23",
    time: "08:20 Hrs",
  },
  {
    date: "Tue,24",
    time: "07:49 Hrs",
  },
  {
    date: "Wed,25",
    time: "07:23 Hrs",
  },
  {
    date: "Thu,26",
    time: "07:41 Hrs",
  },
  {
    date: "Today,27",
    time: "02:24 Hrs",
  },
];

const zoho = {
  init: () => {
    try {
      zoho.getHomePage();
    } catch (error) {
      zoho.init();
    }
  },
  getHomePage: async () => {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 969,
      deviceScaleFactor: 1,
    });

    try {
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

      await page.waitFor(5000);
      await page.waitFor(attendanceTable);

      const myData = await page.evaluate(() => {
        const data = [];
        const days = document.querySelectorAll("#ZPAtt_listViewEntries tr");
        days.forEach((day, index) => {
          const dayElem = day.querySelectorAll("td");
          if (index > 0 && index < 6) {
            let days = {
              date: dayElem[1].innerText,
              time: dayElem[7].innerText,
            };
            data.push(days);
          }
        });

        return data;
      });

      (async function () {
        for (let i = 0; i < myData.length; i++) {
          const myNewData = zoho.cookData(myData[i]);
          const { time, date } = myNewData;
          console.log(myNewData);
          await page.goto(LOG_TIME_SHEET_URL);

          await page.waitForSelector("#zp_field_412762000003736073");
          await page.evaluate(
            ({ time, date }) => {
              document.getElementById(
                "zp_field_412762000003736073"
              ).value = time;
            },
            { time, date }
          );

          await page.waitForSelector(
            "#s2id_zp_field_412762000003736071 .select2-choice"
          ); // <-- wait until it exists
          await page.click("#s2id_zp_field_412762000003736071 .select2-choice");

          await page.waitForSelector("#select2-drop .select2-results li");
          await page.type("#select2-drop input", "Coding");

          await page.waitFor(3000);
          await page.keyboard.press("Enter");

          await page.waitForSelector(
            "#s2id_zp_field_412762000003736075 .select2-choice"
          ); // <-- wait until it exists
          await page.click("#s2id_zp_field_412762000003736075 .select2-choice");

          await page.waitForSelector("#select2-drop .select2-results li");
          await page.type("#select2-drop input", "PB_MQ_PA");

          await page.waitFor(3000);
          await page.keyboard.press("Enter");

          await page.waitForSelector(
            "#zp_field_outer_412762000003736077 input"
          ); // <-- wait until it exists
          await page.evaluate(
            ({ time, date }) => {
              document.getElementById(
                "zp_field_412762000003736077"
              ).value = date;
            },
            { time, date }
          );
        }
        await browser.close();
      })();
    } catch (error) {
      await browser.close();
    }
  },
  handleTime: async (data = expData) => {
    const today = new Date();
    console.log(today);
    // if
    return data;
  },
  cookData: (data) => {
    let day = data.date.split(",")[1];
    let timeSheet = data.time.split(" ")[0];
    let hoursMinutes = timeSheet.split(/[.:]/);
    let hours = parseInt(hoursMinutes[0], 10);
    let minutes = hoursMinutes[1] ? parseFloat(hoursMinutes[1]) : 0;
    return {
      time: parseFloat(
        `${hours}.${minutes >= 10 ? Math.round(minutes / 10) : 0}`
      ),
      date: moment(
        `${new Date().getFullYear().toString()}-${(
          new Date().getMonth() + 1
        ).toString()}-${day}`
      ).format("DD-MMM-YYYY"),
    };
  },
};

module.exports = zoho;
