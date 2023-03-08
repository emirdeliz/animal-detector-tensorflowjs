import { App } from "../client/App";
import { renderToString } from "react-dom/server";

const app = renderToString(App);
const html = `
	<html lang='en'>
		<head>
			<!-- Load TensorFlow.js. This is required to use coco-ssd model. -->
			<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>

			<!-- Load the coco-ssd model. -->
			<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"></script>
			<script src='/client.js' async defer type="text/javascript"></script>
		<body>
			<div id='root'>${app}</div>
		</body>
	</html>
`;

export const htmlString = html;
