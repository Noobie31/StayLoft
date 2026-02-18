import genToken from "../config/token.js"
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"

export const sighUp = async (req, res) => {
    try {
        let { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        let existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        let hashPassword = await bcrypt.hash(password, 10)
        let user = await User.create({ name, email, password: hashPassword })
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        // Return user without password
        let userResponse = user.toObject()
        delete userResponse.password
        return res.status(201).json(userResponse)
    } catch (error) {
        return res.status(500).json({ message: `signup error ${error}` })
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        let user = await User.findOne({ email })
            .populate("listing", "title image1 image2 image3 description rent category city landMark bookedDates host ratings")
            .populate({
                path: "booking",
                populate: {
                    path: "listing",
                    select: "title image1 image2 image3 description rent category city landMark bookedDates host ratings"
                }
            })

        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        }
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        // Return user without password
        let userResponse = user.toObject()
        delete userResponse.password
        return res.status(200).json(userResponse)
    } catch (error) {
        return res.status(500).json({ message: `login error ${error}` })
    }
}

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        return res.status(200).json({ message: "Logout Successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })
    }
}