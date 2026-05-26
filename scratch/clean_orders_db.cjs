const fs = require("fs");
const path = require("path");

const ordersPath = path.resolve(__dirname, "../src/data/orders_master_index.json");
const linksPath = path.resolve(__dirname, "../src/data/employee_order_links.json");

if (!fs.existsSync(ordersPath)) {
  console.error("Orders index file not found!");
  process.exit(1);
}

// 1. Read data
const orders = JSON.parse(fs.readFileSync(ordersPath, "utf8"));
const links = fs.existsSync(linksPath) ? JSON.parse(fs.readFileSync(linksPath, "utf8")) : [];

console.log(`Original Orders count: ${orders.length}`);
console.log(`Original Links count: ${links.length}`);

// 2. Define filter logic
const shouldRemove = (order) => {
  const title = (order.title || "").toLowerCase();
  const fullPath = (order.full_path || "").toLowerCase();
  const category = (order.category || "").toLowerCase();
  const inScope = (order.in_scope || "Y").toUpperCase();
  
  // Rule A: Remove Service Books
  if (title.includes("service book") || fullPath.includes("service book") || title.includes("servicebook") || fullPath.includes("servicebook")) {
    return { remove: true, reason: "Service Book (Confidential personal record)" };
  }
  
  // Rule B: Remove draft documents, not submitted, or trainee files
  if (fullPath.includes("not submitted") || fullPath.includes("not_submitted") || title.includes("draft") || fullPath.includes("draft") || title.includes("trainee") || fullPath.includes("trainee")) {
    return { remove: true, reason: "Draft/Unsubmitted Document (Unsigned by authority)" };
  }
  
  // Rule C: Remove temporary files
  if (title.startsWith("~$") || title.startsWith("~") || title.endsWith(".tmp") || fullPath.includes(".tmp")) {
    return { remove: true, reason: "Temporary / Backup File (Unsigned draft)" };
  }
  
  // Rule D: Remove files explicitly marked as out of scope, duplicated, or non-orders
  if (inScope === "N" || category === "non_order" || category === "order_dup" || category === "report_format") {
    return { remove: true, reason: `Marked as out-of-scope or duplicate (Category: ${category})` };
  }

  return { remove: false };
};

// 3. Clean
const cleanedOrders = [];
const deletedOrderIds = new Set();
const removedCounts = {};

orders.forEach(o => {
  const check = shouldRemove(o);
  if (check.remove) {
    deletedOrderIds.add(o.id);
    removedCounts[check.reason] = (removedCounts[check.reason] || 0) + 1;
  } else {
    cleanedOrders.push(o);
  }
});

// Clean links matching deleted order IDs
const cleanedLinks = links.filter(l => {
  if (deletedOrderIds.has(l.order_id) || deletedOrderIds.has(l.order_no)) {
    return false;
  }
  return true;
});

// 4. Print Summary
console.log("\n=== CLEANING SUMMARY ===");
Object.keys(removedCounts).forEach(reason => {
  console.log(`- Removed ${removedCounts[reason]} files due to: ${reason}`);
});
console.log(`\nDeleted total of ${deletedOrderIds.size} files.`);
console.log(`Cleaned Orders remaining: ${cleanedOrders.length}`);
console.log(`Cleaned Links remaining: ${cleanedLinks.length}`);

// 5. Write back to disk
fs.writeFileSync(ordersPath, JSON.stringify(cleanedOrders, null, 2), "utf8");
if (fs.existsSync(linksPath)) {
  fs.writeFileSync(linksPath, JSON.stringify(cleanedLinks, null, 2), "utf8");
}
console.log("\nSuccessfully committed cleaned database to disk!");
