console.log('Content script loaded');

const openApiKey = ""; 
let currentText = '';
let widget = null;

function hideWidget() {
  if (widget) {
    widget.style.display = 'none';
    console.log('Widget hidden');
  }
}


document.addEventListener('mouseup', (event) => {
  // If the click happened inside the widget, do nothing
  if (widget && widget.contains(event.target)) {
    console.log('Clicked inside widget.');
    return;
  }

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText) {
    hideWidget();
    return;
  }

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    showWidget(selectedText, rect);
  } else {
    hideWidget();
  }
});

function showWidget(text, rect) {
  currentText = text; // Store the current selected text

  if (!widget) {
    widget = document.createElement('div');
    widget.id = 'text-widget';
    widget.style.position = 'absolute';
    widget.style.background = '#fff';
    widget.style.border = '1px solid #ccc';
    widget.style.padding = '10px';
    widget.style.borderRadius = '5px';
    widget.style.zIndex = '999999';
    widget.style.fontFamily = 'Arial, sans-serif';
    widget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    widget.style.color = '#000';
    widget.style.userSelect = 'text';

    const contentDiv = document.createElement('div');
    contentDiv.id = 'widget-content';
    widget.appendChild(contentDiv);

    const translateBtn = document.createElement('button');
    translateBtn.textContent = 'Translate';
    translateBtn.style.marginTop = '10px';
    translateBtn.style.padding = '5px 10px';
    translateBtn.style.border = 'none';
    translateBtn.style.borderRadius = '3px';
    translateBtn.style.cursor = 'pointer';
    translateBtn.style.fontFamily = 'Arial, sans-serif';
    translateBtn.style.background = '#007bff';
    translateBtn.style.color = '#fff';

    translateBtn.addEventListener('click', () => {
      translateSelectedText();
    });

    widget.appendChild(translateBtn);
    document.body.appendChild(widget);
  }

  const contentDiv = widget.querySelector('#widget-content');
  contentDiv.textContent = `Selected Text: ${text}`;

  widget.style.top = `${window.scrollY + rect.bottom + 5}px`;
  widget.style.left = `${window.scrollX + rect.left}px`;
  widget.style.display = 'block';

  console.log('Widget displayed with text:', text);
}

async function translateSelectedText() {
  if (!currentText) return;
  // Chinese char
  const isChinese = /[\u4e00-\u9fff]/.test(currentText);
  const prompt = isChinese 
    ? `Translate this Chinese text to English: "${currentText}"`
    : `Translate this English text to Chinese: "${currentText}"`;

  console.log('Translating text:', currentText);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const translated = data.choices[0].message.content.trim();
      currentText = translated; // Update the current text

      const contentDiv = widget.querySelector('#widget-content');
      contentDiv.textContent = `Selected Text: ${translated}`;

      console.log('Translation successful:', translated);
    } else {
      console.error('No translation result from API:', data);
    }
  } catch (error) {
    console.error('Error during translation:', error);
  }
}
