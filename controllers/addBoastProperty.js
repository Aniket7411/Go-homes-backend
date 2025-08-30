// seed/boastPlans.js

const mongoose = require("mongoose");
const BoastPlan = require("../models/boastPlan.model"); // path as per your project

const plans = [
  { type: "BASIC", duration: 3, maxViews: 500, amount: 200 },
  { type: "STANDARD", duration: 7, maxViews: 1500, amount: 400 },
  { type: "PREMIUM", duration: 14, maxViews: 5000, amount: 800 },
];

async function seedBoastPlans() {
 await mongoose.connect('mongodb+srv://gohomes:GOHOMES@cluster0.mnavg.mongodb.net/gohomes?retryWrites=true&w=majority'); // change DB name

  for (const plan of plans) {
    await BoastPlan.updateOne(
      { type: plan.type },
      { $set: plan },
      { upsert: true }
    );
  }

  console.log("Boast plans seeded");
  await mongoose.disconnect();
}

seedBoastPlans().catch(console.error);
