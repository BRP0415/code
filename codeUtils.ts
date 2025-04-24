import { CodeState } from '../types';

export const getInitialCode = (): CodeState => {
  const savedCode = localStorage.getItem('code');
  if (savedCode) {
    try {
      return JSON.parse(savedCode) as CodeState;
    } catch (error) {
      console.error('Failed to parse saved code:', error);
    }
  }
  
  return {
    html: `<div class="container">
  <h1>Welcome to CodePlayground</h1>
  <p>Start editing the code to see live changes!</p>
  <button id="myButton" class="button">Click me!</button>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  padding: 2rem;
  background-color: #f8f9fa;
  color: #343a40;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #228be6;
}

p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #495057;
}

.button {
  background-color: #228be6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: #1971c2;
}`,
    js: `// Add interactivity to the button
const button = document.getElementById('myButton');

button.addEventListener('click', () => {
  // Change button text
  button.textContent = 'Clicked!';
  
  // Add a fun animation
  button.style.transform = 'scale(0.95)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 100);
  
  // Log to console
  console.log('Button clicked!');
});

// Log when the page loads
console.log('Script loaded successfully! 🚀');`
  };
};

export const combineCode = (
  htmlCode: string,
  cssCode: string,
  jsCode: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}</script>
      </body>
    </html>
  `;
};