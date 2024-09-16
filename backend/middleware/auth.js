
import jwt from 'jsonwebtoken';

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // If the token has expired, generate a new token
      const userId = error.expiredAt; // Get the user ID from the expired token
      const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.header('Authorization', `Bearer ${newToken}`);
      next();
    } else {
      return res.status(401).send({ message: 'Invalid or expired token' });
    }
  }
};

export default authenticateUser;