import App from './App.svelte';
import "carbon-components-svelte/css/all.css";

// customElements.define('my-element', MyElement);

const app = new App({
	target: document.body
});

// document.body.innerHTML = `
// 	<my-element>
// 		<p>This is some slotted content</p>
// 	</my-element>
// `;

export default app;