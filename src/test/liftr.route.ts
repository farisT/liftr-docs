import { Router, Request, Response, NextFunction} from "express"

export const LiftrRoute: Router = Router()
  .get('/liftr', (req,res)=> {
    res.send('test');
  })
