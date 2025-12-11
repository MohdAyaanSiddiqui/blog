const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createToken }  = require('../services/authentication')
const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    ProfileImage: {
        type: String,
        default: "/images/default.png",
    },
    Role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
}, { timestamps: true });


// 🔥 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", function () {
    if (!this.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");

    const hashedPassword = createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");

    this.Salt = salt;
    this.password = hashedPassword;

});


// 🔥 MATCH PASSWORD DURING LOGIN
userSchema.statics.matchPassword = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not Found");

    const userProvided = createHmac("sha256", user.Salt)
        .update(password)
        .digest("hex");

    if (user.password !== userProvided)
        throw new Error("Incorrect Password");

    const token = createToken(user)
    return token
};


module.exports = model("user", userSchema);
