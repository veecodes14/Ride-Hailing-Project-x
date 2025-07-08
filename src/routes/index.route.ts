import express from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import rideRouter from "./ride.route";


const rootRouter = express.Router();

//authentication routes
rootRouter.use('/auth',authRouter);

//user routes
rootRouter.use('/status',userRouter);

//ride routes
rootRouter.use('/rides',rideRouter);



export default rootRouter;



// import express from 'express';
// import { Response } from "express";
// import router from './auth.routes';

// const rootRouter = express.Router();

// rootRouter.get("/test", (res: Response)=>{
//     res.status(200).json({
//         message: "working"
//     })
// })

// export default rootRouter;
