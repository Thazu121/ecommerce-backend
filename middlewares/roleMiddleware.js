const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized: Login required"
            });
        }

        const userRole = req.user.role

        if (!userRole) {
            return res.status(403).json({
                message: "Access denied: role missing"
            })
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied: insufficient permissions"
            })
        }

        next()
    }
}

export default roleMiddleware;