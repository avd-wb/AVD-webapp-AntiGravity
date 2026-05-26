import axios from "axios";

async function main() {
  try {
    const response = await axios.get("http://localhost:3000/api/transfers");
    console.log(response.data);
  } catch(e) {
    if (e.response) {
       console.log("Error response:", e.response.data);
    } else {
       console.error("Local fetch Error:", e.message);
    }
  }
}
main();
