import axios from "axios";
import https from "https";
import crypto from "crypto";

const httpsAgent = new https.Agent({
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
});

async function main() {
  try {
    const response = await axios.get("https://ard.wb.gov.in/api/v1/appointments", {
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    console.log("Success! Data length:", response.data?.length);
    console.log("Data:", response.data.slice(0, 2));
  } catch(e) {
    console.error("Axios Error:", e.message);
  }
}
main();
