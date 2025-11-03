import axios from "axios";

const yahooClient = axios.create({
  baseURL: "https://query1.finance.yahoo.com/v8/finance/chart",
  timeout: 5000,
});

export default yahooClient;
