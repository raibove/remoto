import express from 'express';
import { authorize } from "../auth/auth.middleware.js";

  const router = express.Router();
  
  
  router.get(
    '/profile',
    authorize,
    (req, res, next) => {
      res.json({
        message: 'You made it to the secure route',
        user: req.user,
        //token: req.query.secret_token
      })
    }
  );

export default router;
  