import mongoose from "mongoose";

const tsalesSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      // 🔥 Normalize date to midnight so same day = same value
      set: (d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    },
    totalUnits: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalDiscounts: { type: Number, default: 0 },
    netRevenue: { type: Number, default: 0 },
    unitsbought: { type: Number, default: 0 },
    totalexpenditure: { type: Number, default: 0 },
    remarks: { type: String, default: "" },

    user_id: {
      type: String,
      required: true,
      index: true
    }
  },
  { timestamps: true, versionKey: false }
);

// 🔥 Enforce ONE record per user per day (DB-level guarantee)
tsalesSchema.index({ user_id: 1, date: 1 }, { unique: true });

// Auto-calc net revenue
tsalesSchema.pre("save", function (next) {
  this.netRevenue =
    (this.totalRevenue || 0) -
    (this.totalDiscounts || 0) -
    (this.totalexpenditure || 0);
  next();
});

const Tsales = mongoose.model("Tsales", tsalesSchema);
export default Tsales;
