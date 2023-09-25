const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    // return res.status(401).json({ message: 'No token, authorization denied' });
    res.status(301).json({ message: 'Token is Not arrive...' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.email = decoded.email;
    console.log('JWT middleware start working');
    // req.password = decoded.password;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
