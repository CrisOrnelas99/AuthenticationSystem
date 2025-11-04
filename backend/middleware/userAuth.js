import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.json({success: false, message: "Not authorized. Login again"});
    }

    try{

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Good so far 1", tokenDecode?.id);

        if (!req.body) req.body = {};        // <-- ensure body exists for GETs
        req.body.userId = tokenDecode.id;    // attach for your controller
        next();

    }
    catch(error){
        res.json({success: false, message: "User Auth failed"});
    }
}

export default userAuth;