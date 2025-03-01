import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

export const createToken = (phone, email) => {
    return jwt.sign({ phone, email }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};