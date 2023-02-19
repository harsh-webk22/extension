chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "get-meaning",
      title: "Get meaning",
      contexts: ["selection"]
    });
  });
  

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "get-meaning") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const word = window.getSelection().toString().trim();
          if (word.length > 0) {
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
              .then(response => response.json())
              .then(data => {
                if (data[0].meanings) {
                  const definition = data[0].meanings[0].definitions[0].definition;
                  const newNode = document.createElement("span");
                  newNode.style.color = "red";
                  newNode.innerText = definition;
                  const range = window.getSelection().getRangeAt(0);
                  range.deleteContents();
                  range.insertNode(newNode);
                }
              });
          }
        }
      });
    }
  });
  