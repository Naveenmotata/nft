


const transactionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalPrice: {
        type: Number,
        required: true // Total price including product price, delivery fee, and platform fee
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
