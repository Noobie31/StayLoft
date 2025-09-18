import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "User doesn't have a token" });
        }
        let verifyToken;
        try {
            verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "User doesn't have a valid token fk off" });
        }
        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        // Avoid sending multiple responses
        if (!res.headersSent) {
            return res.status(500).json({ message: `isAuth error: ${error}` });
        }
    }
};

export default isAuth;
