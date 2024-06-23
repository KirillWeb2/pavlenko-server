import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const serviceAccountAuth = new JWT({
  email: "hummer@hummer-427300.iam.gserviceaccount.com",
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmbOMwzV81g+eX\npK18v2STqe7P/aIsGQKdRxWsy8C2xyrLy2zImPQld7x7/iWG7glpu6ydbohVCRuF\nRRmF76JCFyT3gELjHiHUwr8L6OGEtDs1/xbeRWHhTSiT+1Tg+lMuNNfaf40mRnPO\nne7NnoK8hcMEo2XEpeIuyXXkT41teZYkFTH3+FeRv8LAR6gvXE2K6e4vO6G0bBmE\nbJyES4U4z5ib4/iEdxNxDGi/IsGXnh1ddvvBqIEScOcy/PwrKOJ16JNl8Ym4Ier4\nJpP0kEjsOGH+k4GLGqzlWTPDLFaNZ809Gm5GTvD184tXngfbYNgbkqPESbOqdN65\nbJ2GrnDfAgMBAAECggEAbf3RLyUBiyaVQMY7iB5GUNRfqkoMhRdFL7VUa+Dw8268\nB37pxRF6DX6L6vYkjLWIqb+LxLSUAF9yExoqdkwuvHSW0UwY4ZgrFwgFMRavu+xa\njUpgbKZa9DSkJ4tj92aWmSphVSvowToFIr4x1VYSWxJQxqCGvile/+1ryJmOzY/C\nBSFcjB2q+5la9kAuDVzyeYdlsYkmM2dLHmWuBDx85trLLdUedug7DDy5n9ajnWtL\nteSkPl6j8jiEMnjmr4BQkBJrPrKjo98OuOUZzGeuXcqYcCyJNA01pIjFu7SRLO/2\nj/4IN0dLz3r5CBk2u+PhPrWqI0Uqy444MdxXfp8xxQKBgQD4TOYQTKM/NLKb9TRc\n047rvYrZhGFtf/hXGbVTK38iTnucRvtrT8zNZTpQhMF9dfFxwp+nQUImjMBSWtIw\nsC/V2AxSj2OyZ3pBFQ3yvxS+xOTV+b1JH3BI185KsUz9g0VmQNorbnSAfXEbmW+e\nFRzxSc0wxu0Ym569sYVjQ1F8DQKBgQDtkhcJ5KEtjDRXK/BnF1l+FF7Bc+QYc3eY\n4Z6yVZL75/pWkCDDism0rOz9bW3Jb5NRUEwXYpGdoUJmJqfh4wfgc+OEc3j1dCww\nsq580nhDn2MLSll0sHd/bH5JHdV4vL6VUbQfIyBox8QOxWSPEqFUFMWvA6LCjW9Y\ne94RUZNpmwKBgQChBR1dDJYA8yeww78FQ5y3e9+DV7nmzMo7kcxo9xgnI0Y9/jol\nSUbDHBZJCQ6BUe8VmuT2DffcEALYZVVRhbA/uS+kiqBYnYpGkmTNOuU1IXJU4PPD\na8PhOTHqdjg7Xtmuiffxmluqx66F+2bK2V4/i2CpdRdkkebLlUevK4S4MQKBgDhu\nHhjUfNCD4B7gqf7i1fgTwJo0+/Yu3zaqSPbVSs+ZP6Z2H8Iy4kyPUs+zwYM6hISp\nDRn06N/HYS1Ae1o1gjZ3cJCSmSW8jY6XssilebmeT3lsFKmaDRhwXeLiOkWul5qC\nSMWoo1cgNFrJ2mP9qeJ9+KLkuzF5RPyAl7QHa3uHAoGBANl1TSq227LQ/NREK43j\nlh+43JVs5dY0K4HAt7SpTXAzctNTT1MgRv70ee7U0YD3BiHALVeTNDOgiWbyaNkB\nU0ve54J0S6RojTQym+/gZeo5qcAjpEi7NI4v8f4neKgzD2iLRugXPhJsKQNjY5uL\nT2uGZjKQ/0ZO3qmdxpnpgoz+\n-----END PRIVATE KEY-----\n",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const docOrders = new GoogleSpreadsheet(
  "1H1ZS2D3rAKC5a9m1k1Z8GgK7-PPuzuCKYuZoqM_4M54",
  serviceAccountAuth
);

const docContacts = new GoogleSpreadsheet(
  "10h3WyzA_xudKn2ofRJAVDZg4Cz--NPxAAPRKsGjVpaY",
  serviceAccountAuth
);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  return res.send("Express Typescript on Vercel");
});

app.post("/api/order", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      address,
      card_number,
      card_period,
      card_cvv,
    } = req.body;

    await docOrders.loadInfo();

    const sheet = await docOrders.sheetsByTitle["orders"];

    await sheet.addRow({
      firstname,
      lastname,
      email,
      address,
      card_number,
      card_period,
      card_cvv,
    });

    return res.status(200).json({
      message: "ok",
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await docContacts.loadInfo();

    const sheet = await docContacts.sheetsByTitle["contacts"];

    await sheet.addRow({
      name,
      email,
      message,
    });

    return res.status(200).json({
      message: "ok",
    });
  } catch (error) {
    console.log(error);
  }
});

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server started on ${port} port`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
