const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user is attached by auth middleware
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized: Login required"
                });
            }

            // Get role from JWT payload
            const userRole = req.user.role;

            // Check role existence
            if (!userRole) {
                return res.status(403).json({
                    message: "Access denied: role missing"
                });
            }

            // Check permission
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: "Access denied: insufficient permissions"
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                message: "Server error in role middleware"
            });
        }
    };
};

export default roleMiddleware;
