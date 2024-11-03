import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token 
    if (!token) return res.status(401).json({success: false, message: "Unauthorized - no token provided"})
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //returns the payload if successful, every client token signed by same server env variable
        if (!decoded) return res.status(401).json({success: false, message: "Untahorized - invalid token"})
        req.userId = decoded.userId //middleware attaches userId to req, next middleware functions now have access to req.userId
        next()
    } catch (error) {
        return res.status(500).json({success: false, message: "Server error"})
    }
}
