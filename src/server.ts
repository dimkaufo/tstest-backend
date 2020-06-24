import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

// routes
import * as users from "./users/routes";

// middleware
import {verifyToken} from "./users/middleware";

const app = express();
const port = 8081 || process.env.PORT;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
router.get('/', (req, res) => res.json({data: "Test task API"}));
router.post('/login', users.login);
router.post('/register', users.register);
router.get('/me', verifyToken, users.me);
router.put('/settings', verifyToken, users.changeSettings);

app.use('/api/v1', router);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server started at http://localhost:${port}`);
});