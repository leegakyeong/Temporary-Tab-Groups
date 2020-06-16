chrome.runtime.onInstalled.addListener(function() {
  console.log('Installed Temporary Tab Groups');

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {urlMatches: 'https?://*/*'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'addTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      chrome.storage.sync.get('TTG', function(result) {
        // 중복되는 거 추가하는 거 나중에 하기! 나중에 폴더 구분을 하면 구현해야 함
        if (result.TTG[currentTab.url]) {
          // alert('이미 저장한 탭(링크?)입니다.');
        } else {
          result.TTG[currentTab.url] = currentTab;
          chrome.storage.sync.set({ TTG: result.TTG }, function() {
            chrome.runtime.sendMessage({ shortcut: 'addTab', currentTab });
          });
        }
      });
    });
  }
});
