import jwt from 'jsonwebtoken';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
  
  if (!token) {
    return res.status(401).send({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const userId = error.expiredAt;
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