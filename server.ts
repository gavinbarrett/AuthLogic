import * as express from 'express';
import { setupDB } from './server/utilities';
import { signIn, signUp } from './server/authenticate';

const app = express();
const port: number = 5000;
app.use(express.json());

app.post("/signIn", signIn);
app.post("/signUp", signUp);

app.listen(port, () => {
	setupDB();
	console.log(`Listening on port ${port}`);
});