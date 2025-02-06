<script>
  let prompt = ''; // Text to translate
  let selectedLanguage = 'en'; // Selected language from dropdown
  let response = ''; // Dropdown translation result
  const openApiKey = "";
  // Detect language of the selected text
  

  // Function to translate text using the OpenAI API
  async function translateText(text, targetLanguage) {
    try {
      const translatedPrompt = `Translate to ${targetLanguage}: ${text}`;
      // Post request to OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: translatedPrompt }],
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error('No choices returned in API response');
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }


  // Translate input from the dropdown menu
  async function fetchData() {
    if (prompt.trim() === '') {
      response = 'Please enter a prompt';
      return;
    }

    const targetLanguage = selectedLanguage;
    response = await translateText(prompt, targetLanguage);
  }
</script>

<main>
  <h1 class="title">Translator</h1>

  <!-- Dropdown menu of languages -->
  <input class="prompt" type="text" bind:value={prompt} placeholder="Enter your prompt" />
  <select class="menu" bind:value={selectedLanguage}>
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="fr">French</option>
    <option value="de">German</option>
    <option value="zh">Chinese</option>
  </select>
  <button on:click={fetchData}>Translate</button>
  <p class="output">{response}</p>
</main>

<style>
  main {
    padding: 2rem;
    font-family: Arial, sans-serif;
    line-height: 1.6;
  }

  .prompt {
    margin-top: 0.5rem;
    width: 300px;
    font-size: 16px;
    border-radius: 8px;
  }

  .menu {
    width: 300px;
    font-size: 16px;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .output {
    margin-top: 1rem;
    font-size: 1rem;
  }

</style>
