import express from 'express';
import { ValidationError } from 'express-validation';
import routes from './routes/index.js';
import { errResponse } from './utils/response.js';
import statusCode from './utils/status-code.js';
import message from './utils/response-message.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/', routes);
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(errResponse(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
});

export default app;
